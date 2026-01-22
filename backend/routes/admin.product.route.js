import express from "express"
import { adminAddProductController, adminGetAllProductsController } from "../controller/admin.product.controller.js";
import { adminProtectedRoute } from "../middleware/protectedRoute.js";
import upload from "../libs/multer.js"

const adminProductRouter = express.Router();

adminProductRouter.post("/addupdateproduct",adminProtectedRoute,upload.array("product_images", 4),adminAddProductController);
adminProductRouter.get("/getproducts",adminProtectedRoute,adminGetAllProductsController);

export default adminProductRouter;