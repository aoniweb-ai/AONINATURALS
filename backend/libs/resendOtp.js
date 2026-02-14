import User from "../models/user.model.js";
import { generateOTP } from "./OTP.js";
import { sendOtpEmail } from "./resend.js";

export const resendOtp = async (email,topic) => {
    try {
        const now = Date.now()
        const user = await User.findOne({ email });
        if (!user) return { success: false, message: "Invalid email" }

        if (user.otp_limit >= 3) {
            if (user.otpExpiry + 24 * 60 * 60 * 1000 < now) {
                const otp = generateOTP();
                user.otp_limit = 1;
                user.otp = otp;
                user.otpExpiry = Date.now() + 10 * 60 * 1000;
                await user.save()
                await sendOtpEmail(email, otp,topic || "Account verification")
                return { success: true, message: "Otp sent successfully", otpSent: true };
            } else {
                return { success: false, message: "Limit reached - Try again tommorrow" }
            }
        } else {
            const otp = generateOTP();
            user.otp_limit += 1;
            user.otp = otp;
            user.otpExpiry = Date.now() + 10 * 60 * 1000;
            await user.save()
            await sendOtpEmail(email, otp,"Account verification")
            return { success: true, message: "Otp sent successfully", otpSent: true };
        }
    } catch (error) {
        console.log('Error while resending otp ');
        return { success: false, message: "Otp resend error" }
    }
}