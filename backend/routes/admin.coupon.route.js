import express from "express";
import {
  adminAddUpdateCouponController,
  adminGetAllCouponsController,
  adminDeleteCouponController,
  adminToggleCouponController,
} from "../controller/admin.coupon.controller.js";
import { adminProtectedRoute } from "../middleware/protectedRoute.js";

const adminCouponRouter = express.Router();

adminCouponRouter.post("/addupdatecoupon", adminProtectedRoute, adminAddUpdateCouponController);
adminCouponRouter.get("/getcoupons", adminProtectedRoute, adminGetAllCouponsController);
adminCouponRouter.delete("/deletecoupon/:id", adminProtectedRoute, adminDeleteCouponController);
adminCouponRouter.put("/togglecoupon/:id", adminProtectedRoute, adminToggleCouponController);

export default adminCouponRouter;
