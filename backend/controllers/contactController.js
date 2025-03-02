const nodemailer = require('nodemailer');
const contactEmailTemplate = require("../mailTemplates/contactMailTemplate")
const sendContactEmail = async (req, res) => {
    console.log("contact req from fe", req.body)
    try {
        // console.log("contact req from fe", req.body)
        const { name, email, message } = req.body;

        // Validate request data
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use other providers or SMTP
            auth: {
                user: process.env.EMAIL_USER, // Set this in your .env file
                pass: process.env.EMAIL_PASS, // Set this in your .env file
            },
        });

        // Email options
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: 'mohitmandal192@gmail.com', // SafeReport system email
            subject: 'New Contact Form Submission',
            html: contactEmailTemplate(name, email, message),

        };

        // Send email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({success: true, message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({success: false, message: 'Failed to send message' });
    }
};

module.exports = { sendContactEmail };
