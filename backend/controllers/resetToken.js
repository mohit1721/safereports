const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

// Raw token is emailed; only the hash is persisted in the DB.
const generateResetToken = async () => {
  const raw = crypto.randomBytes(32).toString("hex");
  const hashed = await bcrypt.hash(raw, 10);
  const expires = Date.now() + RESET_TOKEN_TTL_MS;
  return { raw, hashed, expires };
};

const verifyResetToken = async (record, rawToken) => {
  if (!record || !record.resetPasswordToken) {
    return { ok: false, reason: "INVALID" };
  }
  if (Date.now() > new Date(record.resetPasswordExpire).getTime()) {
    return { ok: false, reason: "EXPIRED" };
  }
  const match = await bcrypt.compare(rawToken, record.resetPasswordToken);
  if (!match) return { ok: false, reason: "INVALID" };
  return { ok: true };
};

module.exports = { generateResetToken, verifyResetToken, RESET_TOKEN_TTL_MS };
