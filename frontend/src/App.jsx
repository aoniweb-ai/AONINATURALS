import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./User/components/UserHeader";
import  { Toaster } from "react-hot-toast";
import useUserBear from "../store/user.store";
import CenterLoader from "../components/CenterLoader";
import { Menu } from "lucide-react";
import ScrollToTop from "../components/ScrollToTop";
function App() {
  const [loader, setLoader] = useState(true);
  const { userGet, userGetProduct } = useUserBear((state) => state);
  useEffect(() => {
    async function run() {
      try {
        setLoader(true);
        await userGetProduct();
        await userGet();
      }finally {
        setLoader(false);
      }
    }
    run();
  },[userGet,userGetProduct]);
  return (
      !loader ? (
        <div className="drawer lg:drawer-open min-h-screen bg-base-200">
          <ScrollToTop/>
          <input id="user-drawer" type="checkbox" className="drawer-toggle" />

          <UserHeader />
          <div className="drawer-content relative flex flex-col min-h-screen">
            <div className="flex-none lg:hidden fixed w-10 h-10 bg-white/80 backdrop-blur-md rounded-lg cursor-pointer z-20 top-0 left-0">
              <label
                htmlFor="user-drawer"
                className="btn btn-ghost btn-square h-full w-full"
              >
                <Menu />
              </label>
            </div>
            <Outlet />
          </div>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      ) : (
        <CenterLoader />
      )
    
  );
}

export default App;
