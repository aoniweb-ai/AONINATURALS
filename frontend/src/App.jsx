import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./User/components/UserHeader";
import { Toaster } from "react-hot-toast";
import useUserBear from "../store/user.store";
import CenterLoader from "../components/CenterLoader";
import { Menu, MessageCircle } from "lucide-react"; // MessageCircle icon imported
import ScrollToTop from "../components/ScrollToTop";
import { motion } from "framer-motion";

function App() {
  const [loader, setLoader] = useState(true);
  const { userGet, userGetProduct } = useUserBear((state) => state);


  const WHATSAPP_NUMBER =  import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210"; // Default number if env variable is not set
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