import { Package, MapPin, CreditCard, Truck } from "lucide-react";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { formatDateTime } from "../../../utils/formatDateTime";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAdminBear from "../../../store/admin.store";
import OrdersSkeleton from "../../../components/OrderSkeleton";

const statusColor = (status) => {
  switch (status) {
    case "pending":
      return "badge-warning";
    case "shipped":
      return "badge-info";
    case "delivered":
      return "badge-success";
    case "cancelled":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

const OrderDetails = () => {

    const {adminGetAnOrder} = useAdminBear(state=>state);
    const [order,setOrder] = useState(null);
    const {order_id} = useParams();
    useEffect(()=>{
        adminGetAnOrder(order_id)
        .then((res)=>{
            // console.log("resposne aa ",res);
            setOrder(res)
        })
    },[])

  if (!order) return <OrdersSkeleton/>;

  return (
    <section className="min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* HEADER */}
        <div className="bg-base-100 rounded-xl p-6 shadow">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Order #{order.order_id}
              </h1>
              <p className="text-sm text-base-content/60">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>

            <div className={`badge ${statusColor(order.status)} badge-lg capitalize`}>
              {order.status}
            </div>
          </div>
        </div>

        {/* USER + PAYMENT */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* USER */}
          <div className="bg-base-100 rounded-xl p-6 shadow space-y-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <MapPin size={18} /> Customer Details
            </h2>

            <p><strong>Name:</strong> {order.user.fullname}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            <p><strong>Phone:</strong> {order.user.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>
          </div>

          {/* PAYMENT */}
          <div className="bg-base-100 rounded-xl p-6 shadow space-y-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <CreditCard size={18} /> Payment Info
            </h2>

            <p><strong>Method:</strong> {order.payment_method}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">
                {order.payment_status}
              </span>
            </p>
            {order.razorpay_order_id && (
              <p className="text-sm break-all">
                <strong>Razorpay ID:</strong>{" "}
                {order.razorpay_order_id}
              </p>
            )}
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="bg-base-100 rounded-xl p-6 shadow">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Package size={18} /> Products
          </h2>

          <div className="space-y-4">
            {order.product.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 items-center border-b pb-4 last:border-none"
              >
                <img
                  src={getCloudinaryImage(
                    item.product.product_images?.[0]?.secure_url,
                    { width: 120, quality: 50 }
                  )}
                  alt={item.product.product_name}
                  className="w-16 h-16 object-contain bg-base-200 rounded-lg"
                />

                <div className="flex-1">
                  <p className="font-medium">
                    {item.product.product_name}
                  </p>
                  <p className="text-sm text-base-content/60">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold flex flex-col">
                  ₹{item.price} <span className="text-sm text-base-content/60">
                    +{item.cod_charges}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PRICE SUMMARY */}
        <div className="bg-base-100 rounded-xl p-6 shadow">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Truck size={18} /> Price Summary
          </h2>

          <div className="space-y-2 text-sm">
            {/* <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.product.price}</span>
            </div> */}

            {/* <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{order.discount}</span>
            </div> */}

            {order.payment_method == "cod" && <div className="flex justify-between">
              <span>COD Charges</span>
              <span>₹{order.cod_charges}</span>
            </div>}

            <hr />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{order.total_price}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
