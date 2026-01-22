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
    product:{
        type:mongoose.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        required:true
    },
    total_price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["inprogress","delivered"],
        required:true
    },
    payment_method:{
        type:String,
        enum:["cod","online"]
    }

},{Timestamps:true})


export default mongoose.model("Order",orderSchema);