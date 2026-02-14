import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./User/components/UserHeader";
import { Toaster } from "react-hot-toast";
import useUserBear from "../store/user.store";
import CenterLoader from "../components/CenterLoader";
import { Menu } from "lucide-react";
import ScrollToTop from "../components/ScrollToTop";
import { motion } from "framer-motion";
function App() {
  const [loader, setLoader] = useState(true);
  const { userGet, userGetProduct } = useUserBear((state) => state);
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
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <ScrollToTop />
      <input id="user-drawer" type="checkbox" className="drawer-toggle" />

      <UserHeader />
      <div className="drawer-content relative flex flex-col min-h-screen">
        {/* --- COOL ANIMATED TOGGLE BUTTON --- */}
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

        {/* --- CONTENT AREA WITH FADE IN --- */}
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
