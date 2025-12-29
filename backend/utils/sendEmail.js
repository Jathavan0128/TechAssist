// utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) return;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return { simulated: true, to, subject, text, html };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    const info = await transporter.sendMail({
      from: `"TechAssist" <${SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (err) {
    return { error: true, message: err.message };
  }
};

export default sendEmail;
