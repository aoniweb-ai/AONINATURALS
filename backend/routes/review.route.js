import express from "express";
import {
  addOrUpdateReviewController,
  getProductReviewsController,
  toggleLikeReviewController,
  toggleDislikeReviewController,
  getTopReviewsController,
  getMyReviewController,
  deleteReviewController,
} from "../controller/review.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const reviewRouter = express.Router();

// Public
reviewRouter.get("/top", getTopReviewsController);

// Protected (logged-in users)
reviewRouter.post("/add", protectedRoute, addOrUpdateReviewController);
reviewRouter.put("/like/:review_id", protectedRoute, toggleLikeReviewController);
reviewRouter.put("/dislike/:review_id", protectedRoute, toggleDislikeReviewController);
reviewRouter.get("/my/:product_id", protectedRoute, getMyReviewController);
reviewRouter.delete("/delete/:review_id", protectedRoute, deleteReviewController);

// Public (must be after /top, /my to avoid catching them as :product_id)
reviewRouter.get("/:product_id", getProductReviewsController);

export default reviewRouter;
