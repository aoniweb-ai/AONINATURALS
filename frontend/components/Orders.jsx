import { Package, ChevronRight, Calendar, CreditCard, Box, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { getCloudinaryImage } from "../utils/getCloudinaryImage";
import useAdminBear from "../store/admin.store";
import toast from "react-hot-toast";
import { timeAgo } from "../utils/timeAgo";
import { useNavigate } from "react-router-dom";

// Helper for Status Icon/Color
const getStatusStyles = (status) => {
  switch (status) {
    case "delivered":
      return { color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: <CheckCircle size={16} /> };
    case "shipped":
      return { color: "text-blue-600 bg-blue-50 border-blue-200", icon: <Truck size={16} /> };
    case "pending":
      return { color: "text-amber-600 bg-amber-50 border-amber-200", icon: <Clock size={16} /> };
    case "cancelled":
      return { color: "text-red-600 bg-red-50 border-red-200", icon: <XCircle size={16} /> };
    default:
      return { color: "text-gray-600 bg-gray-50 border-gray-200", icon: <Package size={16} /> };
  }
};

const getPaymentBadgeColor = (status) => {
  switch (status) {
    case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
    case "cancelled": return "bg-red-100 text-red-700 border-red-200";
    case "paid": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const Orders = ({ orders = [] }) => {
  const { admin, adminUpdateOrderStatus } = useAdminBear((state) => state);
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
    <section className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order History</h1>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                Total Orders: {orders?.length}
            </span>
        </div>

        {orders?.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Package size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mt-2 max-w-sm">Looks like you haven't placed any orders yet. Start shopping to fill this page!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders?.map((order) => {
                const statusStyle = getStatusStyles(order.status);
                
                return (
              <div
                key={order.order_id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* --- HEADER --- */}
                <div className="bg-white p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-900">
                             Order #{order.order_id.slice(order.order_id.indexOf("_") + 1)}
                        </span>
                        {/* Mobile Status Badge (if not admin) */}
                        {!admin && (
                             <span className={`sm:hidden flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusStyle.color}`}>
                                {statusStyle.icon} {order.status}
                             </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{timeAgo(order?.createdAt)}</span>
                    </div>
                  </div>

                  {/* ADMIN CONTROLS or DESKTOP STATUS */}
                  <div className="flex items-center">
                    {admin ? (
                      <div className="relative">
                        <select
                          defaultValue={order.status}
                          className={`appearance-none cursor-pointer pl-4 pr-10 py-2 rounded-lg text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${statusStyle.color}`}
                          onChange={(e) => updateStatus(order.order_id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {/* Custom Arrow for select */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    ) : (
                      <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold uppercase tracking-wider ${statusStyle.color}`}>
                        {statusStyle.icon}
                        <span>{order.status}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* --- PRODUCTS LIST --- */}
                <div className="divide-y divide-gray-50">
                  {order?.product?.map((item, index) => (
                    <div key={index} className="p-5 flex gap-5 items-start sm:items-center hover:bg-gray-50/50 transition-colors">
                      {/* Product Image */}
                      <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 p-2">
                        <img
                          src={getCloudinaryImage(
                            item.product.product_images?.[0]?.secure_url,
                            { width: 150, quality: 60 }
                          )}
                          alt={item.product.product_name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base truncate pr-4">
                          {item.product.product_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {item.product.description}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                             <span className="font-medium text-gray-900">Qty: {item.quantity}</span>
                             <span className="text-gray-300">|</span>
                             <span className="font-medium text-gray-900">₹{item?.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* --- FOOTER (Payment & Total) --- */}
                <div className="bg-gray-50/50 p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Details</p>
                     <div className="flex items-center gap-3">
                        <div className={`px-2.5 py-0.5 rounded-md text-xs font-bold border capitalize ${getPaymentBadgeColor(order.payment_status)}`}>
                            {order.payment_status}
                        </div>
                        <span className="text-sm text-gray-600 flex items-center gap-1 capitalize">
                            <CreditCard size={14} className="text-gray-400"/> {order.payment_method}
                        </span>
                     </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                     <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                        <p className="text-xl font-black text-gray-900">₹{order.total_price}</p>
                     </div>
                     
                     {admin ? <button
                        onClick={() => navigate(`/${import.meta.env.VITE_ADMIN_POST_URI}/orders/details/${order.order_id}`)}
                        className="group flex items-center gap-2 bg-black text-white pl-5 pr-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-95"
                     >
                        Details
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                     </button> : <button
                        onClick={() => navigate(`/orders/details/${order.order_id}`)}
                        className="group flex items-center gap-2 bg-black text-white pl-5 pr-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 active:scale-95"
                     >
                        Details
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                     </button>}
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;