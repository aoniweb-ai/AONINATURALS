import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RZP_API_KEY,
  key_secret: process.env.RZP_KEY_SECRET,
});

export default razorpay;
