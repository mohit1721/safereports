const emailTemplatePoliceStation = (name, email, resetLink, loginLink) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Police Station Registration</title>

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
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
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
          margin-bottom: 20px;
        }

        .content p {
          color: #ffffff;
          margin: 0 0 16px;
        }

        .content strong {
          color: #ffffff;
        }

        .security-warning {
          font-size: 15px;
          color: #ffb4b4 !important;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .footer {
          font-size: 14px;
          text-align: center;
          color: #bdbdbd;
        }

        .footer p {
          color: #bdbdbd;
          margin: 6px 0;
        }

        .button {
          display: block;
          width: 240px;
          margin: 16px auto;
          padding: 12px;
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

        .button.secondary {
          background-color: #2a2a2a;
          color: #ffffff !important;
          border: 1px solid #444;
        }

        .button.secondary:visited {
          color: #ffffff !important;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div class="header">
          <h1>Police Station Registered</h1>
        </div>

        <div class="content">
          <p>Dear ${name},</p>

          <p>
            Your police station has been registered in the SafeReport system.
          </p>

          <p>
            <strong>Email:</strong> ${email}
          </p>

          <p class="security-warning">
            Set your password using the secure link below, then log in to your
            dashboard. The link is valid for 1 hour and can only be used once.
          </p>

          <a href="${resetLink}" class="button">
            Set Your Password
          </a>

          <a href="${loginLink}" class="button secondary">
            Go to Login
          </a>
        </div>

        <div class="footer">
          <p>If you have any questions, feel free to contact us.</p>
          <p>Best regards,<br>SafeReport Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = emailTemplatePoliceStation;