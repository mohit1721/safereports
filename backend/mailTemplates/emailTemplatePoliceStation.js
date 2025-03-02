const emailTemplatePoliceStation = (name, email, password, loginLink) => {
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
          color: #e0e0e0;
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
        }
        .content {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .security-warning {
          font-size: 15px;
          color:rgb(197, 24, 24);
          font-weight: bold;
          margin-bottom: 20px;
        }
        .footer {
          font-size: 14px;
          text-align: center;
          color: #b0b0b0;
        }
        .button {
          display: block;
          width: 220px;
          margin: 20px auto;
          padding: 12px;
          background-color: #4fc3f7;
          color: #121212;
          text-align: center;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          transition: background 0.3s ease;
        }
        .button:hover {
          background-color: #039be5;
        }
      </style>
    </head>
    <body>

      <div class="container">
        <div class="header">
          <h1>Police Station Registration Successful</h1>
        </div>

        <div class="content">
          <p>Dear ${name},</p>
          <p>Your police station has been successfully registered in the SafeReport system. Below are your login credentials:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p class="security-warning">Please log in and change your password immediately for security purposes.</p>
        </div>

        <a href="${loginLink}" class="button">Login Now</a>

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
