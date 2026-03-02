import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserHeader from "./User/components/UserHeader";
import { Toaster } from "react-hot-toast";
import useUserBear from "../store/user.store";
import CenterLoader from "../components/CenterLoader";
import { Menu, MessageCircle } from "lucide-react";
import ScrollToTop from "../components/ScrollToTop";
import { motion } from "framer-motion";
import { connectSocket, disconnectSocket, getDeviceInfo } from "../utils/socket";

function App() {
  const [loader, setLoader] = useState(true);
  const { userGet, userGetProduct, user } = useUserBear((state) => state);
  const location = useLocation();

  const WHATSAPP_NUMBER =  import.meta.env.VITE_WHATSAPP_NUMBER;
  const PREFILLED_MSG = "Hi, I need help regarding your products.";

  useEffect(() => {
    async function run() {
      try {
        setLoader(true);
        await userGetProduct();
        await userGet();
      } finally {
        setLoader(false);
      }
    }
    run();
  }, [userGet, userGetProduct]);

  useEffect(() => {
    if (loader) return;

    const socket = connectSocket();

    socket.emit("register", {
      fullname: user?.fullname || "Guest",
      email: user?.email || null,
      phone: user?.phone || null,
      currentPage: location.pathname,
      device: getDeviceInfo(),
    });

    socket.on("product:created", (product) => {
      useUserBear.setState((state) => ({
        products: state.products ? [...state.products, product] : [product],
      }));
    });

    socket.on("product:updated", (product) => {
      useUserBear.setState((state) => {
        if (!state.products) return {};
        const updated = state.products.map((p) =>
          p._id === product._id ? product : p,
        );
        const newState = { products: updated };
        if (state.product && state.product._id === product._id) {
          newState.product = product;
        }
        // Also update the product inside user's cart
        if (state.user?.cart?.length > 0) {
          const updatedCart = state.user.cart.map((item) =>
            item.product?._id === product._id
              ? { ...item, product }
              : item,
          );
          newState.user = { ...state.user, cart: updatedCart };
        }
        return newState;
      });
    });

    socket.on("blog:created", (blog) => {
      useUserBear.setState((state) => ({
        blogs: state.blogs ? [blog, ...state.blogs] : [blog],
      }));
    });

    socket.on("blog:updated", (blog) => {
      useUserBear.setState((state) => {
        if (!state.blogs) return {};
        const updated = state.blogs.map((b) =>
          b._id === blog._id ? blog : b,
        );
        const newState = { blogs: updated };
        if (state.blog && state.blog._id === blog._id) {
          newState.blog = blog;
        }
        return newState;
      });
    });

    socket.on("blog:deleted", (blogId) => {
      useUserBear.setState((state) => ({
        blogs: state.blogs ? state.blogs.filter((b) => b._id !== blogId) : [],
      }));
    });

    socket.on("coupon:created", (coupon) => {
      useUserBear.setState((state) => ({
        coupons: state.coupons ? [...state.coupons, coupon] : [coupon],
      }));
    });

    socket.on("coupon:updated", (coupon) => {
      useUserBear.setState((state) => ({
        coupons: state.coupons
          ? state.coupons.map((c) => (c._id === coupon._id ? coupon : c))
          : [],
      }));
    });

    socket.on("coupon:deleted", (couponId) => {
      useUserBear.setState((state) => ({
        coupons: state.coupons
          ? state.coupons.filter((c) => c._id !== couponId)
          : [],
      }));
    });

    return () => {
      socket.off("product:created");
      socket.off("product:updated");
      socket.off("blog:created");
      socket.off("blog:updated");
      socket.off("blog:deleted");
      socket.off("coupon:created");
      socket.off("coupon:updated");
      socket.off("coupon:deleted");
      disconnectSocket();
    };
  }, [loader, user]);

  useEffect(() => {
    if (loader) return;
    const socket = connectSocket();
    socket.emit("pageChange", location.pathname);
  }, [location.pathname, loader]);

  return !loader ? (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200 selection:bg-green-500/30">
      <ScrollToTop />
      <input id="user-drawer" type="checkbox" className="drawer-toggle" />

      <UserHeader />
      <div className="drawer-content relative flex flex-col min-h-screen">
        
        <div className="flex-none lg:hidden fixed top-4 left-4 z-30">
          <motion.label
            htmlFor="user-drawer"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: 90, backgroundColor: "#ffffff" }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer text-gray-800 hover:text-black transition-colors"
          >
            <Menu size={22} strokeWidth={2.5} />
          </motion.label>
        </div>

        <div className="fixed bottom-8 right-6 z-50">
          <motion.a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILLED_MSG)}`}
            target="_blank"
            rel="noopener noreferrer"
            
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            
            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_0_20px_-5px_rgba(37,211,102,0.6)] cursor-pointer border border-white/20 relative group"
          >
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10"></span>
            
            <MessageCircle size={28} strokeWidth={2.5} fill="white" className="text-white" />
            
            <span className="absolute right-full mr-3 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with us
            </span>
          </motion.a>
        </div>

        {/* --- CONTENT AREA --- */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="flex-1 w-full"
        >
          <Outlet />
        </motion.main>
      </div>
      <Toaster position="top-center"  reverseOrder={false}  />
    </div>
  ) : (
    <CenterLoader />
  );
}

export default App;