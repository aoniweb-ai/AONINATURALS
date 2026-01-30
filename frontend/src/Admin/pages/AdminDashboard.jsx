import React, { useEffect, useRef, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  MoreVertical,
  Search,
  Landmark,
} from "lucide-react";
import useAdminBear from "../../../store/admin.store";
import AddUpdateProduct from "../components/AddUpdateProduct";
import { formatDateTime } from "../../../utils/formatDateTime";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CenterLoader from "../../../components/CenterLoader";
import { motion, useSpring, useTransform, animate } from "framer-motion";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger effect for children
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 12 },
  },
};

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({ value, prefix = "" }) => {
  const count = useSpring(0, { duration: 2000 });
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value || 0, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    return unsubscribe;
  }, [rounded]);

  return <>{prefix}{displayValue.toLocaleString()}</>;
};

const statusColor = (status) => {
  switch (status) {
    case "pending": return "bg-yellow-50 text-yellow-500";
    case "shipped": return "bg-blue-50 text-blue-600";
    case "delivered": return "bg-emerald-50 text-emerald-600";
    case "cancelled": return "bg-red-50 text-red-600";
    default: return "badge-ghost";
  }
};

const AdminDashboard = () => {
  const { admin, adminGetRevenue, adminSearchOrder, products } = useAdminBear((state) => state);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loader, setLoader] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    setLoader(true);
    adminGetRevenue()
      .then((res) => {
        setTotalRevenue(res?.totalRevenue || 0);
        setDeliveredOrders(res?.totalDeliveredOrders || 0);
        setRecentOrders(res?.recentOrders);
        setTotalCustomers(res?.totalCustomers || 0);
      })
      .catch((err) => {
        toast.error(err);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [adminGetRevenue]);

  const SearchOrder = async () => {
    try {
      if (!searchRef?.current?.value.trim()) {
        return toast.error("Invalid input");
      }
      setSearchLoader(true);
      const data = await adminSearchOrder(searchRef?.current?.value.trim());
      setRecentOrders(data?.orders);
    } catch (error) {
      toast.error(error);
    } finally {
      setSearchLoader(false);
    }
  };

  if (loader) return <CenterLoader />;

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      {/* --- NAVBAR (Slide Down) --- */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="navbar bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-4 lg:px-8"
      >
        <div className="flex-1">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Admin Console</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Aoni Naturals • Dashboard
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="hidden md:flex relative group">
            {searchLoader ? (
              <span className="loading loading-spinner loading-sm absolute left-3 top-1/2 -translate-y-1/2"></span>
            ) : (
              <Search
                onClick={() => !searchLoader && SearchOrder()}
                className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                size={16}
              />
            )}
            <motion.input
              type="text"
              ref={searchRef}
              whileFocus={{ scale: 1.02, width: "300px" }}
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all w-64 focus:bg-white"
            />
          </div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="avatar avatar-placeholder cursor-pointer"
          >
            <div className="bg-black text-white rounded-xl w-10 shadow-lg shadow-black/20">
              <span className="text-xs font-bold">{admin?.username[0].toUpperCase()}</span>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* --- MAIN CONTENT (Staggered Load) --- */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8"
      >
        {/* WELCOME HEADER */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good Morning, {admin?.username.toUpperCase()} 👋
            </h1>
            <p className="text-gray-500 text-sm">Here's what's happening with your store today.</p>
          </div>
          <div className="flex gap-2">
            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              htmlFor="add_update_modal"
              className="btn btn-sm bg-black text-white hover:bg-gray-800 rounded-lg capitalize shadow-lg shadow-black/10 border-none cursor-pointer"
            >
              + Add Product
            </motion.label>
          </div>
        </motion.div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
            className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm transition-all cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <Landmark size={12} />
              </span>
            </div>
            <p className="text-sm font-medium text-gray-400">Total Revenue</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
               <AnimatedCounter value={totalRevenue} prefix="₹" />
            </h3>
          </motion.div>

          {/* Delivered Orders Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
            className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm transition-all cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <ShoppingBag size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                +5 new
              </span>
            </div>
            <p className="text-sm font-medium text-gray-400">Delivered Orders</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              <AnimatedCounter value={deliveredOrders} />
            </h3>
          </motion.div>

          {/* Customers Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
            className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm transition-all cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <Users size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                Total
              </span>
            </div>
            <p className="text-sm font-medium text-gray-400">Active Customers</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              <AnimatedCounter value={totalCustomers} />
            </h3>
          </motion.div>

          {/* Products Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
            className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm transition-all cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                <Package size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-400">Total Products</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              <AnimatedCounter value={products?.length || 0} />
            </h3>
          </motion.div>
        </div>

        {/* --- RECENT ORDERS TABLE --- */}
        <motion.div variants={itemVariants} className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-400">Manage and track your latest transactions</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-2 px-6">
              <thead>
                <tr className="text-gray-400 border-none uppercase text-[10px] tracking-widest font-bold">
                  <th className="bg-transparent">Order ID</th>
                  <th className="bg-transparent">Customer</th>
                  <th className="bg-transparent">Date</th>
                  <th className="bg-transparent">Status</th>
                  <th className="bg-transparent text-right">Amount</th>
                  <th className="bg-transparent"></th>
                </tr>
              </thead>
              <motion.tbody 
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                className="text-sm"
              >
                {recentOrders?.map((item) => (
                  <motion.tr
                    key={item?.order_id}
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                    }}
                    onClick={() => navigate(`/${import.meta.env.VITE_ADMIN_POST_URI}/orders/details/${item.order_id}`)}
                    className="hover:bg-gray-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="font-bold text-gray-900 py-4 border-none rounded-l-xl">
                      #{item.order_id}
                    </td>
                    <td className="border-none">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                          {item.user.fullname[0].toUpperCase()}
                        </div>
                        <span className="font-medium capitalize">{item.user.fullname}</span>
                      </div>
                    </td>
                    <td className="text-gray-500 border-none font-medium">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="border-none">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor(item.status)}`}>
                        {item?.status}
                      </span>
                    </td>
                    <td className="text-right font-black text-gray-900 border-none">
                      ₹{item.total_price}
                    </td>
                    <td className="text-right border-none rounded-r-xl">
                      <button className="p-2 hover:bg-white rounded-lg transition-all group-hover:shadow-sm">
                        <MoreVertical size={16} className="text-gray-400" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
          
          <p className="text-center p-4 text-gray-400">{recentOrders?.length <= 0 && "No orders here"}</p>
          
          <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
            <motion.button
              whileHover={{ scale: 1.02, color: "#000" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/${import.meta.env.VITE_ADMIN_POST_URI}/orders`)}
              className="text-xs font-bold text-gray-400 transition-colors"
            >
              View All Transactions
            </motion.button>
          </div>
        </motion.div>
      </motion.main>
      <AddUpdateProduct />
    </div>
  );
};

export default AdminDashboard;