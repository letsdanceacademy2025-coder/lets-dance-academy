const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const SENDER_EMAIL = process.env.SENDER_EMAIL || '';

interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendEmail({ to, subject, htmlContent, textContent }: SendEmailParams): Promise<boolean> {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not defined');
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: SENDER_EMAIL,
          name: "Let's Dance Academy",
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent,
        textContent: textContent || subject,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      throw new Error(`Failed to send email: ${errorData.message || response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendPasswordResetOTP(email: string, otp: string, userName: string): Promise<boolean> {
  const subject = 'Password Reset OTP - Let\'s Dance Academy';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background-color: #000;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
        .content {
          background-color: #fff;
          padding: 30px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .otp {
          font-size: 32px;
          font-weight: bold;
          color: #000;
          text-align: center;
          padding: 20px;
          background-color: #f0f0f0;
          border-radius: 5px;
          letter-spacing: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Let's Dance Academy</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>We received a request to reset your password. Use the OTP below to reset your password:</p>
          <div class="otp">${otp}</div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>For security reasons, never share this OTP with anyone.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Let's Dance Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `Hello ${userName},\n\nYour password reset OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`;

  return sendEmail({ to: email, subject, htmlContent, textContent });
}

export async function sendWelcomeEmail(email: string, userName: string): Promise<boolean> {
  const subject = 'Welcome to Let\'s Dance Academy!';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background-color: #000;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
        .content {
          background-color: #fff;
          padding: 30px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Let's Dance Academy!</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Thank you for registering with Let's Dance Academy. We're excited to have you join our community!</p>
          <p>You can now access your dashboard and explore our dance classes, workshops, and more.</p>
          <p>If you have any questions, feel free to reach out to us.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Let's Dance Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, htmlContent });
}

export async function sendAdminCreatedEmail(
  email: string,
  adminName: string,
  temporaryPassword: string
): Promise<boolean> {
  const subject = 'Your Admin Account - Let\'s Dance Academy';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background-color: #000;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
        .content {
          background-color: #fff;
          padding: 30px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .credentials {
          background-color: #f0f0f0;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
        .warning {
          color: #d9534f;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Let's Dance Academy - Admin Access</h1>
        </div>
        <div class="content">
          <h2>Hello ${adminName},</h2>
          <p>An admin account has been created for you at Let's Dance Academy.</p>
          <div class="credentials">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
          </div>
          <p class="warning">⚠️ Please change your password immediately after your first login for security purposes.</p>
          <p>You now have access to the admin panel where you can manage the academy.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Let's Dance Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, htmlContent });
}

export async function sendEnrollmentStatusEmail(
  email: string,
  userName: string,
  status: 'active' | 'rejected',
  courseTitle: string,
  type: 'batch' | 'workshop'
): Promise<boolean> {
  const isAccepted = status === 'active';
  const subject = isAccepted
    ? `Enrollment Accepted: ${courseTitle} - Let's Dance Academy`
    : `Enrollment Update: ${courseTitle} - Let's Dance Academy`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background-color: #000;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
        .content {
          background-color: #fff;
          padding: 30px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .status-badge {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 5px;
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          background-color: ${isAccepted ? '#28a745' : '#dc3545'};
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Let's Dance Academy</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>We are writing to update you on your enrollment status for <strong>${courseTitle}</strong>.</p>
          
          <div style="text-align: center;">
            <div class="status-badge">
              ${isAccepted ? 'Enrollment Accepted' : 'Enrollment Rejected'}
            </div>
          </div>

          ${isAccepted
      ? `<p>Congratulations! Your payment has been verified and your enrollment is now active. You can now access all the course materials and join the sessions.</p>
               <p>Please log in to your dashboard to get started.</p>`
      : `<p>Unfortunately, your enrollment request could not be processed at this time.</p>
               <p>This may be due to an issue with verifying your payment details (UTR Number). Please verify your details and try again, or contact support if you believe this is an error.</p>`
    }
          
          <p>If you have any questions, feel free to reply to this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Let's Dance Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, htmlContent });
}
