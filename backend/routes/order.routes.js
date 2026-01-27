import express from "express"
import { createOrderController, getAnOrderContoller, getUserOrders, verifyPaymentController } from "../controller/order.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const orderRouter = express.Router();

orderRouter.post("/createorder",protectedRoute,createOrderController);
orderRouter.post("/verify-payment",protectedRoute,verifyPaymentController);
orderRouter.get("/getorders",protectedRoute,getUserOrders);
orderRouter.get("/getan-order/:order_id",protectedRoute,getAnOrderContoller);

export default orderRouter;