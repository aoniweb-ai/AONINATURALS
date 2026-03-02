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
import adminBlogRouter from "../routes/admin.blog.route.js";
import blogRouter from "../routes/blog.route.js";
import adminCouponRouter from "../routes/admin.coupon.route.js";
import couponRouter from "../routes/coupon.route.js";
import adminUserRouter from "../routes/admin.user.route.js";
import adminReviewRouter from "../routes/admin.review.route.js";
import reviewRouter from "../routes/review.route.js";
import { initSocket } from "../libs/socket.js";

dotenv.config();

const app = express();
const server = initSocket(app);


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

app.use(`/api/${process.env.ADMIN_POST_URI}/auth`, adminAuthRouter);
app.use(`/api/${process.env.ADMIN_POST_URI}/product`, adminProductRouter);
app.use(`/api/${process.env.ADMIN_POST_URI}/orders`, adminOrderRouter);
app.use(`/api/${process.env.ADMIN_POST_URI}/blog`, adminBlogRouter);
app.use(`/api/${process.env.ADMIN_POST_URI}/coupon`, adminCouponRouter);
app.use(`/api/${process.env.ADMIN_POST_URI}/user`, adminUserRouter);
app.use(`/api/${process.env.ADMIN_POST_URI}/review`, adminReviewRouter);

app.use('/api', limiter);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/blog", blogRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/review", reviewRouter);



const PORT = process.env.PORT;

mongoose.connect(process.env.DB_URI)
    .then(() =>
        server.listen(PORT, "0.0.0.0", () => {
            console.log(`running on port ${PORT}`);
        }))