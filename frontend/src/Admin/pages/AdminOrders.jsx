import { useEffect, useMemo, useState } from "react";
import Orders from "../../../components/Orders";
import useAdminBear from "../../../store/admin.store";
import OrdersSkeleton from "../../../components/OrderSkeleton";
import { Search } from "lucide-react";

const TABS = ["pending", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const { orders, adminGetOrders } = useAdminBear((state) => state);

  const [activeTab, setActiveTab] = useState("pending");
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoader(true)
    adminGetOrders(activeTab.toLocaleLowerCase())
    .then(()=>{
      
    })
    .finally(()=>{
      setLoader(false);
    })
  }, [adminGetOrders,activeTab]);

  // 🔥 FILTER LOGIC
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order) => {
      const statusMatch = order.status === activeTab;

      const searchValue = search.toLowerCase();
      const searchMatch =
        order.order_id?.toLowerCase().includes(searchValue) ||
        order.user?.fullname?.toLowerCase().includes(searchValue) ||
        order.user?.email?.toLowerCase().includes(searchValue);

      return statusMatch && searchMatch;
    });
  }, [orders, activeTab, search]);

  

  return (
    <section className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-base-content/60">
            Manage and track all orders
          </p>
        </div>

        {/* TABS + SEARCH */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          {/* STATUS TABS */}
          <div className="tabs tabs-boxed bg-base-100">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab capitalize ${
                  activeTab === tab ? "tab-active" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full sm:w-72">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
            />
            <input
              type="text"
              placeholder="Search order / user"
              className="input input-bordered w-full pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ORDERS LIST */}
        {(!orders || loader) ? <OrdersSkeleton /> : filteredOrders.length === 0 ? (
          <div className="bg-base-100 rounded-xl p-10 text-center text-base-content/60">
            No orders found
          </div>
        ) : (
           
          <Orders orders={filteredOrders} />
        )}
      </div>
    </section>
  );
};

export default AdminOrders;
