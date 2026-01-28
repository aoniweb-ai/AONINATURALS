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
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useUserBear from "../../../store/user.store";


const CartIconWithBadge = ({ count, icon }) => {
  if (!count || count === 0) return icon;

  return (
    <div className="relative">
      {icon}
      <span className="absolute -top-2 -right-2 badge badge-xs badge-error">
        {count}
      </span>
    </div>
  );
};

const AccountNotifyIcon = ({ icon }) => (
  <div className="relative">
    {icon}
    <span className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full animate-pulse"></span>
  </div>
);


const UserHeader = () => {
  const { user, userLogout } = useUserBear((state) => state);
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [loader, setLoader] = useState(false)

  const routes = [
    {
      path: "/products",
      value: "Products",
      icon: <Package size={20} />,
      auth: true,
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
    // {
    //   path: "/settings",
    //   value: "Settings",
    //   icon: <Settings size={20} />,
    //   auth: true,
    // },
    {
      path: "/login",
      value: "Login",
      icon: <User size={20} />,
      auth: false,
    },
    {
      path: "/signup",
      value: "Signup",
      icon: <Users size={20} />,
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
            <h1 className="text-xl font-bold text-primary">
              Aoni Naturals
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-ghost btn-sm"
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
                key={'Home'}
                onClick={() => {
                  navigate("/");
                  closeDrawer();
                }}
                title={collapsed ? 'Home' : ""}
                className={`
                  btn btn-ghost justify-start gap-3
                  ${collapsed ? "px-3" : ""}
                  ${
                    location.pathname === '/'
                      ? "bg-black text-white"
                      : "hover:bg-base-200"
                  }
                `}
              >
                <LayoutDashboard size={20} />
                {!collapsed && <span> {'Home'}</span>}
              </button>
          {routes.map((val) => {
            // AUTH CHECK
            if (val.auth && !user) return null;
            if (val.auth === false && user) return null;

            return (
              <button
                key={val.value}
                onClick={() => {
                  navigate(val.path);
                  closeDrawer();
                }}
                title={collapsed ? val.value : ""}
                className={`
                  btn btn-ghost justify-start gap-3
                  ${collapsed ? "px-3" : ""}
                  ${
                    isActive(val.path)
                      ? "bg-black text-white"
                      : "hover:bg-base-200"
                  }
                `}
              >
                {val.value === "Cart" ? (
                  <CartIconWithBadge
                    count={user?.cart?.length}
                    icon={val.icon}
                  />
                ) : val.value === "Account" && user && (!user?.address?.address || !user?.address?.state  || !user?.address?.pincode) ? (
                  <AccountNotifyIcon icon={val.icon} />
                ) : (
                  val.icon
                )}

                {!collapsed && <span>{val.value}</span>}
              </button>
            );
          })}
        </nav>

        {/* LOGOUT */}
        {user && (
          <button disabled={loader}
            onClick={() => {
              setLoader(true)
              userLogout()
              .then(()=>{
                navigate('/')
              })
              .finally(()=>{
                setLoader(false)
                closeDrawer();
              })
            }}
            title={collapsed ? "Logout" : ""}
            className={` mt-auto gap-2 ${loader ? 'cursor-not-allowed bg-error text-error-content flex items-center py-3 justify-center rounded-3xl' : 'btn btn-error'} ${collapsed ? "px-3" : ""}`}
          >
            <LogOut size={18} />
            {!collapsed && "Logout"} {loader && <span className="loading loading-ring loading-sm"></span>}
          </button>
        )}
      </div>
    </aside>
  );
};

export default UserHeader;
