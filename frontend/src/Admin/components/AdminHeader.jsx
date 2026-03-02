import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  FileText,
  Ticket,
  Star,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAdminBear from "../../../store/admin.store";
import { useState } from "react";

const AdminHeader = () => {
  const { adminLogout, orderCounts } = useAdminBear((state) => state);

  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutLoader, setLogoutLoader] = useState(false)
  const routes = [
    {
      path: `/${import.meta.env.VITE_ADMIN_POST_URI}/dashboard`,
      value: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: `/${import.meta.env.VITE_ADMIN_POST_URI}/products`,
      value: "Products",
      icon: <Package size={20} />,
    },
    {
      path: `/${import.meta.env.VITE_ADMIN_POST_URI}/orders`,
      value: "Orders",
      icon: <ShoppingCart size={20} />,
    },
    {
      path: `/${import.meta.env.VITE_ADMIN_POST_URI}/blogs`,
      value: "Blogs",
      icon: <FileText size={20} />,
    },
    {
      path: `/${import.meta.env.VITE_ADMIN_POST_URI}/users`,
      value: "Users",
      icon: <Users size={20} />,
    },
    {
      path: `/${import.meta.env.VITE_ADMIN_POST_URI}/coupons`,
      value: "Coupons",
      icon: <Ticket size={20} />,
    },
    {
      path: `/${import.meta.env.VITE_ADMIN_POST_URI}/reviews`,
      value: "Reviews",
      icon: <Star size={20} />,
    },
  ];

  const closeDrawer = () => {
    const drawer = document.getElementById("admin-drawer");
    if (drawer) drawer.checked = false;
  };

  return (
    <aside className="drawer-side z-30">
      <label htmlFor="admin-drawer" className="drawer-overlay"></label>

      <div
        className={`min-h-screen bg-base-100 border-r border-base-300 flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"} p-4`}
      >
        {/* TOP */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <h1 className="text-xl font-bold text-primary">Aoni Naturals</h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-ghost btn-sm transition-transform"
          >
            <ChevronLeft
              size={20}
              className={`${collapsed ? "rotate-180" : ""} transition-transform`}
            />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-1">
          {routes.map((val) =>(
            <button
                    key={val.value}
                    onClick={() => {
                      navigate(val.path);
                      closeDrawer();
                    }}
                    title={collapsed ? val.value : ""}
                    className={`
                btn btn-ghost justify-start gap-3 relative
                ${collapsed ? "px-3" : ""}
                ${
                  location.pathname.includes(val.path)
                    ? "bg-black text-white"
                    : "hover:bg-base-200"
                }
              `}
                  >
                    {val.icon}
                    {!collapsed && <span>{val.value}</span>}
                    {val.value === "Orders" && orderCounts?.unseen > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black min-w-5 h-5 px-1 rounded-full flex items-center justify-center animate-pulse">
                        {orderCounts.unseen}
                      </span>
                    )}
                  </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => {
            setLogoutLoader(true);
            adminLogout()
            .then(()=>{
              navigate("/");
            })
            .finally(()=>{
              closeDrawer();
              setLogoutLoader(false)
            })
          }}
          title={collapsed ? "Logout" : ""}
          disabled={logoutLoader}
          className={`btn btn-error mt-auto gap-2 ${collapsed ? "px-3" : ""}`}
        >
          <LogOut size={18} />
          {!collapsed && "Logout"} {logoutLoader && <span className="loading loading-spinner loading-sm"></span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminHeader;
