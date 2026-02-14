import mongoose from "mongoose"
import Product from "./product.model.js";
const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        select:false
    },
    phone:{
        type:Number,
        required:true,
        minLength:10,
        maxLength:12

    },
    address:{
        address:String,
        pincode:Number,
        landmark:String,
        state:String
    },
    cart:[{
        product:{
            type:mongoose.Types.ObjectId,
            ref:Product
        },
        value:Number
    }],
    avatar:String,
    otp:String,
    otpExpiry:String,
    otp_limit:{
        type:Number,
        default:1
    },
    verified:{
        type:Boolean,
        required:true,
        default:false
    }
},{timestamps:true})

export default mongoose.model("User",userSchema);