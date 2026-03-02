import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount_type: {
      type: String,
      enum: ["percent", "flat"],
      required: true,
      default: "percent",
    },
    discount_value: {
      type: Number,
      required: true,
      min: 1,
    },
    min_order_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    max_discount: {
      type: Number,
      default: null,
    },
    usage_limit: {
      type: Number,
      default: null,
    },
    used_count: {
      type: Number,
      default: 0,
    },
    used_by: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    expiry: {
      type: Date,
      default: null, 
    },
    active: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
