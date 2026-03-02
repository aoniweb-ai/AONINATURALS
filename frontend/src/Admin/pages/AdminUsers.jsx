import { useEffect, useState, useRef, useCallback } from "react";
import useAdminBear from "../../../store/admin.store";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Wifi,
  WifiOff,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Calendar,
  ChevronRight,
  UserCircle,
  Filter,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../../utils/formatDateTime";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
};

const AdminUsers = () => {
  const { adminGetUsers, onlineUsers } = useAdminBear((s) => s);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [total, setTotal] = useState(0);

  const observerRef = useRef(null);
  const debounceRef = useRef(null);

  const onlineEmailSet = new Set(
    onlineUsers?.filter((u) => u.email).map((u) => u.email) || []
  );

  const isUserOnline = (email) => onlineEmailSet.has(email);

  const fetchUsers = useCallback(
    async (pageNum, searchVal, reset = false) => {
      try {
        setLoading(true);
        const data = await adminGetUsers({
          page: pageNum,
          limit: 10,
          search: searchVal,
        });
        if (reset) {
          setUsers(data.users);
        } else {
          setUsers((prev) => [...prev, ...data.users]);
        }
        setHasMore(data.pagination.hasMore);
        setTotal(data.pagination.total);
      } catch (err) {
        toast.error(err || "Failed to load users");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [adminGetUsers]
  );

  useEffect(() => {
    setPage(1);
    fetchUsers(1, search, true);
  }, [search, fetchUsers]);

  const handleSearchChange = (val) => {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
    }, 400);
  };

  const lastUserRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchUsers(nextPage, search);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, page, search, fetchUsers]
  );

  const displayedUsers =
    filter === "online"
      ? users.filter((u) => isUserOnline(u.email))
      : users;

  const onlineCount = users.filter((u) => isUserOnline(u.email)).length;

  return (
    <section className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <Motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight"
          >
            Users
          </Motion.h1>
          <p className="text-gray-500 mt-1 font-medium">
            {total} registered user{total !== 1 ? "s" : ""} &middot;{" "}
            <span className="text-emerald-600">{onlineUsers?.length || 0} online now</span>
          </p>
        </div>

        {/* Search + Filter Bar */}
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/10 border border-gray-200 transition-all"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                filter === "all"
                  ? "bg-black text-white shadow-lg shadow-black/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Users size={16} />
              All
            </button>
            <button
              onClick={() => setFilter("online")}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                filter === "online"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Wifi size={16} />
              Online
              {onlineCount > 0 && (
                <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                  {onlineCount}
                </span>
              )}
            </button>
          </div>
        </Motion.div>

        {/* User Cards */}
        {initialLoad ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-40" />
                    <div className="h-3 bg-gray-100 rounded w-56" />
                  </div>
                  <div className="h-8 w-20 bg-gray-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedUsers.length === 0 ? (
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-12 text-center border border-gray-100"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No users found
            </h3>
            <p className="text-sm text-gray-500">
              {search
                ? "Try a different search term"
                : filter === "online"
                  ? "No users are online right now"
                  : "No registered users yet"}
            </p>
          </Motion.div>
        ) : (
          <Motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {displayedUsers.map((user, index) => {
              const online = isUserOnline(user.email);
              const isLast = index === displayedUsers.length - 1;
              return (
                <Motion.div
                  ref={filter === "all" && isLast ? lastUserRef : null}
                  key={user._id}
                  variants={itemVariants}
                  onClick={() =>
                    navigate(
                      `/${import.meta.env.VITE_ADMIN_POST_URI}/users/${user._id}`
                    )
                  }
                  className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-black text-lg uppercase">
                        <img src={user?.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                      </div>
                      {/* Online dot */}
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          online ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                          {user.fullname || "Unnamed"}
                        </h3>
                        {online && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full shrink-0">
                            Online
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail size={12} />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} />
                            {user.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 font-medium">
                          Orders
                        </p>
                        <p className="text-sm font-black text-gray-900">
                          {user.orderStats?.totalOrders || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 font-medium">
                          Spent
                        </p>
                        <p className="text-sm font-black text-gray-900">
                          ₹{Math.round(user.orderStats?.totalSpent || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight
                      size={20}
                      className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all shrink-0"
                    />
                  </div>

                  {/* Mobile stats */}
                  <div className="flex sm:hidden items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs">
                    <span className="flex items-center gap-1 text-gray-500">
                      <ShoppingBag size={12} />
                      {user.orderStats?.totalOrders || 0} orders
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <IndianRupee size={12} />
                      ₹{Math.round(user.orderStats?.totalSpent || 0)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 ml-auto">
                      <Calendar size={12} />
                      {formatDateTime(user.createdAt)}
                    </span>
                  </div>
                </Motion.div>
              );
            })}

            {/* Loading more indicator */}
            {loading && !initialLoad && (
              <div className="flex justify-center py-6">
                <span className="loading loading-spinner loading-md text-gray-400"></span>
              </div>
            )}

            {!hasMore && users.length > 0 && filter === "all" && (
              <p className="text-center text-sm text-gray-400 font-medium py-4">
                All {total} users loaded
              </p>
            )}
          </Motion.div>
        )}
      </div>
    </section>
  );
};

export default AdminUsers;
