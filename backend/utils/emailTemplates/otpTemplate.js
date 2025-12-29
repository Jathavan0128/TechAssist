// utils/emailTemplates/otpTemplate.js

export const otpEmailTemplate = (otp) => {
  return {
    subject: "Your TechAssist Password Reset OTP",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Your one-time password (OTP) is:</p>

        <div style="
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 4px;
          padding: 10px 20px;
          background: #f3f4f6;
          display: inline-block;
          border-radius: 6px;
          margin: 12px 0;
        ">
          ${otp}
        </div>

        <p>This OTP is valid for <strong>10 minutes</strong>.</p>

        <p>If you didn’t request a password reset, you can safely ignore this email.</p>

        <br />
        <em>— TechAssist Support</em>
      </div>
    `,
  };
};
