import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

export const sendVerificationEmail = async (to: string, code: string) => {
  const mailOptions = {
    from: `"Sigap.ai Support" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email address - Sigap.ai",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
        <h2 style="color: #1A2E26; text-align: center;">Welcome to Sigap.ai!</h2>
        <p style="color: #4a5568; font-size: 16px;">
          Thank you for signing up. Please use the verification code below to confirm your email address. This code is valid for 10 minutes.
        </p>
        <div style="background-color: #E8FFF4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #00B074;">${code}</span>
        </div>
        <p style="color: #a0aec0; font-size: 14px; text-align: center;">
          If you didn't request this email, please safely ignore it.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};
