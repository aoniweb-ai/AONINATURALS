import {
  Package,
  ChevronRight,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { getCloudinaryImage } from "../utils/getCloudinaryImage";
import useAdminBear from "../store/admin.store";
import useUserBear from "../store/user.store";
import toast from "react-hot-toast";
import { timeAgo } from "../utils/timeAgo";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const emptyStateVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// Helper for Status Icon/Color
const getStatusStyles = (status) => {
  switch (status) {
    case "delivered":
      return {
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        icon: <CheckCircle size={16} />,
      };
    case "shipped":
      return {
        color: "text-blue-700 bg-blue-50 border-blue-200",
        icon: <Truck size={16} />,
      };
    case "pending":
      return {
        color: "text-amber-700 bg-amber-50 border-amber-200",
        icon: <Clock size={16} />,
      };
    case "cancelled":
      return {
        color: "text-red-700 bg-red-50 border-red-200",
        icon: <XCircle size={16} />,
      };
    default:
      return {
        color: "text-gray-700 bg-gray-50 border-gray-200",
        icon: <Package size={16} />,
      };
  }
};

const getPaymentBadgeColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "paid":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const Orders = ({ orders = [] }) => {
  const { admin, adminUpdateOrderStatus } = useAdminBear((state) => state);
  const { user } = useUserBear((state) => state);

  const navigate = useNavigate();

  const updateStatus = async (id, value) => {
    try {
      await adminUpdateOrderStatus({ order_id: id, status: value });
      toast.success(`Order status updated to ${value}`);
    } catch (error) {
      toast.error(error || "Failed to update status");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50/50 font-sans selection:bg-black selection:text-white"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Order History
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Check the status of recent orders and returns.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Orders</span>
            <span className="text-sm font-bold text-gray-900 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
               {orders?.length}
            </span>
          </div>
        </motion.div>

        {orders?.length === 0 ? (
          <motion.div
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-[2rem] p-16 text-center shadow-xl shadow-gray-200/50 border border-white flex flex-col items-center justify-center min-h-[400px]"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner"
            >
              <ShoppingBag size={48} className="text-gray-300" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
              Looks like you haven't placed any orders yet. Explore our collection and find something you love!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <AnimatePresence>
              {orders?.map((order) => {
                const statusStyle = getStatusStyles(order.status);

                return (
                  <motion.div
                    key={order.order_id}
                    variants={itemVariants}
                    layout // Allows smooth reordering if list changes
                    whileHover={{ 
                      y: -4, 
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                    }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 group"
                  >
                    {/* --- HEADER --- */}
                    <div className="bg-white p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900 font-mono">
                            #{order.order_id.slice(order.order_id.indexOf("_") + 1)}
                          </span>
                          {/* Mobile Status Badge (if not admin) */}
                          {user && (
                            <span
                              className={`sm:hidden flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${statusStyle.color}`}
                            >
                              {statusStyle.icon} {order.status}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                          <Calendar size={14} />
                          <span>Placed {timeAgo(order?.createdAt)}</span>
                        </div>
                      </div>

                      {/* ADMIN CONTROLS or DESKTOP STATUS */}
                      <div className="flex items-center z-10">
                        {admin && (
                          <div className="relative">
                            <select
                              defaultValue={order.status}
                              className={`appearance-none cursor-pointer pl-4 pr-10 py-2 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${statusStyle.color}`}
                              onChange={(e) =>
                                updateStatus(order.order_id, e.target.value)
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {/* Custom Arrow for select */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-current opacity-70">
                              <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        )}
                        {user && (
                          <div
                            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider ${statusStyle.color}`}
                          >
                            {statusStyle.icon}
                            <span>{order.status}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* --- PRODUCTS LIST --- */}
                    <div className="divide-y divide-gray-50">
                      {order?.product?.map((item, index) => (
                        <div
                          key={index}
                          className="p-5 flex gap-5 items-start sm:items-center hover:bg-gray-50/80 transition-colors"
                        >
                          {/* Product Image */}
                          <div className="w-20 h-20 shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 p-2 shadow-sm">
                            <img
                              src={getCloudinaryImage(
                                item.product.product_images?.[0]?.secure_url,
                                { width: 150, quality: 60 }
                              )}
                              alt={item.product.product_name}
                              className="w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-500"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-base truncate pr-4">
                              {item.product.product_name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                              {item.product.description}
                            </p>
                            <div className="mt-2 flex items-center gap-3 text-sm">
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium text-xs">
                                Qty: {item.quantity}
                              </span>
                              <span className="font-bold text-gray-900">
                                ₹{item?.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* --- FOOTER (Payment & Total) --- */}
                    <div className="bg-gray-50/50 p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Payment Status
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div
                            className={`px-3 py-1 rounded-md text-xs font-bold border capitalize shadow-sm ${getPaymentBadgeColor(
                              order.payment_status
                            )}`}
                          >
                            {order.payment_status}
                          </div>
                          <span className="text-sm text-gray-500 flex items-center gap-1.5 capitalize font-medium">
                            <CreditCard size={14} className="text-gray-400" />{" "}
                            {order.payment_method}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Grand Total
                          </p>
                          <p className="text-xl font-black text-gray-900">
                            ₹{order.total_price}
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const uri = admin
                              ? `/${import.meta.env.VITE_ADMIN_POST_URI}/orders/details/${order.order_id}`
                              : `/orders/details/${order.order_id}`;
                            navigate(uri);
                          }}
                          className="group flex items-center gap-2 bg-black text-white pl-5 pr-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
                        >
                          View Details
                          <ChevronRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default Orders;