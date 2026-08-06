const emailTemplatePoliceReport = (loginLink, policeStationName, title, category, address) => {
    return `
    <!DOCTYPE html>
    <html lang="en"> 
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Report Assigned</title>

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

          .email-body {
            padding: 20px;
            color: #ffffff;
          }

          .email-body p {
            color: #ffffff;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 16px;
          }

          .email-body b {
            color: #ffffff;
          }

          .title {
            color: #ff5252;
            font-size: 22px;
            text-align: center;
            font-weight: bold;
            margin: 0 0 24px;
          }

          .details {
            margin-bottom: 20px;
          }

          .details p {
            color: #ffffff;
          }

          .highlight {
            color: #4fc3f7 !important;
            font-weight: bold;
          }

          .button {
            display: block;
            width: 220px;
            margin: 24px auto;
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

          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #bdbdbd;
          }

          .footer p {
            color: #bdbdbd;
            margin: 6px 0;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="email-body">
            <h2 class="title">🚨 New Report Assigned</h2>

            <p>
              Hello <b class="highlight">${policeStationName}</b>,
            </p>

            <p>
              A new report has been assigned to your police station.
              Please review the details below:
            </p>

            <div class="details">
              <p>
                <b>🔹 Report Title:</b>
                <span class="highlight">${title}</span>
              </p>

              <p>
                <b>📌 Category:</b>
                <span class="highlight">${category}</span>
              </p>

              <p>
                <b>📍 Address:</b>
                <span class="highlight">${address}</span>
              </p>
            </div>

            <p>Please take necessary action as soon as possible.</p>

            <a href="${loginLink}" class="button">
              View Report
            </a>

            <p>Thank you for your service.</p>

            <p>
              Best Regards,<br>
              <b>SafeReport Team</b>
            </p>
          </div>

          <div class="footer">
            <p>&copy; 2025 SafeReport. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>`;
};

module.exports = emailTemplatePoliceReport;