import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true]
    },
    password:{
        type:String,
        required:[true,"password is required"],
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
    orders:{
        in_progress:[{
            _uid: mongoose.Types.UUID, // unique id
            order_name:{
                type:mongoose.Types.ObjectId,
                ref:"Product"
            },
            order_quantity:Number
        },{timestamps:true}],
        delivered:[{
            _uid: mongoose.Types.UUID,
            order_name:{
                type:mongoose.Types.ObjectId,
                ref:"Product"
            },
            order_quantity:Number
        },{timestamps:true}]
    },
    cart:[{
        product:{
            type:mongoose.Types.ObjectId,
            ref:"Product"
        },
        value:Number
    }]
},{timestamps:true})

export default mongoose.model("User",userSchema);