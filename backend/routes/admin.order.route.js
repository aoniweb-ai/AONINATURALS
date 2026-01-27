import express from "express"
import { adminGetAnOrderContoller, adminGetOrdersContoller, adminGetTotalRevenueController, adminSearchOrdersController, adminUpdateStatusController } from "../controller/admin.order.controller.js";
import { adminProtectedRoute } from "../middleware/protectedRoute.js";
const adminOrderRouter = express.Router();

adminOrderRouter.put("/updateorder",adminProtectedRoute,adminUpdateStatusController);
adminOrderRouter.get("/total-revenue",adminProtectedRoute,adminGetTotalRevenueController);
adminOrderRouter.get("/getorders/:status",adminProtectedRoute,adminGetOrdersContoller);
adminOrderRouter.get("/getan-order/:order_id",adminProtectedRoute,adminGetAnOrderContoller);
adminOrderRouter.get("/search-order/:search",adminProtectedRoute,adminSearchOrdersController);

export default adminOrderRouter;