import { useEffect, useState, useRef, useCallback } from "react";
import Orders from "../../../components/Orders";
import useAdminBear from "../../../store/admin.store";
import OrdersSkeleton from "../../../components/OrderSkeleton";
import { Search, ShoppingBag, AlertCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { getSocket } from "../../../utils/socket";

const TABS = [
  { id: "pending", label: "Pending", color: "text-amber-600", bg: "bg-amber-500", badge: true },
  { id: "shipped", label: "Shipped", color: "text-blue-600", bg: "bg-blue-500", badge: true },
  { id: "delivered", label: "Delivered", color: "text-emerald-600", bg: "bg-emerald-500", badge: false },
  { id: "cancelled", label: "Cancelled", color: "text-rose-600", bg: "bg-rose-500", badge: false },
];

const AdminOrders = () => {
  const { adminGetOrders, adminGetOrderCounts, adminMarkOrdersSeen, orderCounts, adminSearchOrder } =
    useAdminBear((state) => state);

  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const observerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    adminGetOrderCounts().catch(() => {});
  }, [adminGetOrderCounts]);

  useEffect(() => {
    adminMarkOrdersSeen().catch(() => {});
  }, [adminMarkOrdersSeen]);

  const fetchOrders = useCallback(
    async (pageNum, reset = false) => {
      try {
        setLoading(true);
        const data = await adminGetOrders(activeTab, pageNum, 10);
        if (reset) {
          setOrders(data.orders);
        } else {
          setOrders((prev) => [...prev, ...data.orders]);
        }
        setHasMore(data.pagination.hasMore);
      } catch (err) {
        toast.error(err || "Failed to load orders");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [activeTab, adminGetOrders]
  );

  useEffect(() => {
    setPage(1);
    setInitialLoad(true);
    setOrders([]);
    setSearch("");
    setSearchInput("");
    setSearchResults(null);
    fetchOrders(1, true);
  }, [activeTab, fetchOrders]);

  const lastOrderRef = useCallback(
    (node) => {
      if (loading || search) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchOrders(nextPage);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, page, fetchOrders, search]
  );

  const handleSearchChange = (val) => {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setSearch("");
      setSearchResults(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearch(val);
      try {
        const data = await adminSearchOrder(val.trim());
        setSearchResults(data.orders || []);
      } catch {
        setSearchResults([]);
      }
    }, 400);
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewOrder = (order) => {
      if (order.status === activeTab) {
        setOrders((prev) => {
          if (prev.some((o) => o.order_id === order.order_id)) return prev;
          return [order, ...prev];
        });
      }
      useAdminBear.setState((state) => {
        const counts = state.orderCounts ? { ...state.orderCounts } : { pending: 0, shipped: 0, delivered: 0, cancelled: 0, unseen: 0 };
        counts.pending = (counts.pending || 0) + 1;
        counts.unseen = (counts.unseen || 0) + 1;
        return { orderCounts: counts };
      });
    };

    const handleStatusUpdated = ({ order }) => {
      setOrders((prev) => prev.filter((o) => o.order_id !== order.order_id));
      adminGetOrderCounts().catch(() => {});
    };

    socket.on("order:new", handleNewOrder);
    socket.on("order:statusUpdated", handleStatusUpdated);

    return () => {
      socket.off("order:new", handleNewOrder);
      socket.off("order:statusUpdated", handleStatusUpdated);
    };
  }, [activeTab, adminGetOrderCounts]);

  const displayOrders = searchResults !== null ? searchResults : orders;

  return (
    <Motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pb-20 font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <Motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-primary">
                <ShoppingBag size={28} />
              </div>
              Orders
            </h1>
            <p className="text-slate-500 font-medium mt-1 ml-1">
              {orderCounts && (
                <>
                  <span className="font-bold text-slate-900">{orderCounts.pending}</span> pending
                  {" · "}
                  <span className="font-bold text-slate-900">{orderCounts.shipped}</span> shipped
                </>
              )}
            </p>
          </Motion.div>
        </div>

        {/* --- TABS + SEARCH --- */}
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 rounded-4xl shadow-sm border border-slate-100 flex flex-col xl:flex-row gap-4 items-center justify-between mb-8 sticky top-4 z-30"
        >
          {/* TABS */}
          <div className="flex p-1.5 bg-slate-100/80 rounded-3xl w-full xl:w-auto overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 xl:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-colors capitalize flex items-center justify-center gap-2 z-10 ${
                  activeTab === tab.id
                    ? tab.color
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {activeTab === tab.id && (
                  <Motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${activeTab === tab.id ? "bg-current animate-pulse" : "bg-slate-300"}`}
                  />
                  {tab.label}
                  {tab.badge && orderCounts && orderCounts[tab.id] > 0 && (
                    <span className={`${tab.bg} text-white text-[10px] font-black min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center`}>
                      {orderCounts[tab.id]}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="flex items-center gap-4 w-full xl:w-auto px-2">
            <div className="relative w-full xl:w-96 group">
              <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
              />
              <input
                type="text"
                placeholder="Search by order ID..."
                className="w-full pl-12 pr-10 py-4 bg-slate-50/50 border border-transparent focus:bg-white focus:border-slate-200 focus:shadow-lg focus:shadow-slate-200/50 rounded-2xl font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setSearchResults(null);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </Motion.div>

        {/* --- CONTENT --- */}
        <div className="relative min-h-100">
          {/* Disclaimer for delivered/cancelled */}
          <AnimatePresence>
            {(activeTab === "cancelled" || activeTab === "delivered") && !search && (
              <Motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-end mb-4 overflow-hidden"
              >
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <AlertCircle size={12} /> Showing last 30 days
                </span>
              </Motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {initialLoad ? (
              <Motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <OrdersSkeleton />
              </Motion.div>
            ) : displayOrders.length === 0 ? (
              <Motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[3rem] py-24 px-10 text-center border-2 border-dashed border-slate-200 flex flex-col items-center justify-center"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-4xl flex items-center justify-center mb-6 shadow-inner">
                  <Search size={40} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">No Orders Found</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">
                  {search
                    ? <>No orders matching "<span className="text-slate-800">{search}</span>"</>
                    : <>No <span className="capitalize text-slate-800">{activeTab}</span> orders</>}
                </p>
                {search && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearch("");
                      setSearchResults(null);
                    }}
                    className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/20"
                  >
                    Clear Search
                  </button>
                )}
              </Motion.div>
            ) : (
              <Motion.div
                key={activeTab + search}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Orders orders={displayOrders} lastOrderRef={!search ? lastOrderRef : null} />
                {loading && !initialLoad && (
                  <div className="flex justify-center py-6">
                    <span className="loading loading-spinner loading-md text-slate-400" />
                  </div>
                )}
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Motion.section>
  );
};

export default AdminOrders;
