import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAdminBear from "../store/admin.store";
import AdminHeader from "./Admin/components/AdminHeader";
import { Menu } from "lucide-react";
const Admin = () => {
  const { admin } = useAdminBear((state) => state);
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
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
        <Outlet />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Admin;
