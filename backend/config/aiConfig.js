// Centralized AI provider config. Source of truth: /Brain.md section 4.
// Loads provider keys from env; never hardcode keys.

const dotenv = require("dotenv");
dotenv.config();

const getEnv = (name, required) => {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value || "";
};

const aiConfig = {
  primary_provider: process.env.AI_PRIMARY_PROVIDER || "gemini",
  fallback_provider: process.env.AI_FALLBACK_PROVIDER || "openai",
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  },
  // Per-provider circuit breaker defaults
  circuit: {
    maxFailures: 3,
    backoffMs: 60 * 1000,
  },
  // True if the primary (Gemini) is configured at all
  get hasPrimary() {
    return Boolean(this.gemini.apiKey);
  },
  get hasFallback() {
    return Boolean(this.openai.apiKey);
  },
};

module.exports = aiConfig;
