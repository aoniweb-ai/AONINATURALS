import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useUserBear from "../../../store/user.store";

const UserHeader = () => {
  const { user, userLogout } = useUserBear((state) => state);

  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const routes = [
    { path: "/", value: "Home", icon: <LayoutDashboard size={20} /> },
    {
      path: "/products",
      value: "Products",
      icon: <Package size={20} />,
      auth: true,
    },
    {
      path: "/orders",
      value: "Orders",
      icon: <ShoppingBag  id="cart-icon" size={20} />,
      auth: true,
    },
    {
      path: "/cart",
      value: "Cart",
      icon: <ShoppingCart id="cart-icon" size={20} />,
      auth: true,
    },
    {
      path: "/account",
      value: "Account",
      icon: <Users size={20} />,
      auth: true,
    },
    {
      path: "/settings",
      value: "Settings",
      icon: <Settings size={20} />,
      auth: true,
    },
    {
      path: "/login",
      value: "Login",
      icon: <Settings size={20} />,
      auth: false,
    },
    {
      path: "/signup",
      value: "Signup",
      icon: <Settings size={20} />,
      auth: false,
    },
  ];

  const isActive = (path) => location.pathname.includes(path);

  // mobile drawer close
  const closeDrawer = () => {
    const drawer = document.getElementById("user-drawer");
    if (drawer) drawer.checked = false;
  };

  return (
    <aside className="drawer-side z-30">
      <label htmlFor="user-drawer" className="drawer-overlay"></label>

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
          <button
            key={routes[0].value}
            onClick={() => {
              navigate(routes[0].path);
              closeDrawer();
            }}
            title={collapsed ? routes[0].value : ""}
            className={`
                btn btn-ghost justify-start gap-3 relative
                ${collapsed ? "px-3" : ""}
                ${
                  location.pathname === routes[0].path
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200"
                }
              `}
          >
            {routes[0].icon}
            {!collapsed && <span>{routes[0].value}</span>}
          </button>
          {routes.map((val) =>
            user
              ? val.auth && (
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
                  isActive(val.path)
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200"
                }
              `}
                  >
                    {val.icon}
                    {!collapsed && <span>{val.value}</span>}
                  </button>
                )
              : val.auth === false && (
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
                  isActive(val.path)
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200"
                }
              `}
                  >
                    {val.icon}
                    {!collapsed && <span>{val.value}</span>}
                  </button>
                ),
          )}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => {
            userLogout();
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

export default UserHeader;