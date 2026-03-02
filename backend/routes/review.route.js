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

reviewRouter.get("/top", getTopReviewsController);

reviewRouter.post("/add", protectedRoute, addOrUpdateReviewController);
reviewRouter.put("/like/:review_id", protectedRoute, toggleLikeReviewController);
reviewRouter.put("/dislike/:review_id", protectedRoute, toggleDislikeReviewController);
reviewRouter.get("/my/:product_id", protectedRoute, getMyReviewController);
reviewRouter.delete("/delete/:review_id", protectedRoute, deleteReviewController);

reviewRouter.get("/:product_id", getProductReviewsController);

export default reviewRouter;
