import mongoose from "mongoose"

const adminSchema = mongoose.Schema({
    username:{
        type:String,
        minLength:3,
        maxLength:50,
        required:true
    },
    password:{
        type:String,
        required:true
    }
    ,
    role:{
        type:String,
        default:"admin"
    },
    cod_charges:{
        type:Number,
        default:55
    }
},{timestamps:true})

export default mongoose.model("Admin",adminSchema);