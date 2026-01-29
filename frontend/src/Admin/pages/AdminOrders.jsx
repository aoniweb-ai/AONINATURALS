import { useEffect, useMemo, useState } from "react";
import Orders from "../../../components/Orders";
import useAdminBear from "../../../store/admin.store";
import OrdersSkeleton from "../../../components/OrderSkeleton";
import { Search, ShoppingBag, LayoutGrid, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const TABS = [
  { id: "pending", color: "text-amber-500", bg: "bg-amber-50" },
  { id: "shipped", color: "text-blue-500", bg: "bg-blue-50" },
  { id: "delivered", color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "cancelled", color: "text-rose-500", bg: "bg-rose-50" },
];

const AdminOrders = () => {
  const { orders, adminGetOrders } = useAdminBear((state) => state);
  const [activeTab, setActiveTab] = useState("pending");
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoader(true);
    adminGetOrders(activeTab.toLocaleLowerCase())
      .catch((err) => toast.error(err))
      .finally(() => setLoader(false));
  }, [adminGetOrders, activeTab]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const statusMatch = order.status === activeTab;
      const searchValue = search.toLowerCase();
      return (
        statusMatch &&
        (order.order_id?.toLowerCase().includes(searchValue) ||
          order.user?.fullname?.toLowerCase().includes(searchValue) ||
          order.user?.email?.toLowerCase().includes(searchValue))
      );
    });
  }, [orders, activeTab, search]);

  return (
    <section className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShoppingBag className="text-primary" size={32} />
              Orders
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              You have total {filteredOrders.length} orders in {activeTab}
            </p>
          </div>

          {/* QUICK STAT (Optional visual) */}
          <div className="hidden sm:flex gap-4">
             <div className="bg-white p-3 px-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <LayoutGrid size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Total View</p>
                  <p className="text-lg font-black">{filteredOrders.length}</p>
                </div>
             </div>
          </div>
        </div>

        {/* --- CONTROLS: TABS + SEARCH --- */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col xl:flex-row gap-6 items-center justify-between mb-8">
          
          {/* CUSTOM TABS */}
          <div className="flex p-1 bg-slate-100 rounded-2xl w-full xl:w-auto overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 xl:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 capitalize flex items-center justify-center gap-2
                  ${activeTab === tab.id 
                    ? `bg-white ${tab.color} shadow-sm` 
                    : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${activeTab === tab.id ? (tab.id === 'pending' ? 'bg-amber-500' : tab.id === 'shipped' ? 'bg-blue-500' : tab.id === 'delivered' ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-slate-300'}`}></span>
                {tab.id}
              </button>
            ))}
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full xl:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by ID, Name or Email..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {(activeTab == "cancelled" || activeTab == "delivered") && <p className="text-sm font-bold text-slate-500 mt-1 text-end">Last one month</p> }
        </div>


        {/* --- CONTENT AREA --- */}
        <div className="relative">
          {(!orders || loader) ? (
            <OrdersSkeleton />
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[3rem] py-20 px-10 text-center border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Orders Found</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                We couldn't find any orders matching your current filters or search criteria.
              </p>
              <button 
                onClick={() => {setSearch(""); setActiveTab("pending")}}
                className="mt-6 text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Orders orders={filteredOrders} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminOrders;