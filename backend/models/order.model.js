import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    order_id:{
        type:String,
        unique:true,
        required:true
    },
    delivery_date:Date,
    address:{
        address:{
            type:String,
            required:true
        },
        pincode:Number,
        landmark:String,
        state:String
    },
    phone_no:{
        type:Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    product:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        quantity:{  
            type:Number,
            required:true
        }, 
        price:{
            type:Number,
            required:true
        },
        cod_charges:Number
    }],
    total_price:{
        type:Number,
        required:true,
    },
    cod_charges:Number,
    status:{
        type:String,
        enum:["pending","delivered","shipped","cancelled"],
        required:true,
        default:"pending"
    },
    payment_status:{
        type:String,
        enum:["pending","paid","cancelled"],
        required:true,
        default:"cancelled"
    },
    payment_method:{
        type:String,
        enum:["cod","online"],
        required:true,
        default:"online"
    },
    receipt:String

},{timestamps:true})


export default mongoose.model("Order",orderSchema);