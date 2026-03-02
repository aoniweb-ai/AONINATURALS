import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import useAdminBear from "../store/admin.store";
import AdminHeader from "./Admin/components/AdminHeader";
import { Menu } from "lucide-react";
import ScrollToTop from "../components/ScrollToTop";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../utils/socket";

const Admin = () => {
  const { admin } = useAdminBear((state) => state);

  useEffect(() => {
    if (!admin) return;
    useAdminBear.getState().adminGetOrderCounts().catch(() => {});
  }, [admin]);

  useEffect(() => {
    if (!admin) return;

    const socket = connectSocket();
    socket.emit("adminJoin");

    socket.on("onlineUsers", (users) => {
      useAdminBear.setState({ onlineUsers: users });
    });

    socket.on("coupon:updated", (coupon) => {
      useAdminBear.setState((state) => ({
        coupons: state.coupons
          ? state.coupons.map((c) => (c._id === coupon._id ? coupon : c))
          : [],
      }));
    });

    socket.on("order:new", (order) => {
      toast(`New order received!\n#${order.order_id?.split("_")[1] || order.order_id}`, {
        icon: "📦",
        duration: 5000,
        style: { fontWeight: "bold" },
      });
      useAdminBear.setState((state) => {
        const counts = state.orderCounts
          ? { ...state.orderCounts }
          : { pending: 0, shipped: 0, delivered: 0, cancelled: 0, unseen: 0 };
        counts.pending = (counts.pending || 0) + 1;
        counts.unseen = (counts.unseen || 0) + 1;
        return { orderCounts: counts };
      });
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("coupon:updated");
      socket.off("order:new");
      disconnectSocket();
    };
  }, [admin]);
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <ScrollToTop/>
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {admin && <AdminHeader />}
      <div className="drawer-content flex flex-col min-h-screen">
        <div className="flex-none lg:hidden fixed w-10 h-10 bg-white/80 backdrop-blur-md rounded-lg cursor-pointer z-20 top-0 left-0">
          <label
            htmlFor="admin-drawer"
            className="btn btn-ghost btn-square h-full w-full"
          >
            <Menu />
          </label>
        </div>
        {<Outlet />}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Admin;
