import razorpay from "../libs/razorpay.js";
import crypto from "crypto";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { generateOrderId } from "../libs/generateId.js";
import Admin from "../models/admin.model.js";
import Coupon from "../models/coupon.model.js";
import { getIO } from "../libs/socket.js";
export const createOrderController = async (req, res) => {
  try {
    const { _id } = req.user;
    const { payment_method, coupon_code, coupon_discount } = req.body;
    const user = await User.findById(_id).populate({
      path: "cart.product",
      select: "product_name price stock sold final_price discount extra_discount product_images",
    });
    const admin = await Admin.findOne().select(["-username","-password","-role","-_id"]);
    const cart = user.cart;
    if (cart.length == 0) return res.status(401).json({ message: "Invalid cart items" });
    if (!user?.address?.address || !user?.phone) return res.status(401).json({ message: "Profile Incompleted" });

    let amount = 0;
    let product_ids = [];

    cart?.map((item) => {
      if (item.product.stock > 0 && !item.product.sold) {
        amount += Math.round(Math.round(item.product.final_price) * item.value);
      }
    });

    cart?.map((item) => {
      if (item.product.stock > 0 && !item.product.sold) {
        const obj = {
          product: item.product._id,
          quantity: item.value,
          price: item.product.final_price,
        }
        product_ids.push(obj)
      }
    });

    if (amount <= 0 || product_ids.length == 0) return res.status(401).json({ message: "Invalid cart items" });

    let validCouponDiscount = 0;
    if (coupon_code && coupon_discount > 0) {
      const coupon = await Coupon.findOne({ code: coupon_code.toUpperCase().trim(), active: true });
      if (coupon && (!coupon.expiry || new Date(coupon.expiry) >= new Date()) &&
          (coupon.usage_limit === null || coupon.used_count < coupon.usage_limit) &&
          !coupon.used_by.includes(_id.toString()) &&
          amount >= coupon.min_order_amount) {
        if (coupon.discount_type === "percent") {
          validCouponDiscount = Math.round((amount * coupon.discount_value) / 100);
          if (coupon.max_discount !== null && validCouponDiscount > coupon.max_discount) {
            validCouponDiscount = coupon.max_discount;
          }
        } else {
          validCouponDiscount = coupon.discount_value;
          if (validCouponDiscount > amount) validCouponDiscount = amount;
        }
        coupon.used_count += 1;
        coupon.used_by.push(_id);
        await coupon.save();
        getIO().to("admin-room").emit("coupon:updated", coupon);
      }
    }
    amount = amount - validCouponDiscount;
    if (amount <= 0) amount = 0;

    if (payment_method.toLowerCase() == "cod") {
      let cod_charges = admin.cod_charges;
      const dbOrder = Order({
        order_id: generateOrderId(),
        user: user._id,
        address: user.address,
        phone_no: user.phone,
        product: product_ids,
        cod_charges,
        coupon_code: validCouponDiscount > 0 ? coupon_code.toUpperCase().trim() : null,
        coupon_discount: validCouponDiscount,
        total_price: amount+cod_charges,
        payment_method,
        payment_status: "pending",
        receipt: `rcpt_${Date.now()}`
      });

      await dbOrder.save();

      const bulkOps = user.cart.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: {
            $addToSet: { buyers: user._id },
            $inc: { stock: -item.value },
          },
        },
      }));

      await Product.bulkWrite(bulkOps);
      user.cart = [];
      const updatedUser = await user.save();

      const populatedOrder = await Order.findOne({ order_id: dbOrder.order_id })
        .populate({ path: "user", select: "fullname phone address email" })
        .populate({ path: "product.product", select: "product_name product_images final_price" });
      getIO().to("admin-room").emit("order:new", populatedOrder);

      return res.status(200).json({
        success: true,
        payment_method: dbOrder.payment_method,
        user:updatedUser
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const dbOrder = Order({
      order_id: order.id,
      user: user._id,
      coupon_code: validCouponDiscount > 0 ? coupon_code.toUpperCase().trim() : null,
      coupon_discount: validCouponDiscount,
      address: user.address,
      phone_no: user.phone,
      product: product_ids,
      total_price: amount,
      receipt: `rcpt_${Date.now()}`
    });

    await dbOrder.save();

    res.status(200).json({
      success: true,
      order,
      payment_method: dbOrder.payment_method
    });
  } catch (error) {
    console.log("error ", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};


export const verifyPaymentController = async (req, res) => {
  const user = req.user;
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RZP_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
    const order = await Order.findOneAndUpdate({ order_id: razorpay_order_id }, { payment_status: "paid" });
    await order.save();
    const bulkOps = user.cart.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $addToSet: { buyers: user._id },
          $inc: { stock: -item.value },
        },
      },
    }));

    await Product.bulkWrite(bulkOps);


    user.cart = []
    await user.save();

    const populatedOrder = await Order.findOne({ order_id: razorpay_order_id })
      .populate({ path: "user", select: "fullname phone address email" })
      .populate({ path: "product.product", select: "product_name product_images final_price" });
    getIO().to("admin-room").emit("order:new", populatedOrder);

    res.status(200).json({
      success: true,
      message: "Payment verified",
      user,
    });
  } catch (error) {
    console.log("error while verifying payment ", error);
    res.status(500).json({
      success: false,
      message: "Verification error",
    });
  }
};


export const getUserOrders = async (req, res) => {
  const user = req.user;
  try {
    const orders = await Order.find({ user: user._id })
      .populate({
        path: "product.product",
        select: "product_name product_images final_price",
      })
      .sort({ createdAt: -1 });
    if (!orders) res.status(400).json({ success: false, message: "Orders error" });

    return res.status(200).json({ success: true, message: "successfully fetch orders", orders });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Orders error",
    });
  }
}


export const getAnOrderContoller = async (req, res) => {
    try {
        const { order_id } = req.params;
        const order = await Order.findOne({ order_id })
            .populate({
                path: "user",
                select: "fullname phone address email"
            })
            .populate({
                path: "product.product",
                select: "product_name product_images final_price",
            })
        if (!order) return res.status(500).json({ success: false, message: "Order fetching failed" });

        return res.status(200).json({ success: true, message: "Successfully orders getted", order });

    } catch (error) {
        console.log("error while getting orders ", error)
        return res.status(500).json({ success: false, message: "Orders fetching failed" });
    }
}
