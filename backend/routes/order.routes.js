import express from "express"
import { createOrderController, getUserOrders, verifyPaymentController } from "../controller/order.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const orderRouter = express.Router();

orderRouter.post("/createorder",protectedRoute,createOrderController);
orderRouter.post("/verify-payment",protectedRoute,verifyPaymentController);
orderRouter.get("/getorders",protectedRoute,getUserOrders);

export default orderRouter;