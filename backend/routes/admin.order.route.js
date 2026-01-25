import express from "express"
import { adminGetOrdersContoller, adminUpdateStatusController } from "../controller/admin.order.controller.js";
import { adminProtectedRoute } from "../middleware/protectedRoute.js";
const adminOrderRouter = express.Router();

adminOrderRouter.put("/updateorder",adminProtectedRoute,adminUpdateStatusController);
adminOrderRouter.get("/getorders",adminProtectedRoute,adminGetOrdersContoller);

export default adminOrderRouter;