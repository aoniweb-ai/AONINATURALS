import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from"cors"
import cookieParser from "cookie-parser"
import authRouter from "../routes/auth.route.js";
import productRouter from "../routes/product.route.js";
import adminAuthRouter from "../routes/adminAuth.route.js";
import adminProductRouter from "../routes/admin.product.route.js";

dotenv.config();

const app = express();
app.use(cors({
    origin:"http://localhost:5173", // will use in .env
    credentials:true,
    methods:["post","delete","get","put"],
    // allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(cookieParser());
app.use(express.json({
    limit:"20mb"
}));


app.use("/api/auth",authRouter);
app.use("/api/product",productRouter);

app.use("/api/admin/auth",adminAuthRouter);
app.use("/api/admin/product",adminProductRouter);


const PORT = process.env.PORT;

mongoose.connect(process.env.DB_URI)
.then(()=>
app.listen(PORT,()=>{
    console.log(`running on port ${PORT}`);
}))