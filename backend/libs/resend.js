import { Resend } from "resend";
import dotenv from "dotenv"

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email, otp,topic) => {
    console.log("in otp")
  return await resend.emails.send({
    from: "AONINATURALS <no-reply@aoninaturals.com>",
    to: email,
    subject: "Your OTP Code",
    html: `
      <h2>${topic}</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });
};
