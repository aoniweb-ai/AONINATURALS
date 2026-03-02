import express from "express";
import { applyCouponController } from "../controller/coupon.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const couponRouter = express.Router();

couponRouter.post("/apply", protectedRoute, applyCouponController);

export default couponRouter;
