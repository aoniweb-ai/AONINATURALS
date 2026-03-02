import express from "express";
import { adminGetUsersController, adminGetUserDetailsController } from "../controller/admin.user.controller.js";
import { adminProtectedRoute } from "../middleware/protectedRoute.js";

const adminUserRouter = express.Router();

adminUserRouter.get("/getusers", adminProtectedRoute, adminGetUsersController);
adminUserRouter.get("/getuser/:id", adminProtectedRoute, adminGetUserDetailsController);

export default adminUserRouter;
