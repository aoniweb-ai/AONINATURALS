import User from "../models/user.model.js";
import { generateOTP } from "./OTP.js";
import { sendOtpEmail } from "./resend.js";

function formatTime(msStr) {
  const ms = Number(msStr);

  if (ms >= 3600000) {
    const hours = Math.floor(ms / 3600000);
    return `${hours} hrs`;
  } else {
    const minutes = Math.floor(ms / 60000);
    return `${minutes} min`;
  }
}

export const resendOtp = async (email,topic) => {
    try {
        const now = Date.now()
        const user = await User.findOne({ email });
        if (!user) return { success: false, message: "Invalid email" }

        if (user.otp_limit >= 3) {
            if (parseInt(user.otpExpiry) + 24 * 60 * 60 * 1000 < now) {
                const otp = generateOTP();
                user.otp_limit = 1;
                user.otp = otp;
                user.otpExpiry = Date.now() + 10 * 60 * 1000;
                await user.save()
                await sendOtpEmail(email, otp,topic || "Account verification")
                return { success: true, message: "Otp sent successfully", otpSent: true };
            } else {
                const time = formatTime(24 * 60 * 60 * 1000-(Date.now()-user.otpExpiry))
                return { success: false, message: `Limit reached - Try again after ${time}`}
            }
        } else {
            const otp = generateOTP();
            user.otp_limit += 1;
            user.otp = otp;
            user.otpExpiry = Date.now() + 10 * 60 * 1000;
            await user.save()
            await sendOtpEmail(email, otp,topic || "Account verification")
            return { success: true, message: "Otp sent successfully", otpSent: true };
        }
    } catch (error) {
        console.log('Error while resending otp ');
        return { success: false, message: "Otp resend error" }
    }
}