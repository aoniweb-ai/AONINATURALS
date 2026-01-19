import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Types.ObjectId ,
        ref:"Admin"
    },
    delivered_to:[{
        user:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        },
        total_ordered:Number
    }],
    name:{
        type:String,
        minLength:3,
        maxLength:100,
        required:true
    },
    quantity:{
        type:Number,
        min:0,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        min:0,
        max:100
    },
    extra_discount:{
        type:Number,
        min:0,
        max:100
    },
    cod_charges:{
        type:Number,
        min:0
    },
    payment_type:{
        type:String,
        enum:["cod","online"]
    },
    description:{
        type:String
    },
    sold:{
        type:Boolean,
        required:true
    },
},{timestamps:true})

export default mongoose.model("Product",productSchema);