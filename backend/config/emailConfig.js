const dotenv = require("dotenv");

dotenv.config();

const getEmailConfig = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || "";
  const port =
    parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "", 10) ||
    (host.includes("gmail") ? 587 : 465);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || "";
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || "";
  const from =
    process.env.EMAIL_FROM || (user ? `"SafeReport Support" <${user}>` : "");
  return { host, port, user, pass, from };
};

const getResendConfig = () => {
  const apiKey = process.env.RESEND_API_KEY || "";
  const from =
    process.env.RESEND_FROM ||
    process.env.EMAIL_FROM ||
    (process.env.SMTP_USER || process.env.EMAIL_USER
      ? `"SafeReport Support" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`
      : "");
  return { apiKey, from };
};

// Fail-fast: call at startup. Prefers SMTP_* vars, falls back to EMAIL_* for backward compat.
// If Resend is configured, SMTP is not strictly required.
const validateEmailConfig = () => {
  if (process.env.RESEND_API_KEY) {
    return true; // Resend fallback/primary configured
  }
  const cfg = getEmailConfig();
  const missing = [];
  if (!cfg.host) missing.push("SMTP_HOST/EMAIL_HOST");
  if (!cfg.user) missing.push("SMTP_USER/EMAIL_USER");
  if (!cfg.pass) missing.push("SMTP_PASS/EMAIL_PASS");
  if (missing.length) {
    console.error(
      "❌ Email config error: missing " +
        missing.join(", ") +
        ". Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM (or RESEND_API_KEY) in .env"
    );
    return false;
  }
  return true;
};

module.exports = { getEmailConfig, getResendConfig, validateEmailConfig };
