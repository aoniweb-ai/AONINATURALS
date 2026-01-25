import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAdminBear from "../../../store/admin.store";
import { useState } from "react";

const AdminHeader = () => {
  const { adminLogout } = useAdminBear((state) => state);

  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const routes = [
    {
      path: "/admin/dashboard",
      value: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/admin/products",
      value: "Products",
      icon: <Package size={20} />,
    },
    {
      path: "/admin/orders",
      value: "Orders",
      icon: <ShoppingCart size={20} />,
    },
    {
      path: "/admin/customers",
      value: "Customers",
      icon: <Users size={20} />,
    },
    {
      path: "/admin/analytics",
      value: "Analytics",
      icon: <BarChart3 size={20} />,
    },
    {
      path: "/admin/settings",
      value: "Settings",
      icon: <Settings size={20} />,
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
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200"
                }
              `}
                  >
                    {val.icon}
                    {!collapsed && <span>{val.value}</span>}
                  </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => {
            adminLogout();
            navigate("/");
            closeDrawer();
          }}
          title={collapsed ? "Logout" : ""}
          className={`btn btn-error mt-auto gap-2 ${collapsed ? "px-3" : ""}`}
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default AdminHeader;
