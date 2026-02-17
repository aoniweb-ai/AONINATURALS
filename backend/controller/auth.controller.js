import { generateOrderId } from "../libs/generateId.js";
import { createJSONToken } from "../libs/jwtoken.js";
import { generateOTP } from "../libs/OTP.js";
import { sendOtpEmail } from "../libs/resend.js";
import { resendOtp } from "../libs/resendOtp.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt', { httpOnly: true, path: '/', sameSite: 'none', secure: process.env.PRODUCTION != 'DEVELOPMENT' });
        req.user = undefined;
        return res.status(200).json({ success: true, message: "Logout successfully" })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ success: false, message: "Logout error" })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Bad Request" });


        const user = await User.findOne({ email }).select("+password")
        .populate({
            path: "cart.product",
            select: "product_name price final_price stock sold discount cod_charges extra_discount product_images",
        });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        if (!user.verified) {
            const data = await resendOtp(email,'Account Verification');
            if(data.success) return res.status(200).json(data);
            return res.status(400).json(data);
        }

        const validdate = await bcrypt.compare(password, user.password);
        if (!validdate) return res.status(401).json({ message: "Invalid email or password" });

        createJSONToken(res, email);
        req.user = user;
        user.password = undefined;

        return res.status(200).json({ success: true, message: "Login successfully", user })

    } catch (error) {
        console.log("Error while logging user ",error)
        return res.status(500).json({ success: false, message: "Login error" })
    }
}
export const signupController = async (req, res) => {
    try {
        const { email, password, phone } = req.body;
        const fullname = req.body?.fullname;
        if (!email || !password || String(phone).length < 10 || String(phone).length > 12) return res.status(400).json({ message: "Bad Request" });

        const preUser = await User.findOne({ phone });
        if (preUser) return res.status(302).json({ message: "This number is already registered" });
        const preEmailUser = await User.findOne({ email });
        if (preEmailUser) return res.status(302).json({ message: "This email is already registered" });


        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);
        const username = generateOrderId()

        const otp = generateOTP();

        const user = User({ fullname: fullname || `user_${username}`, otp: otp.trim(), otpExpiry: Date.now() + 10 * 60 * 1000, email, password: hashed_password, phone, avatar: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${fullname || 'user_' + username}` });
        await user.save();

        await sendOtpEmail(email, otp,"Account verification")

        return res.status(201).json({ success: true, message: "User created" });


    } catch (error) {
        console.log('Error while signup user ', error);
        return res.status(500).json({ success: false, message: "Signup error" })
    }
}

export const resendOtpController = async(req,res)=>{
    try {
        const {email,topic} = req.body;
        const data = await resendOtp(email,topic);
        if(data.success) return res.status(200).json(data);
        return res.status(400).json(data);
    } catch (error) {
        console.log("Error while sending otp to user ",error)
        return res.status(500).json({ success: false, message: "Error sending otp" })
    }
}

export const verifyOtpController = async (req, res) => {
    try {
        const { otp, email } = req.body;
        const now = Date.now()
        if (!otp.trim()) return res.status(400).json({ success: false, message: "Invalid otp" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid email" });

        if (user.otpExpiry < now) return res.status(400).json({ success: false, message: "Invalid otp - Timeout" }) // otp exceed 10 minutes

        if (otp !== user.otp.trim()) return res.status(400).json({ success: false, message: "Invalid otp provided" });

        user.verified = true;
        user.otp = null;
        user.otpExpiry = Date.now();

        await user.save();
        return res.status(201).json({ success: true, message: "OTP verified",user });

    } catch (error) {
        console.log('Error while validating otp ', error);
        return res.status(500).json({ success: false, message: "Otp validatation error" })
    }
}

export const getUserController = async (req, res) => {
    try {
        const user = req.user;
        const popUser = await User.findById(user._id).populate({
            path: "cart.product",
            select: "product_name price final_price stock sold discount cod_charges extra_discount product_images",
        });
        res.status(200).json({ success: true, message: "successfully getted user", user: popUser })
    } catch (error) {
        console.log("error while getting user ", error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const editProfileController = async (req, res) => {
    try {
        const user = req.user;
        const { fullname, phone } = req.body;
        if (!fullname || !phone || String(phone).length < 10 || String(phone).length > 12) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { fullname, phone, avatar: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${fullname}` }, { new: true }).populate({
            path: "cart.product",
            select: "product_name price final_price stock sold discount cod_charges extra_discount product_images",
        });

        if (!updatedUser) return res.status(401).json({ success: false, message: "Unauthorized" });

        return res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });

    } catch (error) {
        console.log("error while getting user ", error);
        return res.status(500).json({ success: false, message: "Profile updation error" })
    }
}
export const editAddressController = async (req, res) => {
    try {
        const user = req.user;
        const { address } = req.body;
        if (!address) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const updatedUser = await User.findOneAndUpdate({ _id: user._id }, {
            address: {
                address: address.address.trim(),
                pincode: address.pincode,
                state: address.state.trim(),
                landmark: address.landmark.trim()
            }
        }, { new: true }).populate({
            path: "cart.product",
            select: "product_name price final_price stock sold discount cod_charges extra_discount product_images",
        });

        if (!updatedUser) return res.status(401).json({ success: false, message: "Unauthorized" });

        return res.status(200).json({ success: true, message: "Address updated successfully", user: updatedUser });

    } catch (error) {
        console.log("error while getting user ", error);
        return res.status(500).json({ success: false, message: "Address updation error" })
    }
}

export const changePasswordController = async(req,res)=>{
    try {
        const {otp, email, password} = req.body;

        if(!otp.trim() || !email.trim() || !password.trim()) return res.status(400).json({success:"Invalid credentials"});

        const user = await User.findOne({email})
        const now = Date.now();
        if(!user) return res.status(400).json({success:false,message:"Bad request"});

        if(user.otpExpiry<now) return res.status(400).json({message:"Otp expired - Try again"});

        if(user.otp !== otp.trim()) return res.status(400).json({message:"Invalid Otp provided"});

        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password.trim(),salt);

        if(!hashed_password) return res.status(500).json({success:false,message:"Internal server error"});
        user.password = hashed_password;
        user.otp = null;
        user.otpExpiry = Date.now();

        await user.save();
        return res.status(200).json({success:true,message:"Password changed"});
    } catch (error) {
        console.log("Error while changing user password ",error);
        return res.status(500).json({success:false,message:"Error - changing password"})
    }
}