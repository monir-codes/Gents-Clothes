const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER || 'test@ethereal.email',
      pass: process.env.SMTP_PASS || 'pass123',
    },
  });
};

const sendEmailWrapper = async (mailOptions) => {
  if (!process.env.SMTP_USER) {
    console.log('\n=============================================');
    console.log(`[DEV MODE] Email to ${mailOptions.to} (${mailOptions.subject})`);
    console.log(`Body: ${mailOptions.text || 'HTML Content'}`);
    console.log('=============================================\n');
    return;
  }
  const transporter = createTransporter();
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendOtpEmail = async (email, otp, type = 'Verification') => {
  const mailOptions = {
    from: '"Gents Clothes" <noreply@gentsclothes.com>',
    to: email,
    subject: `${type} OTP - Gents Clothes`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">${type} OTP</h2>
        <p style="color: #555; font-size: 16px; text-align: center;">Your One Time Password (OTP) is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #f4f4f4; border: 1px solid #ccc; padding: 12px 24px; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 4px;">${otp}</span>
        </div>
        <p style="color: #777; font-size: 14px; text-align: center;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
    text: `Your OTP is: ${otp}`,
  };
  await sendEmailWrapper(mailOptions);
};

const sendPasswordResetEmail = async (email, otp) => {
  const mailOptions = {
    from: '"Gents Clothes" <noreply@gentsclothes.com>',
    to: email,
    subject: `Password Reset OTP - Gents Clothes`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Password Reset</h2>
        <p style="color: #555; font-size: 16px; text-align: center;">You requested a password reset. Your One Time Password (OTP) is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #f4f4f4; border: 1px solid #ccc; padding: 12px 24px; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 4px;">${otp}</span>
        </div>
        <p style="color: #777; font-size: 14px; text-align: center;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
    text: `Your Password Reset OTP is: ${otp}`,
  };
  await sendEmailWrapper(mailOptions);
};

const sendOrderNotificationEmail = async (adminEmail, orderData) => {
  const mailOptions = {
    from: '"Gents Clothes" <noreply@gentsclothes.com>',
    to: adminEmail,
    subject: `New Order Received! #${orderData.customId || orderData._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">New Order Notification</h2>
        <p style="color: #555; font-size: 16px;">A new order has been placed on Gents Clothes.</p>
        <ul style="color: #555; font-size: 14px; line-height: 1.6;">
          <li><strong>Order ID:</strong> ${orderData.customId || orderData._id}</li>
          <li><strong>Total Amount:</strong> ৳${orderData.totalPrice}</li>
          <li><strong>Payment Method:</strong> ${orderData.paymentMethod}</li>
        </ul>
        <p style="color: #777; font-size: 14px; margin-top: 20px;">Please check the admin dashboard for more details.</p>
      </div>
    `,
    text: `New Order Received. Order ID: ${orderData.customId || orderData._id}, Total: ৳${orderData.totalPrice}`,
  };
  await sendEmailWrapper(mailOptions);
};

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail,
  sendOrderNotificationEmail
};
