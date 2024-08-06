const generateVerificationEmail = (verifyLink, email) => {
  return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #e9ecef;
                margin: 0;
                padding: 0;
              }
              .container {
                background-color: #ffffff;
                margin: 0 auto;
                padding: 40px 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                text-align: center;
              }
              h1 {
                color: #333333;
                font-size: 24px;
                margin-bottom: 20px;
              }
              p {
                color: #666666;
                font-size: 16px;
                margin-bottom: 20px;
              }
              .verify-button {
                display: inline-block;
                padding: 12px 24px;
                color: #ffffff;
                background-color: #28a745;
                text-decoration: none;
                border-radius: 4px;
                font-size: 16px;
              }
              .verify-button:hover {
                background-color: #218838;
              }
              .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #aaaaaa;
              }
              .footer a {
                color: #0062cc;
                text-decoration: none;
              }
              .footer a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Please verify your email address for CollaborAPI</h1>
              <p>by clicking the button below.</p>
              <a href="${verifyLink}" class="verify-button">Verify My Email</a>
              <p class="footer">
                Alternatively, you can directly paste this link in your browser<br>
                <a href="${verifyLink}">${verifyLink}</a>
              </p>
              <p class="footer">This email is meant for ${email}</p>
            </div>
          </body>
        </html>
      `;
};

module.exports = { generateVerificationEmail };
