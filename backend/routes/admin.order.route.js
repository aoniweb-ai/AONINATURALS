import express from "express"
import { adminGetAnOrderContoller, adminGetOrdersContoller, adminUpdateStatusController } from "../controller/admin.order.controller.js";
import { adminProtectedRoute } from "../middleware/protectedRoute.js";
const adminOrderRouter = express.Router();

adminOrderRouter.put("/updateorder",adminProtectedRoute,adminUpdateStatusController);
adminOrderRouter.get("/getorders/:status",adminProtectedRoute,adminGetOrdersContoller);
adminOrderRouter.get("/getan-order/:order_id",adminProtectedRoute,adminGetAnOrderContoller);

export default adminOrderRouter;