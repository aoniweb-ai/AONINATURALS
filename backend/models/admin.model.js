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
    }
})

export default mongoose.model("Admin",adminSchema);