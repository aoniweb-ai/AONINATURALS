import razorpay from "../libs/razorpay.js";
import crypto from "crypto";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { generateOrderId } from "../libs/generateId.js";
export const createOrderController = async (req, res) => {
  try {
    const { _id } = req.user;
    const { payment_method } = req.body;
    const user = await User.findById(_id).populate({
      path: "cart.product",
      select: "product_name price stock sold final_price discount cod_charges extra_discount product_images",
    });
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
          cod_charges:item.product.cod_charges
        }
        product_ids.push(obj)
      }
    });

    if (amount <= 0 || product_ids.length == 0) return res.status(401).json({ message: "Invalid cart items" });

    if (payment_method.toLowerCase() == "cod") {
      let cod_charges = 0;
      cart?.map((item) => {
        if (item.product.stock > 0 && !item.product.sold) {
          cod_charges += Math.round(parseInt(item.product.cod_charges));
        }
      });
      const dbOrder = Order({
        order_id: generateOrderId(),
        user: user._id,
        address: user.address,
        phone_no: user.phone,
        product: product_ids,
        cod_charges,
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
    console.log("Ordrs ", orders);
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
