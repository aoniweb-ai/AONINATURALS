import express from "express"
import { aProductController, productController, updateCartController } from "../controller/product.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const productRouter = express.Router();

productRouter.get("/product",protectedRoute,productController);
productRouter.get("/product/:id",protectedRoute,aProductController);
productRouter.put("/updatecart/:product_id/:quantity",protectedRoute,updateCartController);

export default productRouter;