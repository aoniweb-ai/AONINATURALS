import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard,
  Banknote,
  Percent
} from "lucide-react";
import useUserBear from "../../../store/user.store";
import { useEffect, useState } from "react";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { loadRazorpay } from "../../../utils/loadRazorpay";
import toast from "react-hot-toast";
import CenterLoader from "../../../components/CenterLoader";
import { useNavigate } from "react-router-dom";

const UserCart = () => {
  const { user, userAddToCart, userCreateOrder, userVerifyPayment, userRemoveCartItem } = useUserBear((state) => state);
  
  // State
  const [mrp, setMrp] = useState(0); // Original Price (Subtotal)
  const [sellingPrice, setSellingPrice] = useState(0); // Discounted Price
  const [totalDiscountPercent, setTotalDiscountPercent] = useState(0);
  const [codCharges, setCodCharges] = useState(0);
  const [value, setValue] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' | 'cod'
  
  const [loader, setLoader] = useState(false);
  const [cartUpdate_loader, setCartUpdate_loader] = useState(false);
  const navigate = useNavigate();

  // --- 1. Calculate Cart Totals ---
  useEffect(() => {
    setMrp(0);
    setSellingPrice(0);
    setTotalDiscountPercent(0);
    setCodCharges(0);
    setValue([]);
    
    user?.cart?.map((item) => {
      // Logic: Only calculate for In-Stock items
      if ((item.product.stock > 0 && !item.product.sold)) {
        setMrp((prev) => prev + item.product.price * item.value);
        setSellingPrice((prev) => prev + item.product.final_price * item.value);
        setTotalDiscountPercent((prev) => prev + item.product.discount + item.product.extra_discount);
        setCodCharges((prev) => prev + item.product.cod_charges);
        setValue((prev) => [...prev, item.value]);
      } else {
        setValue((prev) => [...prev, item.value]);
      }
    });
  }, [user]);

  // --- 2. Dynamic Total Calculation ---
  // Agar COD hai toh COD charges jodo, warna nahi.
  const finalPayableAmount = paymentMethod === "cod" 
    ? sellingPrice + codCharges 
    : sellingPrice;

  // --- 3. Update Cart Logic ---
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

  // --- 4. Checkout Logic ---
  const handleCheckout = async () => {
    try {
      setLoader(true);

      // Create Order with Dynamic Payment Method
      const response = await userCreateOrder({ payment_method: paymentMethod });
      
      // A. Online Payment (Razorpay)
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
              await userVerifyPayment(res);
              toast.success("Payment Successful 🎉");
              navigate('/orders');
            } catch (error) {
              toast.error(error?.message || "Payment verification failed");
            }
          },
          theme: { color: "#000000" },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      
      // B. COD Payment
      } else if (paymentMethod === "cod") {
         toast.success("Order placed successfully! 🚚");
         navigate('/orders');
      }

    } catch (error) {
      toast.error(error?.message || "Checkout failed");
    } finally {
      if (paymentMethod === "cod") setLoader(false);
      else setLoader(false); // Razorpay handles its own UI
    }
  };

  const removeCartItem = (id) => {
    if(confirm("Remove this item from cart?")) userRemoveCartItem(id);
  };

  if (loader) return <CenterLoader />;

  // --- Empty State ---
  if (!user?.cart || user?.cart.length === 0) {
    return (
      <section className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
            <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="mt-4 bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all">
            Start Shopping
        </button>
      </section>
    );
  }

  return (
    <section className="bg-[#f9fafb] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
            Shopping Cart <span className="text-lg font-medium text-gray-400">({user?.cart?.length})</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* --- LEFT: PRODUCTS --- */}
          <div className="lg:col-span-2 space-y-4">
            {user?.cart?.map((item, index) => {
              const isOutOfStock = item.product.stock <= 0 || item.product.sold;
              const hasQuantityChanged = value[index] !== item.value;

              return (
                <div key={item._id} className={`bg-white rounded-3xl p-4 sm:p-5 border border-transparent shadow-sm hover:shadow-md transition-all ${isOutOfStock ? 'opacity-70 bg-gray-50' : ''}`}>
                  <div className="flex gap-4 sm:gap-6 items-start">
                    {/* Image */}
                    <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-[#f4f4f5] rounded-2xl p-2 overflow-hidden">
                       <img
                        src={getCloudinaryImage(item.product.product_images?.[0]?.secure_url, { width: 300, quality: 60 })}
                        alt={item.product.product_name}
                        className={`w-full h-full object-contain mix-blend-multiply ${isOutOfStock ? 'grayscale' : ''}`}
                      />
                      {isOutOfStock && <span className="absolute inset-0 flex items-center justify-center bg-black/10 text-[10px] font-bold text-white uppercase"><span className="bg-red-500 px-2 py-1 rounded">Sold Out</span></span>}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-h-[7rem]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1">{item.product.product_name}</h3>
                                <p className="text-gray-500 text-xs mt-1 line-clamp-1">{item.product.description}</p>
                            </div>
                            <button onClick={() => removeCartItem(item._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-gray-900">₹{Math.round(item.product.final_price)}</span>
                            {(item.product.discount > 0 || item.product.extra_discount > 0) && (
                                <>
                                <span className="text-sm text-gray-400 line-through">₹{item.product.price}</span>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    {item.product.discount + item.product.extra_discount}% OFF
                                </span>
                                </>
                            )}
                        </div>

                        {/* Quantity Controls */}
                        {!isOutOfStock && (
                        <div className="flex items-center justify-between mt-auto pt-3">
                            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                <button disabled={value[index] <= 1} onClick={() => { const arr = [...value]; arr[index] = Math.max(1, (value[index] || 1) - 1); setValue(arr); }} className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 disabled:opacity-50"><Minus size={14} /></button>
                                <span className="w-8 text-center font-bold text-sm">{value[index]}</span>
                                <button onClick={() => { const arr = [...value]; arr[index] = (value[index] || 1) + 1; setValue(arr); }} className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600"><Plus size={14} /></button>
                            </div>
                            {hasQuantityChanged && (
                                <button onClick={() => updateTheCart(value[index] - item.value, item.product._id)} disabled={cartUpdate_loader} className="text-xs font-bold bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all animate-pulse">{cartUpdate_loader ? "..." : "Update Cart"}</button>
                            )}
                        </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- RIGHT: DETAILED SUMMARY --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>

              {/* DETAILS SECTION (Restored) */}
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-gray-100">
                
                {/* MRP */}
                <div className="flex justify-between text-gray-600">
                  <span>Price ({user?.cart?.length} items)</span>
                  <span className="font-medium">₹{Math.round(mrp)}</span>
                </div>

                {/* Savings */}
                {totalDiscountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 items-center">
                  <span className="flex items-center gap-1"><Percent size={14}/> You Saved</span>
                  <span className="font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs">
                     - ₹{Math.round(mrp - sellingPrice)} ({totalDiscountPercent}%)
                  </span>
                </div>
                )}

                {/* Delivery Charges */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Charges</span>
                  {paymentMethod === 'online' ? (
                     <span className="text-emerald-600 font-medium text-xs">FREE</span>
                  ) : (
                     <span className="font-medium text-gray-900">
                        {codCharges === 0 ? "Free" : `+ ₹${Math.round(codCharges)}`}
                     </span>
                  )}
                </div>
              </div>

              {/* PAYMENT METHOD TOGGLE */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setPaymentMethod("online")}
                        className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'online' ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                        <CreditCard size={20} />
                        <span className="text-xs font-bold">Online</span>
                    </button>
                    <button 
                        onClick={() => setPaymentMethod("cod")}
                        className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'cod' ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Banknote size={20} />
                        <span className="text-xs font-bold">COD</span>
                    </button>
                </div>
              </div>

              {/* TOTAL & BUTTON */}
              <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                  <div className="text-right">
                    {paymentMethod === 'cod' && codCharges > 0 && (
                        <p className="text-xs text-gray-400 line-through mr-1">₹{Math.round(sellingPrice)}</p>
                    )}
                    <span className="font-black text-2xl text-gray-900">₹{Math.ceil(finalPayableAmount)}</span>
                  </div>
              </div>

              <button
                onClick={() => finalPayableAmount > 0 && handleCheckout()}
                disabled={finalPayableAmount <= 0}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${finalPayableAmount <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 shadow-black/20'}`}
              >
                {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Pay'} <ArrowRight size={18} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500"/> Secure Payment
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE FOOTER --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                <p className="text-xl font-black">₹{Math.ceil(finalPayableAmount)}</p>
            </div>
            <button
                onClick={() => finalPayableAmount > 0 && handleCheckout()}
                className="flex-1 bg-black text-white py-3 rounded-xl font-bold"
            >
                {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
            </button>
        </div>
      </div>
    </section>
  );
};

export default UserCart;