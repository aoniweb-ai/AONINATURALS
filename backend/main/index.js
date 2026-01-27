import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from"cors"
import cookieParser from "cookie-parser"
import authRouter from "../routes/auth.route.js";
import productRouter from "../routes/product.route.js";
import adminAuthRouter from "../routes/adminAuth.route.js";
import adminProductRouter from "../routes/admin.product.route.js";
import rateLimit from "express-rate-limit"
import orderRouter from "../routes/order.routes.js";
import adminOrderRouter from "../routes/admin.order.route.js";

dotenv.config();

const app = express();
app.use(cors({
    origin:'http://localhost:5173', // will use in .env -->process.env.FRONTEND_URI
    credentials:true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(cookieParser());
app.use(express.json({
    limit:"20mb"
}));
app.use(express.urlencoded({limit:"10kb"}));
const limiter = rateLimit({
    windowMs:15 * 60 * 1000,
    limit:200,
    message: {
        success: false,
        message: "Too many requests, try again later"
    }
})

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use('/api',limiter);


app.use("/api/auth",authRouter);
app.use("/api/product",productRouter);
app.use("/api/orders",orderRouter);

app.use("/api/admin/auth",adminAuthRouter);
app.use("/api/admin/product",adminProductRouter);
app.use("/api/admin/orders",adminOrderRouter);


const PORT = process.env.PORT;

mongoose.connect(process.env.DB_URI)
.then(()=>
app.listen(PORT, "0.0.0.0",()=>{
    console.log(`running on port ${PORT}`);
}))