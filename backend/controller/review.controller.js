import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { getIO } from "../libs/socket.js";

export const addOrUpdateReviewController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id, rating, review_text } = req.body;

    if (!product_id || !rating || !review_text?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const hasBought = product.buyers?.some(
      (buyerId) => buyerId.toString() === userId.toString()
    );
    if (!hasBought) {
      return res
        .status(403)
        .json({ message: "You can only review products you have purchased" });
    }

    const deliveredOrder = await Order.findOne({
      user: userId,
      status: "delivered",
      "product.product": product_id,
    });
    if (!deliveredOrder) {
      return res
        .status(403)
        .json({ message: "You can review only after the product is delivered" });
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: product_id,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.review_text = review_text.trim();
      existingReview.edit_count += 1;
      await existingReview.save();

      const populated = await existingReview.populate({
        path: "user",
        select: "fullname email",
      });

      getIO().emit("review:updated", { review: populated, product_id });

      return res.status(200).json({
        message: "Review updated",
        review: populated,
        edit: true,
      });
    }

    const review = new Review({
      user: userId,
      product: product_id,
      rating,
      review_text: review_text.trim(),
      first_reviewed_at: new Date(),
    });
    await review.save();

    // Remove this product from review_pending in all user's delivered orders
    const updateResult = await Order.updateMany(
      { user: userId, status: "delivered", review_pending: product_id },
      { $pull: { review_pending: product_id } }
    );

    // Emit updated review pending count to user via socket
    if (updateResult.modifiedCount > 0) {
      const countResult = await Order.aggregate([
        { $match: { user: userId, status: "delivered", "review_pending.0": { $exists: true } } },
        { $project: { count: { $size: "$review_pending" } } },
        { $group: { _id: null, total: { $sum: "$count" } } }
      ]);
      const total = countResult.length > 0 ? countResult[0].total : 0;
      getIO().emit("review:pendingCountUpdated", { userId: userId.toString(), count: total, reviewedProductId: product_id });
    }

    const populated = await review.populate({
      path: "user",
      select: "fullname email",
    });

    getIO().emit("review:created", { review: populated, product_id });

    return res.status(201).json({
      message: "Review submitted",
      review: populated,
      edit: false,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }
    console.log("error while adding review ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getProductReviewsController = async (req, res) => {
  try {
    const { product_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const total = await Review.countDocuments({ product: product_id });

    const reviews = await Review.find({ product: product_id })
      .populate({ path: "user", select: "fullname email" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const avgResult = await Review.aggregate([
      { $match: { product: await import("mongoose").then((m) => new m.default.Types.ObjectId(product_id)) } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    const avgRating = avgResult[0]?.avg || 0;
    const totalReviews = avgResult[0]?.count || 0;

    return res.status(200).json({
      reviews,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.log("error while getting reviews ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const toggleLikeReviewController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { review_id } = req.params;

    const review = await Review.findById(review_id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const alreadyLiked = review.likes.includes(userId);
    const alreadyDisliked = review.dislikes.includes(userId);

    if (alreadyLiked) {
      review.likes.pull(userId);
    } else {
      review.likes.push(userId);
      if (alreadyDisliked) review.dislikes.pull(userId);
    }

    await review.save();

    getIO().emit("review:reacted", {
      review_id,
      product_id: review.product.toString(),
      likes: review.likes.length,
      dislikes: review.dislikes.length,
    });

    return res.status(200).json({
      likes: review.likes.length,
      dislikes: review.dislikes.length,
      userLiked: !alreadyLiked,
      userDisliked: false,
    });
  } catch (error) {
    console.log("error while liking review ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const toggleDislikeReviewController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { review_id } = req.params;

    const review = await Review.findById(review_id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const alreadyDisliked = review.dislikes.includes(userId);
    const alreadyLiked = review.likes.includes(userId);

    if (alreadyDisliked) {
      review.dislikes.pull(userId);
    } else {
      review.dislikes.push(userId);
      if (alreadyLiked) review.likes.pull(userId);
    }

    await review.save();

    getIO().emit("review:reacted", {
      review_id,
      product_id: review.product.toString(),
      likes: review.likes.length,
      dislikes: review.dislikes.length,
    });

    return res.status(200).json({
      likes: review.likes.length,
      dislikes: review.dislikes.length,
      userLiked: false,
      userDisliked: !alreadyDisliked,
    });
  } catch (error) {
    console.log("error while disliking review ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getTopReviewsController = async (req, res) => {
  try {
    const reviews = await Review.aggregate([
      { $addFields: { likeCount: { $size: "$likes" } } },
      { $sort: { likeCount: -1, createdAt: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [{ $project: { fullname: 1, email: 1 } }],
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
          pipeline: [{ $project: { product_name: 1 } }],
        },
      },
      { $unwind: "$product" },
    ]);

    return res.status(200).json({ reviews });
  } catch (error) {
    console.log("error while getting top reviews ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getMyReviewController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id } = req.params;

    const review = await Review.findOne({
      user: userId,
      product: product_id,
    })
      .populate({ path: "user", select: "fullname email" })
      .lean();

    const deliveredOrder = await Order.findOne({
      user: userId,
      status: "delivered",
      "product.product": product_id,
    });

    return res.status(200).json({ review, canReview: !!deliveredOrder });
  } catch (error) {
    console.log("error while getting my review ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteReviewController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { review_id } = req.params;

    const review = await Review.findById(review_id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own review" });
    }

    const product_id = review.product.toString();
    await Review.findByIdAndDelete(review_id);

    getIO().emit("review:deleted", { review_id, product_id });

    return res.status(200).json({ message: "Review deleted", review_id, product_id });
  } catch (error) {
    console.log("error while deleting review ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const adminDeleteReviewController = async (req, res) => {
  try {
    const { review_id } = req.params;

    const review = await Review.findById(review_id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const product_id = review.product.toString();
    await Review.findByIdAndDelete(review_id);

    getIO().emit("review:deleted", { review_id, product_id });

    return res.status(200).json({ message: "Review deleted", review_id, product_id });
  } catch (error) {
    console.log("error while admin deleting review ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const adminGetAllReviewsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const total = await Review.countDocuments();

    const reviews = await Review.find()
      .populate({ path: "user", select: "fullname email" })
      .populate({ path: "product", select: "product_name product_images" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const statsResult = await Review.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      reviews,
      avgRating: Math.round((statsResult[0]?.avgRating || 0) * 10) / 10,
      totalReviews: statsResult[0]?.totalReviews || 0,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.log("error while admin getting all reviews ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
