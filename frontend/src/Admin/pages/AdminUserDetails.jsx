import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAdminBear from "../../../store/admin.store";
import { motion as Motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Calendar,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Wifi,
  UserCircle,
  ShieldCheck,
  ChevronRight,
  Ticket,
} from "lucide-react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  pending: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: Clock },
  shipped: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: Truck },
  delivered: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle2 },
  cancelled: { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", icon: XCircle },
};

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminGetUserDetails, onlineUsers } = useAdminBear((s) => s);

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOnline = onlineUsers?.some((u) => u.email === user?.email);

  useEffect(() => {
    adminGetUserDetails(id)
      .then((data) => {
        setUser(data.user);
        setOrders(data.orders);
        setStats(data.stats);
      })
      .catch((err) => toast.error(err || "Failed to load user"))
      .finally(() => setLoading(false));
  }, [id, adminGetUserDetails]);

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-6">
          <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="bg-white rounded-2xl p-8 animate-pulse space-y-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-56 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                  <div className="h-3 w-32 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserCircle size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">User not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-bold text-gray-500 hover:text-black"
          >
            Go back
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Back */}
        <Motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/${import.meta.env.VITE_ADMIN_POST_URI}/users`)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Users
        </Motion.button>

        {/* User Card */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-black text-2xl uppercase">
                <img src={user?.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
              </div>
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-[3px] border-white ${
                  isOnline ? "bg-emerald-500" : "bg-gray-300"
                }`}
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  {user.fullname || "Unnamed User"}
                </h1>
                {isOnline && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Wifi size={10} /> Online
                  </span>
                )}
                {user.verified && (
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={10} /> Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} /> {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} /> {user.phone}
                  </span>
                )}
                {user.address?.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {user.address.address}
                    {user.address.state ? `, ${user.address.state}` : ""}
                    {user.address.pincode ? ` - ${user.address.pincode}` : ""}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                <Calendar size={12} className="inline mr-1" />
                Joined {formatDateTime(user.createdAt)}
              </p>
            </div>
          </div>
        </Motion.div>

        {/* Stats Cards */}
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
        >
          {[
            { label: "Total Orders", value: stats?.totalOrders, icon: ShoppingBag, color: "text-gray-900" },
            { label: "Total Spent", value: `₹${Math.round(stats?.totalSpent || 0)}`, icon: IndianRupee, color: "text-gray-900" },
            { label: "Delivered", value: stats?.delivered, icon: CheckCircle2, color: "text-emerald-600" },
            { label: "Pending", value: stats?.pending, icon: Clock, color: "text-amber-600" },
            { label: "Shipped", value: stats?.shipped, icon: Truck, color: "text-blue-600" },
            { label: "Cancelled", value: stats?.cancelled, icon: XCircle, color: "text-rose-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center"
            >
              <stat.icon size={18} className={`${stat.color} mx-auto mb-2`} />
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </Motion.div>

        {/* Order History */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <Package size={20} />
            Order History
            <span className="text-sm font-medium text-gray-400">
              ({orders.length})
            </span>
          </h2>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <ShoppingBag size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">
                This user hasn't placed any orders yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const StatusIcon = statusCfg.icon;
                return (
                  <Motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() =>
                      navigate(
                        `/${import.meta.env.VITE_ADMIN_POST_URI}/orders/details/${order.order_id}`
                      )
                    }
                    className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Product images */}
                      <div className="flex -space-x-3 shrink-0">
                        {order.product?.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 bg-gray-100 rounded-xl border-2 border-white overflow-hidden"
                          >
                            <img
                              src={getCloudinaryImage(
                                item.product?.product_images?.[0]?.secure_url,
                                { width: 100, quality: 50 }
                              )}
                              alt=""
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                        ))}
                        {order.product?.length > 3 && (
                          <div className="w-12 h-12 bg-gray-200 rounded-xl border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                            +{order.product.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Order info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-gray-900 font-mono">
                            #{order.order_id?.slice(-8)?.toUpperCase()}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border} border`}
                          >
                            <StatusIcon size={10} className="inline mr-0.5" />
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                          <span>
                            {order.product?.length} item{order.product?.length !== 1 ? "s" : ""}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-gray-900">
                            ₹{Math.round(order.total_price)}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{order.payment_method}</span>
                          {order.coupon_code && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5 text-purple-600">
                                <Ticket size={10} />
                                {order.coupon_code} (-₹{order.coupon_discount})
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span>{formatDateTime(order.createdAt)}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        size={20}
                        className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all shrink-0 hidden sm:block"
                      />
                    </div>
                  </Motion.div>
                );
              })}
            </div>
          )}
        </Motion.div>
      </div>
    </section>
  );
};

export default AdminUserDetails;
