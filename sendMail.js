import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const VerifyEmail = async (email, verificationUrl) => {
  try {
    const mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailDetails = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h1>Verify Your Email Address</h1>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="padding:10px 20px; background:#28a745; color:#fff; text-decoration:none;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
        <P>This Link Expires in 10 minutes</P>
      `,
    };

    await mailTransport.sendMail(mailDetails);
  } catch (error) {
    console.error(" Error sending email:", error.message);
    
  }
};

const sendResetPasswordMail = async (email, resetUrl) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="padding:10px 20px; background:#007BFF; color:white; text-decoration:none;">Reset Password</a>
        <p>If the button doesn't work, copy and paste this link in your browser:</p>
        <p>${resetUrl}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending password reset email:", err.message);
  }
};

export { VerifyEmail, sendResetPasswordMail}
