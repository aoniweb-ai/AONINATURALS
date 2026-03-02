import Coupon from "../models/coupon.model.js";
import { getIO } from "../libs/socket.js";

export const adminAddUpdateCouponController = async (req, res) => {
  const {
    coupon_id,
    code,
    discount_type,
    discount_value,
    min_order_amount,
    max_discount,
    usage_limit,
    expiry,
    active,
    description,
  } = req.body;

  try {
    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({ message: "Code, discount type & value are required" });
    }

    const duplicate = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      ...(coupon_id ? { _id: { $ne: coupon_id } } : {}),
    });
    if (duplicate) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    if (coupon_id) {
      const coupon = await Coupon.findById(coupon_id);
      if (!coupon) return res.status(404).json({ message: "Coupon not found" });

      coupon.code = code.toUpperCase().trim();
      coupon.discount_type = discount_type;
      coupon.discount_value = discount_value;
      coupon.min_order_amount = min_order_amount || 0;
      coupon.max_discount = max_discount || null;
      coupon.usage_limit = usage_limit || null;
      coupon.expiry = expiry || null;
      coupon.active = active === true || active === "true";
      coupon.description = description || "";

      const updated = await coupon.save();
      getIO().emit("coupon:updated", updated);
      return res.status(200).json({ message: "Coupon updated", edit: true, coupon: updated });
    }

    const coupon = new Coupon({
      code: code.toUpperCase().trim(),
      discount_type,
      discount_value,
      min_order_amount: min_order_amount || 0,
      max_discount: max_discount || null,
      usage_limit: usage_limit || null,
      expiry: expiry || null,
      active: active === true || active === "true",
      description: description || "",
    });

    await coupon.save();
    getIO().emit("coupon:created", coupon);
    return res.status(200).json({ message: "Coupon created", edit: false, coupon });
  } catch (error) {
    console.log("error while creating/updating coupon ", error);
    return res.status(500).json({ success: false, message: "Coupon operation error" });
  }
};

export const adminGetAllCouponsController = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ message: "success", coupons });
  } catch (error) {
    console.log("error while getting coupons ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const adminDeleteCouponController = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    await Coupon.findByIdAndDelete(id);
    getIO().emit("coupon:deleted", id);
    return res.status(200).json({ message: "Coupon deleted" });
  } catch (error) {
    console.log("error while deleting coupon ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const adminToggleCouponController = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    coupon.active = !coupon.active;
    const updated = await coupon.save();
    getIO().emit("coupon:updated", updated);
    return res.status(200).json({ message: `Coupon ${updated.active ? "activated" : "deactivated"}`, coupon: updated });
  } catch (error) {
    console.log("error toggling coupon ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
