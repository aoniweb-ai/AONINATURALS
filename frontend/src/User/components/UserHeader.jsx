import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ShoppingBag,
  User,
  UserPen,
  Menu,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useUserBear from "../../../store/user.store";
import { motion, AnimatePresence } from "framer-motion";

const CartIconWithBadge = ({ count, icon }) => (
  <div className="relative">
    {icon}
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key="cart-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  </div>
);

const AccountNotifyIcon = ({ icon }) => (
  <div className="relative">
    {icon}
    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span>
    </span>
  </div>
);

const SidebarItem = ({
  icon,
  label,
  isActive,
  collapsed,
  onClick,
  badge = null,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-200 z-10 w-full overflow-hidden isolate
        ${isActive ? "text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}
      `}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-black"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ zIndex: -1 }}
        />
      )}

      <span className="relative z-10">{icon}</span>

      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="whitespace-nowrap overflow-hidden relative z-10"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {badge}
    </button>
  );
};

const UserHeader = () => {
  const { user, userLogout } = useUserBear((state) => state);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [loader, setLoader] = useState(false);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.includes(path)) return true;
    return false;
  };

  const closeDrawer = () => {
    const drawer = document.getElementById("user-drawer");
    if (drawer) drawer.checked = false;
  };

  const routes = [
    {
      path: "/",
      value: "Home",
      icon: <LayoutDashboard size={20} />,
      auth: null,
    },
    {
      path: "/products",
      value: "Products",
      icon: <Package size={20} />,
      auth: !user ? false : true,
    },
    {
      path: "/orders",
      value: "Orders",
      icon: <ShoppingBag size={20} />,
      auth: true,
    },
    {
      path: "/cart",
      value: "Cart",
      icon: <ShoppingCart size={20} />,
      auth: true,
    },
    {
      path: "/account",
      value: "Account",
      icon: <UserPen size={20} />,
      auth: true,
    },
    { path: "/login", value: "Login", icon: <User size={20} />, auth: false },
    {
      path: "/signup",
      value: "Signup",
      icon: <Users size={20} />,
      auth: false,
    },
  ];

  return (
    <aside className="drawer-side z-50">
      <label htmlFor="user-drawer" className="drawer-overlay"></label>

      <motion.div
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-screen sticky top-0 bg-white/95 backdrop-blur-xl border-r border-gray-100 flex flex-col p-4 shadow-2xl shadow-gray-200/50 overflow-hidden"
      >
        {/* --- TOP HEADER --- */}
        <div className="flex items-center justify-between mb-8 px-1">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                  Aoni
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ChevronLeft size={20} />
            </motion.div>
          </button>
        </div>

        {/* --- NAVIGATION --- */}
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {routes.map((route) => {
            if (route.auth === true && !user) return null;
            if (route.auth === false && user) return null;

            let displayIcon = route.icon;
            if (route.value === "Cart") {
              displayIcon = (
                <CartIconWithBadge
                  count={user?.cart?.length}
                  icon={route.icon}
                />
              );
            } else if (
              route.value === "Account" &&
              user &&
              (!user?.address?.address ||
                !user?.address?.state ||
                !user?.address?.pincode)
            ) {
              displayIcon = <AccountNotifyIcon icon={route.icon} />;
            }

            return (
              <SidebarItem
                key={route.path}
                label={route.value}
                icon={displayIcon}
                isActive={isActive(route.path)}
                collapsed={collapsed}
                onClick={() => {
                  navigate(route.path);
                  closeDrawer();
                }}
              />
            );
          })}
        </nav>

        {/* --- LOGOUT SECTION --- */}
        {user && (
          <div className="mt-auto border-t border-gray-100 pt-4">
            <motion.button
              layout
              disabled={loader}
              onClick={() => {
                setLoader(true);
                userLogout()
                  .then(() => navigate("/"))
                  .finally(() => {
                    setLoader(false);
                    closeDrawer();
                  });
              }}
              className={`w-full relative flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 overflow-hidden group
                ${loader ? "bg-red-50 text-red-500 cursor-not-allowed" : "hover:bg-red-50 text-gray-500 hover:text-red-600"}
              `}
            >
              {loader && (
                <motion.div
                  layoutId="loader-bg"
                  className="absolute inset-0 bg-red-100"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5 }}
                />
              )}

              <span className="relative z-10">
                {loader ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <LogOut size={20} />
                )}
              </span>

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap relative z-10"
                  >
                    {loader ? "Signing out..." : "Logout"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        )}
      </motion.div>
    </aside>
  );
};

export default UserHeader;
