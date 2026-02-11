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
  Star,
  Zap
} from "lucide-react";
import useUserBear from "../../../store/user.store";
import { useNavigate, useParams } from "react-router-dom";
import ProductDetailsSkeleton from "./Skeleton/ProductDetailsSkeleton";
import toast from "react-hot-toast";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetails = () => {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImg, setSelectedImg] = useState(0);
  const [loader, setLoader] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const { userGetaProduct, userAddToCart, product, setProduct, user } = useUserBear(
    (state) => state,
  );

  useEffect(() => {
    setProduct(null);
    userGetaProduct(id).catch((err) => toast.error(err));
  }, [id, userGetaProduct, setProduct]);

  const addToCartProduct = async () => {
    if(!user){
      toast("Create an account or login to add cart",{icon: 'ℹ️'});
      return navigate("/login");
    }
    try {
      setLoader(true);
      await userAddToCart({
        id,
        quantity: qty,
      });
      toast.success("Added to your bag! 🛍️");
    } catch (err) {
      toast.error(err || "Something went wrong");
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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#fcfcfc] min-h-screen pb-20 font-sans w-full"
    >
      {/* --- TOP NAVIGATION --- */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 font-bold text-gray-700 hover:text-black transition-all"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshProduct}
            className="flex items-center gap-2 text-sm font-bold text-primary px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <RefreshCcw size={16} className={refreshLoader ? "animate-spin" : ""} />
            {refreshLoader ? "Syncing..." : "Refresh"}
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* --- LEFT: IMAGE GALLERY (STICKY) --- */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImg}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={getCloudinaryImage(
                    product.product_images?.[selectedImg]?.secure_url,
                    { width: 1200, quality: 100 }
                  )}
                  alt={product.product_name}
                  className="w-full h-full object-contain p-8"
                />
              </AnimatePresence>

              {/* Discount Tag */}
              {product?.discount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute top-6 left-6 bg-black/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-lg flex items-center gap-1"
                >
                  <Zap size={12} className="text-yellow-400 fill-yellow-400"/>
                  {product.discount}%{product?.extra_discount && ' + '+product.extra_discount+'%'} OFF
                </motion.div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex gap-3 overflow-x-auto py-2 no-scrollbar justify-center"
            >
              {product.product_images?.map((img, idx) => (
                <motion.button
                  variants={itemVariants}
                  key={img.public_id}
                  onClick={() => setSelectedImg(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImg === idx
                      ? "border-black shadow-lg"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={getCloudinaryImage(img.secure_url, { width: 200, quality: 20 })}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                  {selectedImg === idx && (
                    <motion.div 
                      layoutId="active-ring"
                      className="absolute inset-0 border-2 border-black rounded-2xl"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* --- RIGHT: PRODUCT CONTENT --- */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-linear-to-r from-primary/10 to-primary/5 text-primary text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest border border-primary/10">
                  Best Seller
                </span>
                <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                  <Clock size={12} /> Fast Moving
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                {product.product_name}
              </h1>
              <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <span className="text-sm font-medium text-gray-400">BEST SELLER</span>
              </div>
            </motion.div>

            {/* Price & Offers */}
            <motion.div variants={itemVariants} className="p-8 rounded-4xl bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] space-y-6 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -z-10" />

              <div className="flex items-end gap-4">
                <span className="text-5xl font-black text-black tracking-tighter">
                  ₹{Math.round(product.final_price)}
                </span>
                {(product.discount > 0 || product.extra_discount > 0) && (
                  <div className="flex flex-col mb-1.5">
                    <span className="text-lg text-gray-400 font-bold line-through decoration-2 decoration-red-300">
                      ₹{product.price}
                    </span>
                    <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded">
                      Save ₹{product.price - product.final_price}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 border-t border-gray-50 pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                  <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />
                  Inclusive of all taxes 
                </div>
                {product.cod_charges > 0 && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />
                    Cash on Delivery available (₹{product.cod_charges})
                  </div>
                )}
              </div>
            </motion.div>

            {/* Cart Actions */}
            <motion.div variants={itemVariants} className="space-y-4">
              {product.stock > 0 && !product.sold ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded-2xl w-full sm:w-40 shadow-sm">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                      onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                    >
                      <Minus size={20} strokeWidth={2.5} />
                    </motion.button>
                    <span className="font-black text-xl tabular-nums">{qty}</span>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                      onClick={() => product.stock > qty && setQty(qty + 1)}
                    >
                      <Plus size={20} strokeWidth={2.5} />
                    </motion.button>
                  </div>

                  {/* Add To Cart Button */}
                  <motion.button
                    onClick={addToCartProduct}
                    disabled={loader}
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-black text-white py-5 rounded-2xl text-lg font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl relative overflow-hidden"
                  >
                    {loader ? (
                      <span className="loading loading-dots loading-md"></span>
                    ) : (
                      <>
                        <ShoppingCart size={22} strokeWidth={2.5} />
                        Add to Cart
                      </>
                    )}
                  </motion.button>
                </div>
              ) : (
                <div className="w-full bg-red-50 text-red-600 py-6 rounded-2xl text-center font-black text-xl border border-red-100 flex items-center justify-center gap-2">
                  <ShieldCheck size={24}/> Out of Stock
                </div>
              )}
            </motion.div>

            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-3 gap-6 py-4"
            >
              {[
                { icon: <Truck />, label: "Express Shipping", color: "blue" },
                { icon: <Leaf />, label: "100% Organic", color: "emerald" },
                { icon: <ShieldCheck />, label: "Secure Payment", color: "amber" },
              ].map((badge, i) => (
                <motion.div variants={itemVariants} key={i} className="flex flex-col items-center gap-3 group p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-50">
                  <div className={`text-${badge.color}-600 bg-${badge.color}-50 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {badge.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* --- ANIMATED TABS SECTION --- */}
      <div className="mt-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-20">
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-10 mb-16 border-b border-gray-100 pb-2 relative">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-4 text-sm font-bold uppercase tracking-[0.2em] transition-colors z-10 ${
                   activeTab === tab.key ? "text-black" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.span 
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-t-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-75"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-8 capitalize tracking-tight">
                {activeTab.replace("_", " ")}
              </h2>
              <div className="text-gray-600 text-lg md:text-xl leading-[1.8] space-y-6 whitespace-pre-wrap font-medium">
                {tabs.find((t) => t.key === activeTab)?.content || (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50">
                      <Zap size={40} className="mb-4"/>
                      <p className="italic">Detailed information coming soon.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default ProductDetails;