const admin = require('./firebaseAdmin');
const nodemailer = require('nodemailer');

/**
 * Sends a verification email using Firebase Auth to generate a verification link.
 * The link redirects to the frontend verification page with a custom token query param.
 * @param {string} email - User's email address
 * @param {string} token - Verification token stored in DB
 */
const sendVerificationEmail = async (email, token) => {
  const redirectUrl = `${process.env.FRONTEND_URL || 'http://:5173'}/verify-email?token=${token}`;
  const actionCodeSettings = {
    url: redirectUrl,
    handleCodeInApp: true,
  };

  // Generate a Firebase Email Verification link (it will still show Firebase's branding but redirects to our URL)
  const verificationLink = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER || 'test@ethereal.email',
      pass: process.env.SMTP_PASS || 'pass123',
    },
  });

  const mailOptions = {
    from: '"Gents Clothes" <noreply@gentsclothes.com>',
    to: email,
    subject: 'Verify your Gents Clothes account',
    html: `<p>Please click the link below to verify your email address:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (err) {
    console.error('Failed to send verification email:', err);
  }
};

module.exports = sendVerificationEmail;
