const emailTemplatePasswordReset = (name, resetLink) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #121212;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #1e1e1e;
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(255,255,255,0.1);
      }

      .header {
        text-align: center;
        padding-bottom: 20px;
      }

      .header h1 {
        color: #4fc3f7;
        margin: 0;
      }

      .content {
        font-size: 16px;
        line-height: 1.6;
        color: #ffffff;
      }

      .content p {
        color: #ffffff;
        margin: 0 0 16px;
      }

      .security-warning {
        font-size: 14px;
        color: #bdbdbd !important;
      }

      .footer {
        text-align: center;
        font-size: 14px;
        color: #bdbdbd;
        margin-top: 20px;
      }

      .footer p {
        color: #bdbdbd;
        margin: 6px 0;
      }

      .button {
        display: block;
        width: 240px;
        margin: 24px auto;
        padding: 12px 20px;
        background-color: #4fc3f7;
        color: #121212 !important;
        text-align: center;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
      }

      .button:visited {
        color: #121212 !important;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>

      <div class="content">
        <p>Dear ${name},</p>

        <p>
          We received a request to reset your SafeReport password.
          Click the button below to choose a new password:
        </p>

        <a href="${resetLink}" class="button">
          Reset Password
        </a>

        <p class="security-warning">
          This link is valid for 1 hour and can only be used once.
          If you did not request this, you can safely ignore this email.
        </p>
      </div>

      <div class="footer">
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,<br>SafeReport Team</p>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = emailTemplatePasswordReset;