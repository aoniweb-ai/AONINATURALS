import {
  Package,
  MapPin,
  CreditCard,
  Truck,
  User,
  Calendar,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { getCloudinaryImage } from "../utils/getCloudinaryImage";
import { formatDateTime } from "../utils/formatDateTime";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAdminBear from "../store/admin.store";
import OrdersSkeleton from "./OrderSkeleton";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import { useRef } from "react";
import useUserBear from "../store/user.store";

const statusStyles = (status) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-600 border-amber-100";
    case "shipped":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "delivered":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "cancelled":
      return "bg-red-50 text-red-600 border-red-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
};

const OrderDetails = () => {
  const { adminGetAnOrder, adminUpdateOrderStatus, admin } = useAdminBear(
    (state) => state,
  );
  const {userGetOrder, user} = useUserBear(state=>state);
  const { register, handleSubmit } = useForm();
  const printRef = useRef();

  const [order, setOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { order_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(admin){
      adminGetAnOrder(order_id)
      .then((res) => setOrder(res))
      .catch((err) => toast.error(err));
    } else if(user){
      userGetOrder(order_id)
      .then((res) => {
        setOrder(res)
      })
      .catch((err) => toast.error(err));
    }
  }, [order_id, adminGetAnOrder]);

  const onSubmitStatus = async (data) => {
    try {
      await adminUpdateOrderStatus({
        order_id: order.order_id,
        status: data.status,
      });
      toast.success(`Order status updated to ${data?.status}`);
    } catch (error) {
      toast.error(error || "Failed to update status");
    } finally {
      setOpenModal(false);
    }
  };

  const handlePrintInvoice = () => {
    const original = document.body.innerHTML;
    const invoiceHTML = printRef.current.innerHTML;

    document.body.innerHTML = invoiceHTML;
    window.print();
    document.body.innerHTML = original;
    window.location.reload(); // restore react
  };

  if (!order) return <OrdersSkeleton />;

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 lg:py-12">
      <div ref={printRef} className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* --- TOP NAVIGATION & ACTIONS --- */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all"
          >
            <ArrowLeft size={16} strokeWidth={3} /> Back to Orders
          </button>
          <div className="flex gap-2">
            <button
              onClick={handlePrintInvoice}
              className="btn btn-sm btn-ghost text-gray-500 rounded-xl"
            >
              Print Invoice
            </button>
            {admin && <button
              onClick={() => setOpenModal(true)}
              className="btn btn-sm bg-black text-white rounded-xl px-6"
            >
              Update Status
            </button>}
          </div>
        </div>

        {/* --- HEADER BANNER --- */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center sm:flex-row flex-col gap-3">
              <h1 className="sm:text-3xl text-xl font-black  text-gray-900 tracking-tighter">
                Order #{order.order_id}
              </h1>
              <span
                className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles(order.status)}`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <Calendar size={14} /> {admin && 'Received on'}{user && 'Placed on'}{" "}
              {formatDateTime(order.createdAt)}
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Grand Total
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              ₹{order.total_price.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* --- CUSTOMER & PAYMENT INFO --- */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* CUSTOMER INFO CARD */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <div className="p-2 bg-gray-50 rounded-xl text-black">
                <User size={20} />
              </div>
              <h2 className="font-black text-gray-900 uppercase tracking-widest text-xs">
                Customer Profile
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Full Name</span>
                <span className="font-bold text-gray-900">
                  {order.user.fullname}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Email Address</span>
                <span className="font-medium text-gray-900">
                  {order.user.email}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Phone Number</span>
                <span className="font-bold text-gray-900">
                  {order.user.phone}
                </span>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                  <MapPin size={14} /> SHIPPING ADDRESS
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium bg-gray-50 p-4 rounded-2xl">
                  {order.address}
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT & LOGISTICS CARD */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <div className="p-2 bg-gray-50 rounded-xl text-black">
                <CreditCard size={20} />
              </div>
              <h2 className="font-black text-gray-900 uppercase tracking-widest text-xs">
                Payment & Logistics
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Payment Method</span>
                <span className="font-black uppercase text-xs tracking-tighter bg-gray-100 px-3 py-1 rounded-lg">
                  {order.payment_method === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Payment Status</span>
                <span
                  className={`font-bold capitalize ${order.payment_status === "paid" ? "text-emerald-500" : "text-amber-500"}`}
                >
                  {order.payment_status}
                </span>
              </div>
              {order.razorpay_order_id && (
                <div className="pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    Razorpay Reference
                  </span>
                  <p className="text-xs font-mono text-gray-500 break-all bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                    {order.razorpay_order_id}
                    <ExternalLink size={12} className="cursor-pointer" />
                  </p>
                </div>
              )}
              <div className="pt-4">
                <div className="bg-black rounded-2xl p-5 text-white flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Shipping Fee
                    </p>
                    <p className="text-sm font-bold">
                      {order.cod_charges > 0 ? `₹${order.cod_charges}` : "FREE"}
                    </p>
                  </div>
                  <Truck size={24} className="opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- ITEM LIST --- */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
              <Package size={18} /> Shipment Items ({order.product.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-50">
            {order.product.map((item, index) => (
              <div
                key={index}
                className="p-6 lg:px-8 hover:bg-gray-50/50 transition-colors flex items-center gap-6"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-2 shrink-0">
                  <img
                    src={getCloudinaryImage(
                      item.product.product_images?.[0]?.secure_url,
                      { width: 150 },
                    )}
                    alt={item.product.product_name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-900 truncate tracking-tight">
                    {item.product.product_name}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Qty: <span className="text-black">{item.quantity}</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-gray-900">
                    ₹{item.price * item.quantity}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    ₹{item.price} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* FINAL SUMMARY FOOTER */}
          <div className="bg-gray-50/50 p-8 lg:px-12">
            <div className="max-w-xs ml-auto space-y-3">
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Order Subtotal</span>
                <span>₹{order.total_price - (order.cod_charges || 0)}</span>
              </div>
              {order.cod_charges > 0 && (
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Handling / COD</span>
                  <span>+₹{order.cod_charges}</span>
                </div>
              )}
              <div className="h-px bg-gray-200 my-4"></div>
              <div className="flex justify-between items-center text-xl font-black text-gray-900">
                <span>Grand Total</span>
                <span>₹{order.total_price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(openModal && admin) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-black mb-4">Update Order Status</h2>

            <form onSubmit={handleSubmit(onSubmitStatus)} className="space-y-4">
              {["pending", "shipped", "delivered", "cancelled"].map(
                (status) => (
                  <label
                    key={status}
                    className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      value={status}
                      defaultChecked={order.status === status}
                      {...register("status", { required: true })}
                      className="radio radio-primary"
                    />
                    <span className="font-semibold capitalize">{status}</span>
                  </label>
                ),
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-neutral">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};



export default OrderDetails;
