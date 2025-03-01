const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
// http://localhost:5173/login
const loginLink = "https://safetoreport.vercel.app/login";
        const mailOptions = {
            from: `"SafeReport Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent,
            loginLink
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to} successfully`);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
    }
};

module.exports = sendEmail;
