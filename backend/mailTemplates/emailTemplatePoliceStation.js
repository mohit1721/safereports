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
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #004085;
          }
          .content {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
          }
          .footer {
            font-size: 14px;
            text-align: center;
            color: #888;
          }
          .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            background-color: #004085;
            color: white;
            text-align: center;
            border-radius: 4px;
            text-decoration: none;
          }
          .button:hover {
            background-color: #002752;
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
  //             <p>Please log in and change your password immediately for security purposes.</p>
