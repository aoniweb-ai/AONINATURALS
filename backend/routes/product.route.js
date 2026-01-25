import express from "express"
import { aProductController, productController, updateCartController, removeCartItemController } from "../controller/product.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const productRouter = express.Router();

productRouter.get("/product",protectedRoute,productController);
productRouter.get("/product/:id",protectedRoute,aProductController);
productRouter.put("/updatecart/:product_id/:quantity",protectedRoute,updateCartController);
productRouter.put("/remove-product/:id",protectedRoute,removeCartItemController);


export default productRouter;