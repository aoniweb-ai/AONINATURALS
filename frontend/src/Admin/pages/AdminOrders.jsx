import { useEffect, useMemo, useState } from "react";
import Orders from "../../../components/Orders";
import useAdminBear from "../../../store/admin.store";
import OrdersSkeleton from "../../../components/OrderSkeleton";
import { Search, ShoppingBag, LayoutGrid, AlertCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: "pending", color: "text-amber-600", bg: "bg-amber-50" },
  { id: "shipped", color: "text-blue-600", bg: "bg-blue-50" },
  { id: "delivered", color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "cancelled", color: "text-rose-600", bg: "bg-rose-50" },
];

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
};

const AdminOrders = () => {
  const { orders, adminGetOrders } = useAdminBear((state) => state);
  const [activeTab, setActiveTab] = useState("pending");
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoader(true);
    adminGetOrders(activeTab.toLocaleLowerCase())
      .catch((err) => toast.error(err))
      .finally(() => setLoader(false));
  }, [adminGetOrders, activeTab]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const statusMatch = order.status === activeTab;
      const searchValue = search.toLowerCase();
      return (
        statusMatch &&
        (order.order_id?.toLowerCase().includes(searchValue) ||
          order.user?.fullname?.toLowerCase().includes(searchValue) ||
          order.user?.email?.toLowerCase().includes(searchValue))
      );
    });
  }, [orders, activeTab, search]);

  return (
    <motion.section 
      initial="hidden"
      animate="show"
      className="min-h-screen bg-[#F8FAFC] pb-20 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* --- HEADER --- */}
        <motion.div 
          variants={containerVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-primary">
                 <ShoppingBag size={28} />
              </div>
              Orders
            </h1>
            <p className="text-slate-500 font-medium mt-2 ml-1">
              Managing <span className="font-bold text-slate-900">{filteredOrders.length}</span> orders in {activeTab}
            </p>
          </motion.div>

          {/* QUICK STAT */}
          <motion.div 
            variants={itemVariants}
            className="hidden sm:flex gap-4"
          >
             <div className="bg-white p-4 px-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total View</p>
                  <p className="text-2xl font-black text-slate-900">{filteredOrders.length}</p>
                </div>
             </div>
          </motion.div>
        </motion.div>

        {/* --- CONTROLS: TABS + SEARCH --- */}
        <motion.div 
          variants={itemVariants}
          className="bg-white p-3 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col xl:flex-row gap-4 items-center justify-between mb-8 sticky top-4 z-30 backdrop-blur-xl bg-white/90 supports-[backdrop-filter]:bg-white/60"
        >
          
          {/* MAGIC TABS */}
          <div className="flex p-1.5 bg-slate-100/80 rounded-[1.5rem] w-full xl:w-auto overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 xl:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-colors capitalize flex items-center justify-center gap-2 z-10 ${
                  activeTab === tab.id ? tab.color : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-2`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTab === tab.id ? 'bg-current animate-pulse' : 'bg-slate-300'}`}></span>
                    {tab.id}
                </span>
              </button>
            ))}
          </div>

          {/* SEARCH BAR */}
          <div className="flex items-center gap-4 w-full xl:w-auto px-2">
            <motion.div 
                className="relative w-full xl:w-96 group"
                initial={false}
                animate={search ? { scale: 1.02 } : { scale: 1 }}
            >
                <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                />
                <input
                type="text"
                placeholder="Search by ID, Name or Email..."
                className="w-full pl-12 pr-10 py-4 bg-slate-50/50 border border-transparent focus:bg-white focus:border-slate-200 focus:shadow-lg focus:shadow-slate-200/50 rounded-2xl font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button 
                        onClick={() => setSearch("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </motion.div>
          </div>
        </motion.div>


        {/* --- CONTENT AREA --- */}
        <div className="relative min-h-[400px]">
            {/* Disclaimer for history */}
            <AnimatePresence>
                {(activeTab === "cancelled" || activeTab === "delivered") && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-end mb-4 overflow-hidden"
                    >
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
                            <AlertCircle size={12} /> Showing last 30 days
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {(!orders || loader) ? (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <OrdersSkeleton />
                    </motion.div>
                ) : filteredOrders.length === 0 ? (
                    <motion.div 
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-[3rem] py-24 px-10 text-center border-2 border-dashed border-slate-200 flex flex-col items-center justify-center"
                    >
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                            <Search size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">No Orders Found</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">
                            We couldn't find any orders matching "<span className="text-slate-800">{search}</span>" in the <span className="capitalize text-slate-800">{activeTab}</span> tab.
                        </p>
                        <button 
                            onClick={() => {setSearch(""); setActiveTab("pending")}}
                            className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/20"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeTab + search} // Trigger animation on tab or search change
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Orders orders={filteredOrders} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default AdminOrders;