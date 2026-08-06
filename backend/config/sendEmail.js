const nodemailer = require("nodemailer");
const { getEmailConfig, getResendConfig } = require("./emailConfig");

const createTransporter = () => {
  const cfg = getEmailConfig();
  if (!cfg.host || !cfg.user || !cfg.pass) return null;
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
  });
};

// Transient errors worth retrying: network drops, SMTP 5xx, timeouts
const TRANSIENT_RE = /ECONNRESET|ETIMEDOUT|ESOCKET|5\d\d|too many|connect/i;

const sendViaSMTP = async (to, subject, html, retries) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.error("❌ SMTP not configured, skipping");
    return false;
  }

  const cfg = getEmailConfig();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await transporter.sendMail({
        from: cfg.from,
        to,
        subject,
        html,
      });
      console.log(`✅ Email sent to ${to} via SMTP (${subject})`);
      return true;
    } catch (err) {
      const transient = TRANSIENT_RE.test(err.message || "");
      console.error(
        `❌ SMTP email to ${to} (${subject}) failed (attempt ${attempt + 1}/${retries + 1}):`,
        err.message
      );
      if (!transient || attempt === retries) {
        return false;
      }
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return false;
};

const sendViaResend = async (to, subject, html) => {
  const cfg = getResendConfig();
  if (!cfg.apiKey) {
    console.error("❌ Resend fallback skipped: RESEND_API_KEY not set");
    return false;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: cfg.from, to, subject, html }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      console.log(`✅ Email sent to ${to} via Resend (${subject})`);
      return true;
    }

    const errBody = await res.text();
    console.error(`❌ Resend email to ${to} (${subject}) failed: ${res.status} ${errBody}`);
    if (res.status === 403 && /domain|onboarding@resend\.dev/i.test(errBody)) {
      console.error(
        "   💡 Resend only allows onboarding@resend.dev to send to your own email. " +
          "Verify a domain at https://resend.com/domains and set RESEND_FROM to an address on it " +
          "(e.g. \"SafeReport Support <support@yourdomain.com>\") to reach other recipients."
      );
    }
    return false;
  } catch (err) {
    console.error(`❌ Resend email to ${to} (${subject}) failed:`, err.message);
    return false;
  }
};

// Primary: SMTP (with retries). Fallback: Resend API. Never throws; logs failures.
const sendEmail = async (to, subject, html, retries = 2) => {
  if (await sendViaSMTP(to, subject, html, retries)) return true;
  if (await sendViaResend(to, subject, html)) return true;
  return false;
};

module.exports = sendEmail;
