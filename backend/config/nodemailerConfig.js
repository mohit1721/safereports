const sendEmail = require("./sendEmail");
const emailTemplatePoliceStation = require("../mailTemplates/emailTemplatePoliceStation");

const FRONTEND_URL = process.env.FRONTEND_URL || "https://safetoreport.vercel.app";

const sendPoliceStationCredentials = async (email, name, resetLink) => {
  const html = emailTemplatePoliceStation(
    name,
    email,
    resetLink,
    `${FRONTEND_URL}/login`
  );
  return sendEmail(email, "🔑 Police Station Registered — Set Your Password", html);
};

module.exports = sendPoliceStationCredentials;
