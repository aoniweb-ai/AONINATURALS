import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
export const protectedRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const {value} = jwt.verify(token,process.env.SECRET_KEY);
        if(!value) return res.status(500).json({message:"Internal error"});

        const user = await User.findOne({email:value});
        if(!user) return res.status(401).json({message:"Unauthorized"});
        req.user = user;
        next();

    } catch (error) {
        
    }
}
export const adminProtectedRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwtAdmin;
        if(!token) return res.status(401).json({message:"Unauthorized"});
        const {value} = jwt.verify(token,process.env.ADMIN_SECRET_KEY);
        
        if(!value) return res.status(500).json({message:"Internal error"});

        const admin = await Admin.findOne({username:value});
        if(!admin) return res.status(401).json({message:"Unauthorized"});
        req.admin = admin;
        next();

    } catch (error) {
        console.log("error ",error);
    }
}