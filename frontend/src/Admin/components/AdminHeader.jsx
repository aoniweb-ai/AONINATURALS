import {
  Menu,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAdminBear from "../../../store/admin.store";

const AdminHeader = () => {
  const {adminLogout} =useAdminBear(state=>state);
    const navigate = useNavigate();
    const routes = [
        {
            path:"/admin/dashboard",
            value:"Dashboard",
            icon:<LayoutDashboard size={20} />
        },
        {
            path:"/admin/products",
            value:"Products",
            icon:<Package size={20} />
        },
        {
            path:"/admin/orders",
            value:"Orders",
            icon:<ShoppingCart size={20} />
        },
        {
            path:"/admin/customers",
            value:"Customers",
            icon:<Users size={20} />
        },
        {
            path:"/admin/analytics",
            value:"Analytics",
            icon:<BarChart3 size={20} />
        },
        {
            path:"/admin/settings",
            value:"Settings",
            icon:<Settings size={20} />
        },
        
    ]


  return (
      <aside className="drawer-side">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>

        <div className="w-64 min-h-screen bg-base-100 border-r border-base-300 flex flex-col p-5">
          <h1 className="text-2xl font-bold text-primary mb-8">
            Aoni Naturals
          </h1>

          <nav className="flex flex-col gap-2">
            {
                routes.map((val)=>(
                    <button key={val.value} onClick={()=>navigate(val.path)} className="btn btn-ghost justify-start gap-3">
                         {val.icon} {val.value}
                    </button> 
                ))
            }
          </nav>

          <button className="btn btn-error mt-auto gap-2" onClick={()=>{
            adminLogout();
            navigate("/")
          }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    
  );
};

export default AdminHeader;
