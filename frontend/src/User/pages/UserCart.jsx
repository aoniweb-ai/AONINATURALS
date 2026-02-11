import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  Percent,
  CheckCircle2,
  Truck,
  AlertCircle,
} from "lucide-react";
import useUserBear from "../../../store/user.store";
import { useEffect, useState } from "react";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { loadRazorpay } from "../../../utils/loadRazorpay";
import toast from "react-hot-toast";
import CenterLoader from "../../../components/CenterLoader";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const UserCart = () => {
  const {
    user,
    userAddToCart,
    userCreateOrder,
    userVerifyPayment,
    userRemoveCartItem,
  } = useUserBear((state) => state);

  const [mrp, setMrp] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [totalDiscountPercent, setTotalDiscountPercent] = useState(0);
  const [codCharges, setCodCharges] = useState(0);
  const [value, setValue] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("online");

  const [loader, setLoader] = useState(false);
  const [cartUpdate_loader, setCartUpdate_loader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMrp(0);
    setSellingPrice(0);
    setTotalDiscountPercent(0);
    setCodCharges(0);
    setValue([]);

    user?.cart?.map((item) => {
      if (item.product.stock > 0 && !item.product.sold) {
        setMrp((prev) => prev + item.product.price * item.value);
        setSellingPrice((prev) => prev + item.product.final_price * item.value);
        setTotalDiscountPercent(
          (prev) => prev + item.product.discount + item.product.extra_discount,
        );
        setCodCharges((prev) => prev + item.product.cod_charges);
        setValue((prev) => [...prev, item.value]);
      } else {
        setValue((prev) => [...prev, item.value]);
      }
    });
  }, [user]);

  const finalPayableAmount =
    paymentMethod === "cod" ? sellingPrice + codCharges : sellingPrice;

  const updateTheCart = async (num, product_id) => {
    try {
      if (num === 0) return toast.error("Quantity cannot be zero");
      setCartUpdate_loader(true);
      await userAddToCart({ id: product_id, quantity: num });
      toast.success("Cart updated");
    } catch (error) {
      toast.error(error?.message || "Update failed");
    } finally {
      setCartUpdate_loader(false);
    }
  };

  const handleCheckout = async () => {
    if (!user?.address?.address || !user?.address?.pincode) {
      toast("Please complete your profile details before checkout", {
        icon: "ℹ️",
      });
      return navigate("/account");
    }
    try {
      setLoader(true);

      const response = await userCreateOrder({ payment_method: paymentMethod });

      if (paymentMethod === "online") {
        const res = await loadRazorpay();
        if (!res) {
          toast.error("Razorpay SDK failed to load");
          setLoader(false);
          return;
        }
        const order = response?.order;
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Aoni Naturals",
          description: "Order Payment",
          order_id: order.id,
          handler: async function (res) {
            try {
              setLoader(true);
              await userVerifyPayment(res);
              toast.success("Payment Successful 🎉");
              navigate("/orders");
            } catch (error) {
              toast.error(error || "Payment verification failed");
            } finally {
              setLoader(false);
            }
          },
          theme: { color: "#000000" },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else if (paymentMethod === "cod") {
        toast.success("Order placed successfully! 🚚");
        navigate("/orders");
      }
    } catch (error) {
      if (error) toast.error(error || "Checkout failed");
    } finally {
      setLoader(false);
    }
  };

  const removeCartItem = (id) => {
    if (confirm("Remove this item from cart?")) userRemoveCartItem(id);
  };

  if (loader) return <CenterLoader />;

  if (!user?.cart || user?.cart.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex flex-col items-center justify-center bg-white px-4 text-center"
      >
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative">
          <ShoppingBag size={40} className="text-gray-300" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full"
          />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Your cart is feeling lonely
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven't added anything yet. Explore our best sellers
          and find something you love.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 hover:scale-105 transition-all shadow-lg shadow-black/20"
        >
          Start Shopping
        </button>
      </motion.section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="bg-gray-50 min-h-screen font-sans pb-32 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl lg:text-4xl font-black text-gray-900 mb-8 tracking-tight flex items-baseline gap-3"
        >
          Shopping Cart
          <span className="text-lg font-medium text-gray-400">
            ({user?.cart?.length} Items)
          </span>
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* --- LEFT: PRODUCTS --- */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {user?.cart?.map((item, index) => {
                  const isOutOfStock =
                    item.product.stock <= 0 || item.product.sold;
                  const hasQuantityChanged = value[index] !== item.value;

                  return (
                    <motion.div
                      layout
                      key={item._id}
                      variants={itemVariants}
                      exit={{
                        scale: 0.9,
                        opacity: 0,
                        height: 0,
                        marginBottom: 0,
                      }}
                      className={`group bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${isOutOfStock ? "opacity-75 bg-gray-50" : ""}`}
                    >
                      <div className="flex gap-4 sm:gap-6 items-start relative z-10">
                        {/* Image */}
                        <div className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#f4f4f5] rounded-2xl p-2 overflow-hidden border border-gray-100">
                          <img
                            src={getCloudinaryImage(
                              item.product.product_images?.[0]?.secure_url,
                              { width: 300, quality: 70 },
                            )}
                            alt={item.product.product_name}
                            className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? "grayscale" : ""}`}
                          />
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                                Sold Out
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-h-24 sm:min-h-32">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h3 className="font-bold text-gray-900 text-base sm:text-xl line-clamp-1 leading-tight">
                                  {item.product.product_name}
                                </h3>
                                <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2">
                                  {item.product.description}
                                </p>
                              </div>
                              <button
                                onClick={() => removeCartItem(item._id)}
                                className="text-gray-300 hover:text-red-500 p-1 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-lg sm:text-xl font-bold text-gray-900">
                                ₹{Math.round(item.product.final_price)}
                              </span>
                              {(item.product.discount > 0 ||
                                item.product.extra_discount > 0) && (
                                <>
                                  <span className="text-sm text-gray-400 line-through">
                                    ₹{item.product.price}
                                  </span>
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                    {item.product.discount +
                                      item.product.extra_discount}
                                    % OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          {!isOutOfStock && (
                            <div className="flex items-center justify-between mt-3 pt-2">
                              <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200 shadow-inner">
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  disabled={value[index] <= 1}
                                  onClick={() => {
                                    const arr = [...value];
                                    arr[index] = Math.max(
                                      1,
                                      (value[index] || 1) - 1,
                                    );
                                    setValue(arr);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <Minus size={14} />
                                </motion.button>

                                <span className="w-10 text-center font-bold text-sm text-gray-900">
                                  {value[index]}
                                </span>

                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    const arr = [...value];
                                    arr[index] = (value[index] || 1) + 1;
                                    setValue(arr);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 hover:text-black"
                                >
                                  <Plus size={14} />
                                </motion.button>
                              </div>

                              {hasQuantityChanged && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  onClick={() =>
                                    updateTheCart(
                                      value[index] - item.value,
                                      item.product._id,
                                    )
                                  }
                                  disabled={cartUpdate_loader}
                                  className="text-xs font-bold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all shadow-md shadow-black/20"
                                >
                                  {cartUpdate_loader ? "Updating..." : "Update"}
                                </motion.button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* --- RIGHT: DETAILED SUMMARY --- */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-100 border border-white sticky top-24"
            >
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({user?.cart?.length} items)</span>
                  <span className="font-medium">₹{Math.round(mrp)}</span>
                </div>

                {totalDiscountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 items-center">
                    <span className="flex items-center gap-1">
                      <Percent size={14} /> Discount
                    </span>
                    <span className="font-bold">
                      - ₹{Math.round(mrp - sellingPrice)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck size={14} /> Delivery
                  </span>
                  {paymentMethod === "online" ? (
                    <span className="text-emerald-600 font-bold text-xs uppercase bg-emerald-50 px-2 py-0.5 rounded">
                      Free
                    </span>
                  ) : (
                    <span className="font-medium text-gray-900">
                      {codCharges === 0
                        ? "Free"
                        : `+ ₹${Math.round(codCharges)}`}
                    </span>
                  )}
                </div>
              </div>

              {/* PAYMENT METHOD TOGGLE */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod("online")}
                    className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden ${paymentMethod === "online" ? "border-black bg-gray-900 text-white shadow-lg scale-[1.02]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                  >
                    {paymentMethod === "online" && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                      </div>
                    )}
                    <CreditCard size={24} />
                    <span className="text-xs font-bold">Pay Online</span>
                    {paymentMethod === "online" && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded">
                        Free Delivery
                      </span>
                    )}
                  </div>

                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden ${paymentMethod === "cod" ? "border-black bg-gray-900 text-white shadow-lg scale-[1.02]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                      </div>
                    )}
                    <Banknote size={24} />
                    <span className="text-xs font-bold">Cash on Delivery</span>
                    {codCharges > 0 && (
                      <span className="text-[10px] bg-white/20 px-1.5 rounded">
                        +₹{codCharges} Fee
                      </span>
                    )}
                  </div>
                </div>

                {paymentMethod === "cod" && codCharges > 0 && (
                  <div className="mt-3 flex items-start gap-2 text-[11px] text-orange-600 bg-orange-50 p-2 rounded-lg">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <p>Pay online to save ₹{codCharges} on COD charges.</p>
                  </div>
                )}
              </div>

              {/* TOTAL & BUTTON */}
              <div className="flex justify-between items-end mb-6">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <div className="text-right">
                  <motion.span
                    key={finalPayableAmount}
                    initial={{ scale: 1.2, color: "#10b981" }}
                    animate={{ scale: 1, color: "#111827" }}
                    className="font-black text-3xl text-gray-900"
                  >
                    ₹{Math.ceil(finalPayableAmount)}
                  </motion.span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => finalPayableAmount > 0 && handleCheckout()}
                disabled={finalPayableAmount <= 0}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${finalPayableAmount <= 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800 shadow-black/20"}`}
              >
                {paymentMethod === "cod" ? "Place Order" : "Proceed to Pay"}
                <ArrowRight size={18} />
              </motion.button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" /> 100%
                Secure Payment
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- MOBILE FOOTER --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 pb-6 z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
              Total Payable
            </p>
            <p className="text-2xl font-black text-gray-900 leading-none">
              ₹{Math.ceil(finalPayableAmount)}
            </p>
          </div>
          <button
            onClick={() => finalPayableAmount > 0 && handleCheckout()}
            className="flex-1 bg-black text-white py-3.5 rounded-xl font-bold shadow-lg shadow-black/20 active:scale-95 transition-transform"
          >
            {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserCart;
