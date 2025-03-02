const contactEmailTemplate = (name, email, message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
            body {
                background-color: #121212;
                color: #ffffff;
                font-family: Arial, sans-serif;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background-color: #1e1e1e;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);
            }
            h2 {
                color:rgb(22, 55, 187);
                text-align: center;
            }
            p {
                font-size: 16px;
                margin: 10px 0;
                color: #ddd;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #888;
            }
            .footer a {
                color:rgb(35, 39, 165);
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color:rgb(43, 48, 175);">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <div class="footer">
                <p>SafeReport Team</p>
                <p><a href="https://safereport.vercel.app">Visit SafeReport</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
};
