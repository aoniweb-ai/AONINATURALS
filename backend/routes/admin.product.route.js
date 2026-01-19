import express from "express"
import { adminAddProductController } from "../controller/admin.product.controller.js";
import { adminProtectedRoute } from "../middleware/protectedRoute.js";

const adminProductRouter = express.Router();

adminProductRouter.post("/addproduct",adminProtectedRoute,adminAddProductController);

export default adminProductRouter;