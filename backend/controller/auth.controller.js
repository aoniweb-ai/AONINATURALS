import { createJSONToken } from "../libs/jwtoken.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const logoutController = async(req,res)=>{
    try {
        res.clearCookie('jwt');
        req.user = undefined;
        return res.status(200).json({success:true,message:"Logout successfully"})
    } catch (error) {
        console.log("error",error)
        return res.status(500).json({success:false,message:"Logout error"})
    }
}

export const loginController = async(req,res)=>{
    const {email, password} = req.body;
    try { 
        if(!email || !password) return res.status(400).json({message:"Bad Request"});
        
        const user = await User.findOne({email}).select("+password");
        if(!user) return res.status(401).json({message:"Invalid email or password"});

        const validdate = await bcrypt.compare(password,user.password);
        if(!validdate) return res.status(401).json({message:"Invalid email or password"});

        createJSONToken(res,email);
        req.user = user;
        user.password = undefined;
        
        return res.status(200).json({success:true,message:"Login successfully",user})

    } catch (error) {
        return res.status(500).json({success:false,message:"Login error"})
    }
}
export const signupController = async(req,res)=>{
    const {email, password, phone} = req.body
    try {
        if(!email || !password || String(phone).length!=10) return res.status(400).json({message:"Bad Request"});

        const preUser = await User.findOne({phone});
        if(preUser) return res.status(302).json({message:"User already exist"});
        

        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password,salt);

        const user = User({email,password:hashed_password,phone});
        await user.save(); 
        return res.status(201).json({success:true,message:"user created",user});


    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Signup error"})
    }
}
export const getUserController = async(req,res)=>{
    const user = req.user;
    try {
        const popUser = await User.findById(user._id).populate({
            path: "cart.product",
            select: "product_name price final_price stock sold discount cod_charges extra_discount product_images",
        });
        res.status(200).json({success:true,message:"successfully getted user",user:popUser})
    } catch (error) {
        console.log("error while getting user ",error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}