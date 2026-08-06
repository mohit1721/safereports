// Central prompt builders. Source of truth: /Brain.md (keep in sync).
// All prompts are intentionally short to minimize token usage.

const CATEGORY_LIST =
  "Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, " +
  "Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, " +
  "Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, " +
  "Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, " +
  "Natural Disaster, Violence, Other";

const buildImagePrompt = () =>
  "Analyze this emergency image. Reply EXACTLY:\nTITLE: <brief title>\n" +
  `CATEGORY: <one from category list>\nDESCRIPTION: <one concise sentence>`;

const buildVideoPrompt = () =>
  "Analyze this emergency video. Reply EXACTLY:\nTITLE: <brief title>\n" +
  `CATEGORY: <one from category list>\nDESCRIPTION: <one concise sentence>`;

const buildClassificationPrompt = (text) =>
  `Classify this incident text. Reply EXACTLY:\nCATEGORY: <one from category list>\nSEVERITY: <low|medium|high>\n\nTEXT: ${text}`;

const buildReportPrompt = (facts) =>
  "From these facts write a police report. Reply EXACTLY:\nTITLE: <brief title>\n" +
  "DESCRIPTION: <2-3 factual sentences>\nSTATUS: <PENDING|IN_PROGRESS|RESOLVED|DISMISSED>\n\n" +
  `FACTS: ${facts}`;

module.exports = {
  CATEGORY_LIST,
  buildImagePrompt,
  buildVideoPrompt,
  buildClassificationPrompt,
  buildReportPrompt,
};
