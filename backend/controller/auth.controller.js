import { generateOrderId } from "../libs/generateId.js";
import { createJSONToken } from "../libs/jwtoken.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt');
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

        const validdate = await bcrypt.compare(password, user.password);
        if (!validdate) return res.status(401).json({ message: "Invalid email or password" });

        createJSONToken(res, email);
        req.user = user;
        user.password = undefined;

        return res.status(200).json({ success: true, message: "Login successfully", user })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Login error" })
    }
}
export const signupController = async (req, res) => {
    try {
        const { email, password, phone } = req.body;
        const fullname = req.body?.fullname;
        if (!email || !password || String(phone).length < 10 || String(phone).length > 12) return res.status(400).json({ message: "Bad Request" });

        const preUser = await User.findOne({ phone });
        if (preUser) return res.status(302).json({ message: "The number is already registered" });


        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);

        const user = User({ fullname: fullname || `user_${generateOrderId()}`, email, password: hashed_password, phone });
        await user.save();
        return res.status(201).json({ success: true, message: "user created", user });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Signup error" })
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

        const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { fullname, phone }, { new: true }).populate({
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
                pincode: address.pincode.trim(),
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