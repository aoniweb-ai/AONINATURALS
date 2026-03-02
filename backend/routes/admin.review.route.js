import express from "express";
import {
  adminGetAllReviewsController,
  adminDeleteReviewController,
} from "../controller/review.controller.js";
import { adminProtectedRoute } from "../middleware/protectedRoute.js";

const adminReviewRouter = express.Router();

adminReviewRouter.get("/getreviews", adminProtectedRoute, adminGetAllReviewsController);
adminReviewRouter.delete("/deletereview/:review_id", adminProtectedRoute, adminDeleteReviewController);

export default adminReviewRouter;
