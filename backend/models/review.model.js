import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review_text: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    edit_count: {
      type: Number,
      default: 0,
    },
    first_reviewed_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
