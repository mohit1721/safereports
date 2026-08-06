const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const aiConfig = require("../config/aiConfig");
const brain = require("../config/brainPrompts");

const extractAnalysis = (text = "") => ({
  title: text.match(/TITLE:\s*(.+)/)?.[1]?.trim() || "",
  category: text.match(/CATEGORY:\s*(.+)/)?.[1]?.trim() || "",
  description: text.match(/DESCRIPTION:\s*(.+)/)?.[1]?.trim() || "",
});

// Per-provider circuit breaker (see Brain.md §4)
const breaker = {
  gemini: { failures: 0, openedAt: 0 },
  openai: { failures: 0, openedAt: 0 },
};

const isOpen = (name) => {
  const b = breaker[name];
  return (
    b.failures >= aiConfig.circuit.maxFailures &&
    Date.now() - b.openedAt < aiConfig.circuit.backoffMs
  );
};
const recordSuccess = (name) => {
  breaker[name].failures = 0;
};
const recordFailure = (name) => {
  const b = breaker[name];
  if (b.failures === 0) b.openedAt = Date.now();
  b.failures += 1;
};

const isRetryable = (err) => {
  const status =
    (err && err.status) || (err && err.response && err.response.status) || 0;
  const msg = (err && (err.message || "")) || "";
  return (
    status === 429 ||
    (status >= 500 && status < 600) ||
    /quota|rate.?limit|RESOURCE_EXHAUSTED|insufficient/i.test(msg)
  );
};

const parseDataUrl = (dataUrl) => {
  const m = String(dataUrl || "").match(/^data:(.*);base64,(.*)$/);
  if (!m) return null;
  return { mimeType: m[1], base64: m[2] };
};

const callGemini = async (kind, { base64, mimeType }) => {
  const genAI = new GoogleGenerativeAI(aiConfig.gemini.apiKey);
  const model = genAI.getGenerativeModel({ model: aiConfig.gemini.model });
  const prompt = kind === "video" ? brain.buildVideoPrompt() : brain.buildImagePrompt();
  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64, mimeType } },
  ]);
  return result.response.text();
};

const callOpenAI = async (kind, { base64, mimeType }) => {
  const prompt = kind === "video" ? brain.buildVideoPrompt() : brain.buildImagePrompt();
  const content = [{ type: "text", text: prompt }];
  if (kind === "image" && base64) {
    content.push({
      type: "image_url",
      image_url: { url: `data:${mimeType};base64,${base64}` },
    });
  }
  const { data } = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: aiConfig.openai.model,
      messages: [{ role: "user", content }],
      max_tokens: 300,
    },
    {
      headers: { Authorization: `Bearer ${aiConfig.openai.apiKey}` },
      timeout: 10000,
    }
  );
  return data.choices?.[0]?.message?.content || "";
};

// Primary Gemini -> fallback OpenAI -> placeholder. Never throws; never blocks the UI.
const analyzeMedia = async (kind, dataUrl) => {
  const parts = parseDataUrl(dataUrl);
  if (!parts) return { aiFailed: true, title: "", category: "", description: "" };

  if (aiConfig.hasPrimary && !isOpen("gemini")) {
    try {
      const text = await callGemini(kind, parts);
      recordSuccess("gemini");
      return { aiFailed: false, ...extractAnalysis(text), provider: "gemini" };
    } catch (err) {
      recordFailure("gemini");
      console.log(`[AI] Gemini failed: ${err.message}`);
    }
  }

  if (aiConfig.hasFallback && !isOpen("openai")) {
    try {
      const text = await callOpenAI(kind, parts);
      recordSuccess("openai");
      return { aiFailed: false, ...extractAnalysis(text), provider: "openai" };
    } catch (err) {
      recordFailure("openai");
      console.log(`[AI] OpenAI fallback failed: ${err.message}`);
    }
  }

  return { aiFailed: true, title: "", category: "", description: "" };
};

module.exports = { analyzeMedia, isRetryable };
