import express from "express"
import { adminGetController, adminLoginController, adminLogoutController, adminSignupController } from "../controller/admin.auth.controller.js";
import { adminProtectedRoute } from "../middleware/protectedRoute.js";

const adminAuthRouter = express.Router();

adminAuthRouter.post("/login",adminLoginController);
adminAuthRouter.post("/signup",adminSignupController);
adminAuthRouter.post("/logout",adminLogoutController);
adminAuthRouter.get('/getadmin',adminProtectedRoute,adminGetController);

export default adminAuthRouter;