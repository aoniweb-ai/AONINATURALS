import { Package, ChevronRight } from "lucide-react";
import { getCloudinaryImage } from "../utils/getCloudinaryImage";
import useAdminBear from "../store/admin.store";
import toast from "react-hot-toast";
import { timeAgo } from "../utils/timeAgo";
import { useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status) {
    case "delivered":
      return "text-green-600 bg-green-100";
    case "shipped":
      return "text-blue-600 bg-blue-100";
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    case "cancelled":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};
const getBadgeColor = (status) => {
  switch (status) {
    case "pending":
      return "badge-accent";
    case "cancelled":
      return "badge-error";
    case "paid":
      return "badge-info";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const Orders = ({ orders = [] }) => {
  const { admin, adminUpdateOrderStatus } = useAdminBear((state) => state);
  const navigate = useNavigate();

  const updateStatus = async (id, value) => {
    try {
      adminUpdateOrderStatus({ order_id: id, status: value });
    } catch (error) {
      toast.error(error);
    }
  };
  

  return (
    <section className=" min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-semibold mb-8">My Orders</h1>

        {orders?.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders?.map((order) => (
              <div
                key={order.order_id}
                className={` ${(order.payment_status == "cancelled" || order.status == "cancelled") ? "bg-error-content" : "bg-success-content"} rounded-2xl p-5 sm:p-6`}
              >
                {/* TOP BAR */}
                <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
                  <div>
                    <p>{timeAgo(order?.createdAt)}</p>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">
                      #{order.order_id.slice(order.order_id.indexOf("_") + 1)}
                    </p>
                  </div>
                  {admin ? (
                    <select
                      defaultValue={order.status}
                      className={`select select-ghost cursor-pointer px-3 py-1 rounded-full font-medium bg-base-100`}
                      onChange={(e) =>
                        admin && updateStatus(order.order_id, e.target.value)
                      }
                    >
                      <option
                        value={"pending"}
                        className="text-yellow-600 bg-yellow-100 mt-2 hover:shadow-md"
                      >
                        Pending
                      </option>
                      <option
                        value={"shipped"}
                        className="text-blue-600 bg-blue-100 mt-2 hover:shadow-md"
                      >
                        Shipped
                      </option>
                      <option
                        value={"delivered"}
                        className="text-green-600 bg-green-100 mt-2 hover:shadow-md"
                      >
                        Delivered
                      </option>
                      <option
                        value={"cancelled"}
                        className="text-red-600 bg-red-100 mt-2 hover:shadow-md"
                      >
                        Cancelled
                      </option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* PRODUCTS */}
                <div className="space-y-4">
                  {order?.product?.map((item, index) => (
                    <div key={index} className={"flex gap-4 items-center"}>
                      <img
                        src={getCloudinaryImage(
                          item.product.product_images?.[0]?.secure_url,
                          { width: 120, quality: 40 },
                        )}
                        alt={item.product.product_name}
                        className="w-16 h-16 object-contain bg-gray-100 rounded-xl"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium flex justify-between">
                          {item.product.product_name}{" "}
                          <span className="text-sm text-base-content">
                            ₹{item?.price}
                          </span>
                        </h3>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="flex flex-wrap gap-4 justify-between items-center mt-6 pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-500">
                      Total Amount{" "}
                      <div
                        className={`badge ${getBadgeColor(order.payment_status)}`}
                      >
                        {order.payment_status}
                      </div>
                      {/* <span className="text-sm text-info">
                        ({})
                      </span> */}
                    </div>
                    <p className="font-semibold">₹{order.total_price}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {order.payment_method}
                    </span>

                    <button
                      onClick={()=>navigate(`/admin/orders/details/${order.order_id}`)}
                    className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline">
                      View Details
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;
