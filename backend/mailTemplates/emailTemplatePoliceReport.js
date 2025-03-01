const emailTemplatePoliceReport = (policeStationName, title, category, address) => {
    return `
    <html>
        <head>
            <style>
                .container {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background-color:rgb(51, 69, 88);
                }
                .email-body {
                    background-color: #fff32;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px #ddd;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: gray;
                }
                .title {
                    color: #d32f2f;
                }
                .details {
                    font-size: 16px;
                    line-height: 24px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="email-body">
                    <h2>🚨 New Report Assigned</h2>
                    <p>Hello <b>${policeStationName}</b>,</p>
                    <p>A new report has been assigned to your police station. Please review the details below:</p>

                    <div class="details">
                        <p><b>🔹 Report Title:</b> ${title}</p>
                        <p><b>📌 Category:</b> ${category}</p>
                        <p><b>📍 Address:</b> ${address}</p>
                    </div>

                    <p>Please take necessary action as soon as possible.</p>
                    <p>Login to see Description of the report</p>
                    <p>Thank you for your service.</p>

                    <p>Best Regards,</p>
                    <p><b>SafeReport Team</b></p>
                </div>
                
                <div class="footer">
                    <p>&copy; 2025 SafeReport. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>`;
};

module.exports = emailTemplatePoliceReport;
