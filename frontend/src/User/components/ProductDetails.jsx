import { useEffect, useState } from "react";
import {
  ShoppingCart,
  RefreshCcw,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Leaf,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
} from "lucide-react";
import useUserBear from "../../../store/user.store";
import { useNavigate, useParams } from "react-router-dom";
import ProductDetailsSkeleton from "./Skeleton/ProductDetailsSkeleton";
import toast from "react-hot-toast";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";

const ProductDetails = () => {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImg, setSelectedImg] = useState(0);
  const [loader, setLoader] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const { userGetaProduct, userAddToCart, product, setProduct } = useUserBear(
    (state) => state,
  );

  useEffect(() => {
    setProduct(null);
    userGetaProduct(id).catch((err) => toast.error(err));
  }, [id, userGetaProduct, setProduct]);

  const addToCartProduct = async () => {
    try {
      setLoader(true);
      await userAddToCart({
        id,
        quantity: qty,
      });
      toast.success("Added to your bag! 🛍️");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  const refreshProduct = async () => {
    try {
      setRefreshLoader(true);
      await userGetaProduct(id);
    } catch (err) {
      toast.error(err);
    } finally {
      setRefreshLoader(false);
    }
  };

  if (!product) return <ProductDetailsSkeleton />;

  const tabs = [
    { key: "description", label: "Description", content: product.description },
    { key: "ingredients", label: "Ingredients", content: product.ingredients },
    { key: "how", label: "How to Use", content: product.how_to_use },
    { key: "benefits", label: "Benefits", content: product.benefits },
    { key: "recommended", label: "Recommended", content: product.recommended },
  ];

  return (
    <section className="bg-[#fcfcfc] min-h-screen pb-20 font-sans w-full">
      {/* --- TOP NAVIGATION --- */}
      <div className="bg-white/70 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 font-semibold text-gray-700 hover:text-black transition-all"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back</span>
          </button>

          <button
            onClick={refreshProduct}
            className="flex items-center gap-2 text-sm font-bold text-primary px-4 py-2 rounded-full hover:bg-primary/5 transition-colors"
          >
            {refreshLoader ? (
              <RefreshCcw size={16} className="animate-spin" />
            ) : (
              <RefreshCcw size={16} />
            )}
            {refreshLoader ? "Syncing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* --- LEFT: IMAGE GALLERY (STIKCY) --- */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/40">
              <img
                src={getCloudinaryImage(
                  product.product_images?.[selectedImg]?.secure_url,
                  {
                    width: 1200,
                    quality: 100,
                  },
                )}
                alt={product.product_name}
                className="w-full h-full object-contain p-8 transition-all duration-700 hover:scale-110"
              />

              {/* Discount Tag on Image */}
              {product.discount > 0 && (
                <div className="absolute top-6 left-6 bg-black text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
                  {product.discount+product?.extra_discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar justify-center">
              {product.product_images?.map((img, idx) => (
                <button
                  key={img.public_id}
                  onClick={() => setSelectedImg(idx)}
                  className={`relative shrink-0 w-[22%] h-[22%] rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImg === idx
                      ? "border-black scale-105 shadow-lg"
                      : "border-transparent opacity-50 hover:opacity-100 shadow-sm"
                  }`}
                >
                  <img
                    src={getCloudinaryImage(img.secure_url, {
                      width: 200,
                      quality: 20,
                    })}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* --- RIGHT: PRODUCT CONTENT --- */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest">
                  Best Seller
                </span>
                <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                  <Clock size={12} /> Fast Moving
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1]">
                {product.product_name}
              </h1>
              <span className=" badge badge-accent text-accent-content font-bold text-sm">
                {product.discount }% {product?.extra_discount &&  '+ '+product.extra_discount} OFF
              </span>
            </div>

            {/* Price & Offers */}
            <div className="p-8 rounded-4xl bg-white border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-end gap-4">
                <span className="text-5xl font-black text-black tracking-tight">
                  ₹{Math.round(product.final_price)}
                </span>
                {(product.discount > 0 || product.extra_discount > 0) && (
                  <div className="flex flex-col mb-1">
                    <span className="text-xl text-gray-400 line-through font-medium">
                      ₹{product.price}
                    </span>
                    <span className="text-green-600 font-bold text-sm">
                      You Save ₹{product.price - product.final_price}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 border-t border-gray-50 pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <CheckCircle2 size={18} className="text-green-500" />
                  Free Delivery on orders above ₹499
                </div>
                {product.cod_charges > 0 && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <CheckCircle2 size={18} className="text-green-500" />
                    Cash on Delivery available (₹{product.cod_charges})
                  </div>
                )}
              </div>
            </div>

            {/* Cart Actions */}
            <div className="space-y-4">
              {product.stock > 0 && !product.sold ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center justify-between bg-white border-2 border-gray-100 p-1.5 rounded-2xl w-full sm:w-1/3">
                    <button
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-colors text-gray-500"
                      onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                    >
                      <Minus size={20} />
                    </button>
                    <span className="font-black text-xl">{qty}</span>
                    <button
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-colors text-gray-500"
                      onClick={() => product.stock > qty && setQty(qty + 1)}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <button
                    onClick={addToCartProduct}
                    disabled={loader}
                    className="flex-1 bg-black text-white py-5 rounded-2xl text-lg font-black hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-black/10"
                  >
                    {loader ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      <>
                        <ShoppingCart size={22} strokeWidth={2.5} />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="w-full bg-red-50 text-red-600 py-6 rounded-2xl text-center font-black text-xl border-2 border-red-100">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-6 py-4">
              {[
                {
                  icon: <Truck />,
                  label: "Express Shipping",
                  bg: "bg-blue-50",
                  text: "text-blue-600",
                },
                {
                  icon: <Leaf />,
                  label: "100% Organic",
                  bg: "bg-emerald-50",
                  text: "text-emerald-600",
                },
                {
                  icon: <ShieldCheck />,
                  label: "Secure Payment",
                  bg: "bg-amber-50",
                  text: "text-amber-600",
                },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group">
                  <div
                    className={`${badge.bg} ${badge.text} w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    {badge.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- FULL WIDTH TABS SECTION (Improved for Heavy Data) --- */}
      <div className="mt-24 bg-white border-t  border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="flex flex-wrap justify-center gap-2 md:gap-8 mb-16 border-b border-gray-100 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] transition-all
                  ${activeTab === tab.key ? "text-black" : "text-gray-300 hover:text-gray-500"}`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute -bottom-4.25 left-0 w-full h-1 bg-black rounded-full animate-in fade-in zoom-in"></span>
                )}
              </button>
            ))}
          </div>

          <div className="min-h-75 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-gray-900 mb-8 capitalize">
              {activeTab.replace("_", " ")}
            </h2>
            <div className="text-gray-600 text-lg md:text-xl leading-[1.8] space-y-6 whitespace-pre-wrap">
              {tabs.find((t) => t.key === activeTab)?.content || (
                <p className="italic text-gray-400 text-base">
                  Detailed information is not available for this section yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
