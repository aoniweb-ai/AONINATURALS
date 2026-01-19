import { createJSONToken } from "../libs/jwtoken.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const logoutController = async(req,res)=>{
    try {
        console.log("logut ")
        res.clearCookie('jwt');
        req.user = undefined;
        return res.status(200).json({message:"Logout successfully"})
    } catch (error) {
        console.log("error",error)
    }
}

export const loginController = async(req,res)=>{
    const {email, password} = req.body;
    try {
        if(!email || !password) return res.status(400).json({message:"Bad Request"});

        const user = await User.findOne({email});
        if(!user) return res.status(401).json({message:"Invalid email or password"});

        const validdate = await bcrypt.compare(password,user.password);
        if(!validdate) return res.status(401).json({message:"Invalid email or password"});

        createJSONToken(res,email);
        req.user = user;
        return res.status(200).json({message:"Login successfully"})

    } catch (error) {
        console.log("error ",error)
    }
}
export const signupController = async(req,res)=>{
    const {email, password, phone} = req.body
    try {
        if(!email || !password || String(phone).length!=10) return res.status(400).json({message:"Bad Request"});

        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password,salt);

        const user = User({email,password:hashed_password,phone});
        await user.save(); 
        return res.status(201).json({message:"user created",user});


    } catch (error) {
        console.log(error)
    }
}