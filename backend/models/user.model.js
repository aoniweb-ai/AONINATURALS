import mongoose from "mongoose"
import Product from "./product.model.js";
const userSchema = new mongoose.Schema({
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
        maxLength:10

    },
    address:{
        type:String,
    },
    cart:[{
        product:{
            type:mongoose.Types.ObjectId,
            ref:Product
        },
        value:Number
    }],
    click_order_buy:{
        type:mongoose.Types.ObjectId,
        ref:"Product"
    }
},{timestamps:true})

export default mongoose.model("User",userSchema);