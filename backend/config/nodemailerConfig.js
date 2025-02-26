const nodemailer = require("nodemailer");
const emailTemplatePoliceStation = require("../mailTemplates/emailTemplatePoliceStation");

const sendPoliceStationCredentials = async (email, name, password) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
// police-station/login
        const loginLink = "http://localhost:3000/police-station/login";

        const mailOptions = {
            from: ` "SafeReport Support" <${process.env.EMAIL_USER}`,
            to: email,
            subject: "🔑 Police Station Registration Credentials",
            html: emailTemplatePoliceStation(name, email, password, loginLink),
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Police station credentials email sent successfully");
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
};

module.exports = sendPoliceStationCredentials;
