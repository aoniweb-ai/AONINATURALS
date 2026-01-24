import { Package, ChevronRight } from "lucide-react";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "text-green-600 bg-green-100";
    case "Shipped":
      return "text-blue-600 bg-blue-100";
    case "Pending":
      return "text-yellow-600 bg-yellow-100";
    case "Cancelled":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const UserOrders = () => {

    const orders = [
  {
    _id: "order_65af12a1",
    createdAt: "2026-01-20T10:30:00Z",
    status: "Delivered",
    payment_method: "Online",
    total_amount: 1299,
    items: [
      {
        quantity: 2,
        product: {
          product_name: "Herbal Hair Oil",
          product_images: [
            {
              secure_url:
                "https://res.cloudinary.com/demo/image/upload/v1690000000/sample.jpg",
            },
          ],
        },
      },
      {
        quantity: 1,
        product: {
          product_name: "Onion Hair Oil",
          product_images: [
            {
              secure_url:
                "https://res.cloudinary.com/demo/image/upload/v1690000000/sample.jpg",
            },
          ],
        },
      },
    ],
  },

  {
    _id: "order_65af12b2",
    createdAt: "2026-01-18T14:15:00Z",
    status: "Shipped",
    payment_method: "COD",
    total_amount: 899,
    items: [
      {
        quantity: 1,
        product: {
          product_name: "Amla Hair Oil",
          product_images: [
            {
              secure_url:
                "https://res.cloudinary.com/demo/image/upload/v1690000000/sample.jpg",
            },
          ],
        },
      },
    ],
  },

  {
    _id: "order_65af12c3",
    createdAt: "2026-01-15T09:00:00Z",
    status: "Pending",
    payment_method: "Online",
    total_amount: 1599,
    items: [
      {
        quantity: 3,
        product: {
          product_name: "Neem Hair Oil",
          product_images: [
            {
              secure_url:
                "https://res.cloudinary.com/demo/image/upload/v1690000000/sample.jpg",
            },
          ],
        },
      },
    ],
  },
];

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        <h1 className="text-3xl font-semibold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-5 sm:p-6"
              >
                {/* TOP BAR */}
                <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>
                    <p className="font-medium">
                      #{order._id.slice(-6)}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* PRODUCTS */}
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-center"
                    >
                      <img
                        src={getCloudinaryImage(
                          item.product.product_images?.[0]?.secure_url,
                          { width: 120, quality: 40 }
                        )}
                        alt={item.product.product_name}
                        className="w-16 h-16 object-contain bg-gray-100 rounded-xl"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium">
                          {item.product.product_name}
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
                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>
                    <p className="font-semibold">
                      ₹{order.total_amount}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {order.payment_method}
                    </span>

                    <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline">
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

export default UserOrders;
