import razorpay from "../libs/razorpay.js";
import crypto from "crypto";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
export const createOrderController = async (req, res) => {
    const {_id} = req.user;
  try {
    const user = await User.findById(_id).populate({
        path: "cart.product",
        select: "product_name price final_price discount cod_charges extra_discount product_images",
    });
    const cart = user.cart;
    if(cart.length==0) return res.status(401).json({message:"Invalid cart items"});

    let amount = 0;
    let product_ids = [];

    cart?.map((item)=>{
        amount += Math.round(Math.round(item.product.final_price)*item.value);
    })

    cart?.map((item)=>{
        const obj ={
            product:item.product._id,
            quantity:item.value
        }
        product_ids.push(obj)  
    })

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
    
    const dbOrder = Order({
        order_id:order.id,
        user:user._id,
        product:product_ids,
        total_price:amount,
        receipt: `rcpt_${Date.now()}`
    });

    await dbOrder.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("error ",error);
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

    const order = await Order.findOneAndUpdate({order_id:razorpay_order_id},{payment_status:"done"});
    await order.save();

    user.cart = []
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified",
      user
    });
  } catch (error) {
    console.log("error while verifying payment ",error);
    res.status(500).json({
      success: false,
      message: "Verification error",
    });
  }
};

