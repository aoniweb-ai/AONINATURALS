import Coupon from "../models/coupon.model.js";

export const applyCouponController = async (req, res) => {
  const { code, cart_total } = req.body;
  const userId = req.user._id;

  try {
    if (!code) {
      return res.status(400).json({ message: "Please enter a coupon code" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (!coupon.active) {
      return res.status(400).json({ message: "This coupon is no longer active" });
    }

    if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
      return res.status(400).json({ message: "This coupon has expired" });
    }

    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    if (coupon.used_by.includes(userId.toString())) {
      return res.status(400).json({ message: "You have already used this coupon" });
    }

    if (cart_total < coupon.min_order_amount) {
      return res.status(400).json({
        message: `Minimum order amount is ₹${coupon.min_order_amount} to use this coupon`,
      });
    }

    let discount = 0;
    if (coupon.discount_type === "percent") {
      discount = Math.round((cart_total * coupon.discount_value) / 100);
      if (coupon.max_discount !== null && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
      if (discount > cart_total) {
        discount = cart_total;
      }
    }

    return res.status(200).json({
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.log("error while applying coupon ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
