const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
  // Configured for local development or testing with Mailtrap / standard SMTP.
  // In production, these should come from process.env (e.g. process.env.SMTP_USER)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER || 'test@ethereal.email',
      pass: process.env.SMTP_PASS || 'pass123',
    },
  });

  const verificationUrl = `${process.env.FRONTEND_URL || 'http://:5173'}/verify-email/${token}`;

  // If there are no real credentials provided, we just log the URL to the console for dev purposes.
  if (!process.env.SMTP_USER) {
    console.log('\n=============================================');
    console.log(`[DEV MODE] Verification Email Link for ${email}:`);
    console.log(verificationUrl);
    console.log('=============================================\n');
    return;
  }

  const mailOptions = {
    from: '"GentFits" <noreply@gentfits.com>',
    to: email,
    subject: 'Verify your GentFits account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Welcome to GentFits!</h2>
        <p style="color: #555; font-size: 16px;">Thank you for registering. Please confirm your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p style="color: #777; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #0066cc; word-break: break-all;">${verificationUrl}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">If you did not create an account, no further action is required.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    // Even if it fails, we log the URL so the developer can verify during dev
    console.log('\n[FALLBACK] Verification Link:', verificationUrl, '\n');
  }
};

module.exports = sendVerificationEmail;
