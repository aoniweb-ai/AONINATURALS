import { createJSONToken } from "../libs/jwtoken.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs"

export const adminLoginController = async(req,res)=>{
    const {username,unique_id, password} = req.body;
    try {
        if(unique_id != process.env.ADMIN_SECRET || !password) return res.status(401).json({message:"Invalid credentials"});
        const admin = await Admin.findOne({username});
        if(!admin) return res.status(401).json({message:"Invalid credentials"}); 

        console.log("gya");
        const validdate = await bcrypt.compare(password,admin.password);
        console.log("again gya");
        if(!validdate) return res.status(401).json({message:"Invalid credentials"});

        createJSONToken(res,username,"admin");
        req.admin = admin;
        return res.status(200).json({message:"Login successfully",admin}) 

    } catch (error) {
        console.log("error while admin login",error);
        return res.status(500).json({success:false,message:"Login error"})
    }
}
export const adminSignupController = async(req,res)=>{
    const {username, password} = req.body;
    try {
        if(!username || !password) return res.status(401).json({message:"Unauthorized"});
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password,salt);
        if(!hashed_password) return res.status(500).json({message:"Internal server error"});

        const admin = new Admin({username,password:hashed_password});
        await admin.save();

        return res.status(200).json({message:"Signup successfully",admin}) 

    } catch (error) {
        console.log("error while admin signup",error);
        return res.status(500).json({success:false,message:"Signup error"})
    }
}

export const adminLogoutController = async(req,res)=>{
    try {
        res.clearCookie('jwtAdmin');
        req.admin = undefined;
        return res.status(200).json({message:"Logout successfully"})
    } catch (error) {
        console.log("error while admin logout",error);
        return res.status(500).json({success:false,message:"Logout error"})
    }
}
export const adminGetController = async(req,res)=>{
    try {
        return res.status(200).json({message:"admin successfully getted",admin:req.admin});
    } catch (error) {
        console.log("error while getting admin",error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}