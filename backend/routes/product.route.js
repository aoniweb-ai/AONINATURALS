import express from "express"
import { productController, updateCartController } from "../controller/product.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const productRouter = express.Router();

productRouter.get("/product",protectedRoute,productController);
productRouter.get("/updatecart/:product_id",updateCartController);

export default productRouter;