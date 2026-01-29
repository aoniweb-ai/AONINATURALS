import {
  Package,
  MapPin,
  CreditCard,
  Truck,
  User,
  Calendar,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  X,
  Printer
} from "lucide-react";
import { getCloudinaryImage } from "../utils/getCloudinaryImage";
import { formatDateTime } from "../utils/formatDateTime";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useAdminBear from "../store/admin.store";
import OrdersSkeleton from "./OrderSkeleton";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import useUserBear from "../store/user.store";
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
};

const modalOverlayVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: { 
    opacity: 1, 
    backdropFilter: "blur(8px)",
    transition: { duration: 0.3 } 
  },
  exit: { opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.2 } },
};

const modalContentVariants = {
  hidden: { scale: 0.9, opacity: 0, y: 20 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  },
  exit: { scale: 0.95, opacity: 0, y: 10, transition: { duration: 0.2 } },
};

const statusStyles = (status) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "shipped":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const OrderDetails = () => {
  const { adminGetAnOrder, adminUpdateOrderStatus, admin } = useAdminBear(
    (state) => state
  );
  const { userGetOrder, user } = useUserBear((state) => state);
  const { register, handleSubmit, reset } = useForm();
  const printRef = useRef();

  const [order, setOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const { order_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    reset({
      status: order?.status,
      delivery_date: order?.delivery_date
        ? new Date(order.delivery_date).toISOString().split("T")[0]
        : "",
    });
  }, [order, reset]);

  useEffect(() => {
    if (admin) {
      adminGetAnOrder(order_id)
        .then((res) => setOrder(res))
        .catch((err) => toast.error(err));
    } else if (user) {
      userGetOrder(order_id)
        .then((res) => {
          setOrder(res);
        })
        .catch((err) => toast.error(err));
    }
  }, [order_id, adminGetAnOrder]);

  const onSubmitStatus = async (data) => {
    try {
      setUpdateLoader(true);
      const res = await adminUpdateOrderStatus({
        order_id: order.order_id,
        status: data.status,
        delivery_date: data.delivery_date,
      });
      setOrder(res);
      toast.success(`Order status updated to ${data?.status}`);
      setOpenModal(false);
    } catch (error) {
      toast.error(error || "Failed to update status");
    } finally {
      setUpdateLoader(false);
    }
  };

  const handlePrintInvoice = () => {
    const original = document?.body?.innerHTML;
    const invoiceHTML = printRef?.current?.innerHTML;

    document.body.innerHTML = invoiceHTML;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  };

  if (!order) return <OrdersSkeleton />;

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#f8f9fa] py-8 lg:py-12 font-sans selection:bg-black selection:text-white"
    >
      <div ref={printRef} className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* --- TOP NAVIGATION & ACTIONS --- */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={3} /> Back to Orders
          </motion.button>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrintInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-xl text-xs font-bold shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <Printer size={14}/> Print Invoice
            </motion.button>
            {admin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenModal(true)}
                className="px-6 py-2 bg-black text-white rounded-xl text-xs font-bold shadow-lg shadow-black/20 hover:bg-gray-800 transition-all"
              >
                Update Status
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* --- HEADER BANNER --- */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden"
        >
           {/* Decorative bg blur */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="space-y-2 z-10">
            <div className="flex items-start sm:items-center sm:flex-row flex-col gap-3">
              <h1 className="sm:text-3xl text-2xl font-black text-gray-900 tracking-tighter">
                Order #{order.order_id}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1 ${statusStyles(
                  order.status
                )}`}
              >
                {order.status === "delivered" && <CheckCircle2 size={12} />}
                {order.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm flex items-center gap-2 font-medium">
              <Calendar size={14} /> {admin && "Received on"}
              {user && "Placed on"} {formatDateTime(order.createdAt)}
            </p>
          </div>

          <div className="text-right hidden sm:block z-10">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Grand Total
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              ₹{order.total_price.toLocaleString()}
            </h2>
          </div>
        </motion.div>

        {/* --- CUSTOMER & PAYMENT INFO --- */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* CUSTOMER INFO CARD */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <div className="p-2.5 bg-gray-50 rounded-2xl text-black">
                <User size={20} strokeWidth={2.5} />
              </div>
              <h2 className="font-black text-gray-900 uppercase tracking-widest text-xs">
                Customer Profile
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center group">
                <span className="text-gray-400 text-sm font-medium">Full Name</span>
                <span className="font-bold text-gray-900 group-hover:text-black transition-colors">
                  {order.user.fullname}
                </span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-gray-400 text-sm font-medium">Email</span>
                <span className="font-medium text-gray-900 group-hover:text-black transition-colors">
                  {order.user.email}
                </span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-gray-400 text-sm font-medium">Phone</span>
                <span className="font-bold text-gray-900 group-hover:text-black transition-colors">
                  {order.user.phone}
                </span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">
                  <MapPin size={12} /> Shipping Details
                </div>
                <div className="bg-gray-50/80 p-5 rounded-3xl space-y-2 text-sm text-gray-600 font-medium leading-relaxed">
                  <p>{order?.address?.address}</p>
                  <div className="flex gap-4">
                    <p><span className="font-bold text-gray-400 text-xs uppercase">State:</span> {order?.address?.state}</p>
                    <p><span className="font-bold text-gray-400 text-xs uppercase">Pin:</span> {order?.address?.pincode}</p>
                  </div>
                  {order?.address?.landmark && (
                     <p><span className="font-bold text-gray-400 text-xs uppercase">Landmark:</span> {order?.address?.landmark}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* PAYMENT & LOGISTICS CARD */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <div className="p-2.5 bg-gray-50 rounded-2xl text-black">
                <CreditCard size={20} strokeWidth={2.5} />
              </div>
              <h2 className="font-black text-gray-900 uppercase tracking-widest text-xs">
                Payment & Logistics
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium">Method</span>
                <span className="font-black uppercase text-[10px] tracking-tight bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600">
                  {order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium">Status</span>
                <span
                  className={`font-bold capitalize px-2 py-0.5 rounded ${
                    order.payment_status === "paid"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {order.payment_status}
                </span>
              </div>

              {order.razorpay_order_id && (
                <div className="pt-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                    Razorpay Ref
                  </p>
                  <p className="text-xs font-mono text-gray-500 bg-gray-50 p-3 rounded-xl flex items-center justify-between group cursor-copy hover:bg-gray-100 transition-colors">
                    {order.razorpay_order_id}
                    <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
                  </p>
                </div>
              )}

              <div className="pt-2 grid grid-cols-2 gap-3">
                 {/* Shipping Fee Box */}
                <div className="bg-black rounded-2xl p-4 text-white relative overflow-hidden group">
                  <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:opacity-20 transition-opacity">
                    <Truck size={60} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Shipping
                  </p>
                  <p className="text-lg font-bold mt-1">
                    {order.cod_charges > 0 ? `₹${order.cod_charges}` : "FREE"}
                  </p>
                </div>

                {/* Delivery Date Box */}
                <div className={`border rounded-2xl p-4 flex flex-col justify-center ${
                    order.status === "delivered" ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-200"
                }`}>
                   <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
                       order.status === "delivered" ? "text-emerald-600" : "text-gray-400"
                   }`}>
                    {order.status === "delivered" ? "Delivered" : "Est. Delivery"}
                  </h3>
                  <span className={`text-base font-black ${
                      order.status === "delivered" ? "text-emerald-800" : "text-gray-900"
                  }`}>
                    {order?.delivery_date
                      ? formatDateTime(order?.delivery_date).slice(0, formatDateTime(order?.delivery_date).indexOf(","))
                      : "TBA"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- ITEM LIST --- */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
            <h2 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
              <Package size={18} /> Shipment Items <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{order.product.length}</span>
            </h2>
          </div>

          <div className="divide-y divide-gray-50">
            {order.product.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 lg:px-8 hover:bg-gray-50/80 transition-colors flex items-center gap-6 group"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-gray-100 p-2 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={getCloudinaryImage(
                      item.product.product_images?.[0]?.secure_url,
                      { width: 150 }
                    )}
                    alt={item.product.product_name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate tracking-tight text-lg">
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
              </motion.div>
            ))}
          </div>

          {/* FINAL SUMMARY FOOTER */}
          <div className="bg-gray-50/50 p-8 lg:px-12">
            <div className="w-full space-y-3">
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
              <div className="h-px bg-gray-200 my-4 border-dashed"></div>
              <div className="flex justify-between items-center">
                 <span className="font-bold text-gray-900">Total Paid</span>
                 <span className="text-2xl font-black text-gray-900">₹{order.total_price}</span>
              </div>
              <div className="flex items-center justify-end mt-2 gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 w-fit ml-auto px-3 py-1 rounded-full">
                <CheckCircle2 size={14} />
                Inclusive of all taxes
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {openModal && admin && (
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalContentVariants}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setOpenModal(false)}
                className="absolute right-6 top-6 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full p-2 transition-all"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black text-gray-900 mb-1">Update Status</h2>
              <p className="text-sm text-gray-500 mb-6">Change the delivery status for this order.</p>

              <form onSubmit={handleSubmit(onSubmitStatus)} className="space-y-4">
                <div className="space-y-3">
                    {["pending", "shipped", "delivered", "cancelled"].map((status) => (
                    <label
                        key={status}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-black hover:bg-gray-50 transition-all group"
                    >
                        <input
                        type="radio"
                        value={status}
                        defaultChecked={order.status === status}
                        {...register("status", { required: true })}
                        className="w-5 h-5 accent-black cursor-pointer"
                        />
                        <span className="font-bold capitalize text-gray-700 group-hover:text-black">{status}</span>
                    </label>
                    ))}
                </div>

                <div className="pt-2">
                  <label
                    htmlFor="delivery_date"
                    className="font-black text-gray-900 uppercase tracking-widest text-xs block mb-2"
                  >
                    Expected Delivery Date
                  </label>
                  <input
                    {...register("delivery_date")}
                    id="delivery_date"
                    type="date"
                    className="w-full p-3 bg-gray-50 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpenModal(false)}
                    className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={updateLoader}
                    className="flex-1 py-3.5 bg-black text-white rounded-xl font-bold shadow-lg shadow-black/20 hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {updateLoader ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Update Status"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default OrderDetails;