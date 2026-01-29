import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors"
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
    origin: process.env.FRONTEND_URI,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}))

app.use(cookieParser());
app.use(express.json({limit: "20mb"}));
app.use(express.urlencoded({ limit: "10kb" }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, try again later"
    }
})

app.set("trust proxy", 1);
app.use('/api', limiter);

app.use(`/api/${process.env.ADMIN_POST_URI}/auth`, adminAuthRouter);
app.use(`/api/${process.env.ADMIN_POST_URI}/product`, adminProductRouter);
app.use(`/api/${process.env.ADMIN_POST_URI}/orders`, adminOrderRouter);

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/orders", orderRouter);



const PORT = process.env.PORT;

mongoose.connect(process.env.DB_URI)
    .then(() =>
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`running on port ${PORT}`);
        }))