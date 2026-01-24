import mongoose, { mongo } from "mongoose";

const orderSchema = mongoose.Schema({
    order_id:{
        type:String,
        unique:true
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    product:[{
        product:{
        type:mongoose.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        required:true
    }   
    }],
    total_price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","delivered","shipped","cancelled"],
        required:true,
        default:"pending"
    },
    payment_status:{
        type:String,
        enum:["not","done"],
        required:true,
        default:"not"
    },
    payment_method:{
        type:String,
        enum:["cod","online"],
        default:"online"
    },
    receipt:String

},{Timestamps:true})


export default mongoose.model("Order",orderSchema);