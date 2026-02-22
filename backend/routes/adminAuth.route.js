import express from "express"
import { adminGetController, adminLoginController, adminLogoutController, adminSignupController, adminUpdateCod_charges } from "../controller/admin.auth.controller.js";
import { adminProtectedRoute } from "../middleware/protectedRoute.js";

const adminAuthRouter = express.Router();

adminAuthRouter.post("/login",adminLoginController);
adminAuthRouter.post("/signup",adminSignupController);
adminAuthRouter.post("/logout",adminLogoutController);
adminAuthRouter.get('/getadmin',adminProtectedRoute,adminGetController);
adminAuthRouter.put('/update-cod-charges',adminProtectedRoute,adminUpdateCod_charges);

export default adminAuthRouter;