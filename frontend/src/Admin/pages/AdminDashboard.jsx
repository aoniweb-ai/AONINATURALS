import React, { useEffect, useRef, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  MoreVertical,
  Search,
  Filter,
  Download,
  Landmark,
} from "lucide-react";
import useAdminBear from "../../../store/admin.store";
import AddUpdateProduct from "../components/AddUpdateProduct";
import { formatDateTime } from "../../../utils/formatDateTime";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CenterLoader from "../../../components/CenterLoader";


const statusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-orange-50 text-orange-500";
    case "shipped":
      return "bg-yellow-50 text-yellow-600";
    case "delivered":
      return "bg-emerald-50 text-emerald-600";
    case "cancelled":
      return "bg-red-50 text-red-600";
    default:
      return "badge-ghost";
  }
};

const AdminDashboard = () => {
  const { admin, adminGetRevenue, adminSearchOrder, products } = useAdminBear((state) => state);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [deliveredOrders, setDeliveredOrders] = useState(null);
  const [recentOrders, setRecentOrders] = useState(null);
  const [loader,setLoader]=  useState(false);
  const [searchLoader,setSearchLoader]=  useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate()

  useEffect(() => {
    setLoader(true)
    adminGetRevenue().then((res) => {
      setTotalRevenue(res?.totalRevenue);
      setDeliveredOrders(res?.totalDeliveredOrders);
      setRecentOrders(res?.recentOrders);
    })
    .catch((err)=>{
      toast.error(err);
    })
    .finally(()=>{
      setLoader(false)
    })
  }, [adminGetRevenue]);

  const SearchOrder = async()=>{
    try {
      if(!searchRef?.current?.value.trim()){
        return toast.error("Invalid input")
      }
      setSearchLoader(true)
      const data = await adminSearchOrder(searchRef?.current?.value.trim())
      setRecentOrders(data?.orders)
    } catch (error) {
      toast.error(error);
    } finally{
      setSearchLoader(false)
    }
  }
  if(loader) return <CenterLoader/>



  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      {/* --- NAVBAR --- */}
      <nav className="navbar bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-4 lg:px-8">
        <div className="flex-1">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Admin Console
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Aoni Naturals • Dashboard
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="hidden md:flex relative">
            {searchLoader ? <span className="loading loading-spinner loading-sm"></span> :  <Search
              onClick={()=>!searchLoader && SearchOrder()}
              className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />}
            <input
              type="text"
              ref={searchRef}
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all w-64"
            />
          </div>
          <div className="avatar avatar-placeholder">
            <div className="bg-black text-white rounded-xl w-10 shadow-lg shadow-black/20">
              <span className="text-xs font-bold">
                {admin?.username[0].toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="p-4 lg:p-8 max-w-400 mx-auto space-y-8">
        {/* WELCOME HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good Morning, {admin?.username.toUpperCase()} 👋
            </h1>
            <p className="text-gray-500 text-sm">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex gap-2">
            {/* <button className="btn btn-sm bg-white border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg capitalize shadow-sm">
              <Download size={14} className="mr-1" /> Export Report
            </button> */}
            <label
              htmlFor="add_update_modal"
              className="btn btn-sm bg-black text-white hover:bg-gray-800 rounded-lg capitalize shadow-lg shadow-black/10"
            >
              + Add Product
            </label>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Sales */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <TrendingUp size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <Landmark size={12} />

              </span>
            </div>
            <p className="text-sm font-medium text-gray-400">Total Revenue</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              ₹{totalRevenue}
            </h3>
          </div>

          {/* Orders */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ShoppingBag size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                +5 new
              </span>
            </div>
            <p className="text-sm font-medium text-gray-400">
              Delivered Orders
            </p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              {deliveredOrders}
            </h3>
          </div>

          {/* Customers */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Users size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                Total
              </span>
            </div>
            <p className="text-sm font-medium text-gray-400">
              Active Customers
            </p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">No data</h3>
          </div>

          {/* Products */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all">
                <Package size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-400">Total Products</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{products?.length}</h3>
          </div>
        </div>

        {/* --- RECENT ORDERS TABLE --- */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-400">
                Manage and track your latest transactions
              </p>
            </div>
            {/* <button className="btn btn-ghost btn-sm text-gray-500 hover:bg-gray-50 rounded-lg">
              <Filter size={16} className="mr-2" /> Filter
            </button> */}
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-2 px-6">
              <thead>
                <tr className="text-gray-400 border-none uppercase text-[10px] tracking-widest font-bold">
                  <th className="bg-transparent">Order ID</th>
                  <th className="bg-transparent">Customer</th>
                  <th className="bg-transparent">Date</th>
                  <th className="bg-transparent">Status</th>
                  <th className="bg-transparent text-right">Amount</th>
                  <th className="bg-transparent"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {/* Row 1 */}
                {recentOrders?.map((item) => (
                  <tr 
                  key={item?.order_id}
                    onClick={()=>navigate(`/admin/orders/details/${item.order_id}`)}

                  className="hover:bg-gray-50/50 cursor-pointer transition-colors group">
                    <td className="font-bold text-gray-900 py-4 border-none">
                      #{item.order_id}
                    </td>
                    <td className="border-none">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                          {item.user.fullname[0].toUpperCase()}
                        </div>
                        <span className="font-medium capitalize">{item.user.fullname}</span>
                      </div>
                    </td>
                    <td className="text-gray-500 border-none font-medium">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="border-none">
                      <span className={`px-3  py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor(item.status)}`}>
                        {item?.status}
                      </span>
                    </td>
                    <td className="text-right font-black text-gray-900 border-none">
                      ₹{item.total_price}
                    </td>
                    <td className="text-right border-none">
                      <button className="p-2 hover:bg-white rounded-lg transition-all group-hover:shadow-sm">
                        <MoreVertical size={16} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            className="text-center p-4 text-gray-400 "
          >{recentOrders?.length<=0 && 'No orders here'}</p>
          <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
            <button
              onClick={()=>navigate('/admin/orders')}
            className="text-xs font-bold text-gray-400 hover:text-black transition-colors">
              View All Transactions
            </button>
          </div>
        </div>
      </main>
      <AddUpdateProduct />
    </div>
  );
};

export default AdminDashboard;
