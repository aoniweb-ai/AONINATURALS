import { Minus, Plus, Trash2 } from "lucide-react";
import useUserBear from "../../../store/user.store";
import { useEffect, useState } from "react";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { loadRazorpay } from "../../../utils/loadRazorpay";
import toast from "react-hot-toast";
import CenterLoader from "../../../components/CenterLoader";

const UserCart = () => {
  const { user, userAddToCart, userCreateOrder, userVerifyPayment, userRemoveCartItem } =
    useUserBear((state) => state);
  const [subtotal, setSubtotal] = useState(0);
  const [loader, setLoader] = useState(false);
  const [cartUpdate_loader, setCartUpdate_loader] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [codCharges, setCodCharges] = useState(0);
  const [value, setValue] = useState([]);

  useEffect(() => {
    setSubtotal(0);
    setTotal(0);
    setTotalDiscount(0);
    setCodCharges(0);
    setValue([]);
    user?.cart?.map((item) => {
      if((item.product.stock>0 && !item.product.sold)){
        setSubtotal((prev) => prev + item.product.price * item.value);
        setTotal((prev) => prev + item.product.final_price * item.value);
        setTotalDiscount(
          (prev) => prev + item.product.discount + item.product.extra_discount,
        );
        setCodCharges((prev) => prev + item.product.cod_charges);
        setValue((prev) => [...prev, item.value]);
      }
    });
  }, [user]);

  const updateTheCart = async (num, product_id) => {
    try {
      if(num==0) return toast.error("Invalid input")
      setCartUpdate_loader(true);
      await userAddToCart({ id: product_id, quantity: num });
    } catch (error) {
      toast.error(error);
    } finally {
      setCartUpdate_loader(false);
    }
  };

  const handleCheckout = async () => {
    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const response = await userCreateOrder({payment_method:"online"});
    const order = response?.order;
    if(response.payment_method=="online"){
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
          } catch (error) {
            toast.error(error);
          } finally {
            setLoader(false);
          }
        },
  
        theme: {
          color: "#000000",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } else if(response.payment_method=="cod"){
      toast.success("Order placed")
    }


  };

  const removeCartItem = (id)=>{
    userRemoveCartItem(id);
  }

  return !loader ? (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-semibold mb-8">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-6 ">
            {user?.cart?.map((item, index) => {
              return (
                item && 
                <div
                  key={item._id}
                  className={`rounded-2xl ${(item.product.stock>0 && !item.product.sold) ? 'bg-success-content' : 'bg-error-content'} p-4 sm:p-6 flex gap-4  items-center`}
                >
                  <img
                    src={
                      getCloudinaryImage(
                        item.product.product_images?.[0]?.secure_url,
                        {
                          width: 250,
                          quality: 20,
                        },
                      ) || null
                    }
                    alt={item.product.product_name}
                    className="w-20 h-20 object-contain bg-gray-100 rounded-xl"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-lg">
                      {item.product.product_name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">
                        ₹{Math.round(item.product.final_price)}
                      </span>

                      {(item.product.discount ||
                        item.product.extra_discount) && (
                        <span className="line-through text-gray-400">
                          ₹{item.product.price}
                        </span>
                      )}
                    </div>

                    {(item.product.discount || item.product.extra_discount) && (
                      <p className="text-xs text-green-600">
                        {item.product.discount || 0}% +{" "}
                        {item.product.extra_discount || 0}% off
                      </p>
                    )}

                    {item.product.cod_charges > 0 && (
                      <p className="text-xs text-gray-500">
                        COD Charges: ₹{item.product.cod_charges}
                      </p>
                    )}

                    {/* QTY */}
                    {(item.product.stock!=0 && !item.product.sold) && 
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => {
                          const decr = value[index] - 1;
                          if (decr >= 0) {
                            const arr = value;
                            arr.splice(index, 1, decr);
                            setValue((prev) => [...prev]);
                          }
                        }}
                        className="p-2 cursor-pointer border rounded-lg"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-8 text-center">{value[index] || 0}</span>

                      <button
                        onClick={() => {
                          const incr = value[index] + 1;
                          const arr = value;
                          arr.splice(index, 1, incr);
                          setValue((prev) => [...prev]);
                        }}
                        className="p-2 cursor-pointer border rounded-lg"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    }
                  </div>

                  <button
                    onClick={()=>removeCartItem(item._id)}
                  className="text-red-500 hover:text-red-600 cursor-pointer">
                    <Trash2 size={20} />
                  </button>

                  {(item.product.stock>0 && !item.product.sold) && (cartUpdate_loader ? (
                    <button className="btn btn-ghost">
                      <span className="loading loading-dots loading-xl"></span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        updateTheCart(
                          value[index] - item.value,
                          item.product._id,
                        )
                      }
                      className="btn btn-info"
                    >
                      update cart
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{Math.round(subtotal)}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>
                  You Saved <p className="opacity-50">(combined discount %)</p>
                </span>
                <span>-{Math.round(totalDiscount)}%</span>
              </div>

              <div className="flex justify-between">
                <span>
                  COD Charges <p className="opacity-50">(combined charges)</p>
                </span>
                <span>
                  {codCharges === 0 ? "Free" : `₹${Math.round(codCharges)}`}
                </span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{Math.ceil(total)}</span>
              </div>
            </div>

            <button
              onClick={() => total > 0 && handleCheckout()}
              className={` ${total <= 0 ? "cursor-not-allowed" : "cursor-pointer"} mt-6 w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY CHECKOUT */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Total</span>
          <span className="font-semibold">₹{total}</span>
        </div>
        <button
          onClick={() => total > 0 && handleCheckout}
          className={` ${total <= 0 ? "cursor-not-allowed" : ""} mt-6 w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition`}
        >
          Checkout
        </button>
      </div>
    </section>
  ) : (
    <CenterLoader />
  );
};

export default UserCart;
