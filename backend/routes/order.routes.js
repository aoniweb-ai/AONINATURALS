import express from "express"
import { createOrderController, verifyPaymentController } from "../controller/order.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const orderRouter = express.Router();

orderRouter.post("/createorder",protectedRoute,createOrderController)
orderRouter.post("/verify-payment",protectedRoute,verifyPaymentController)

export default orderRouter;