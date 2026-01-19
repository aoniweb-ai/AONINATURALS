import express from "express"
import { adminLoginController, adminLogoutController, adminSignupController } from "../controller/admin.auth.controller.js";

const adminAuthRouter = express.Router();

adminAuthRouter.post("/login",adminLoginController);
adminAuthRouter.post("/signup",adminSignupController);
adminAuthRouter.post("/logout",adminLogoutController);

export default adminAuthRouter;