import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Pencil, 
  ArrowLeft, 
  Users, 
  Boxes, 
  BadgePercent, 
  Truck, 
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import useAdminBear from "../../../store/admin.store";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import CenterLoader from "../../../components/CenterLoader";
import AddUpdateProduct from "./AddUpdateProduct";
import { formatDateTime } from "../../../utils/formatDateTime";
import { motion, AnimatePresence } from "framer-motion";

const getFinalPrice = (price, discount = 0, extra = 0) =>
  Math.round(price - (price * discount) / 100 - (price * extra) / 100);

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const imageTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
  transition: { duration: 0.4, ease: "easeOut" }
};

const AdminProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminGetAproduct, setEditProduct, product, setProductNull } = useAdminBear((state) => state);
  
  const [activeTab, setActiveTab] = useState("Description");
  const [selectedImg, setSelectedImg] = useState("");

  useEffect(() => {
    setProductNull();
    adminGetAproduct(id).catch((err) => toast.error(err));
  }, [adminGetAproduct, id, setProductNull]);

  useEffect(() => {
    if (product?.product_images?.length > 0) {
      setSelectedImg(product.product_images[0].secure_url);
    }
  }, [product]);

  if (!product) return <CenterLoader />;

  const finalPrice = getFinalPrice(product.price, product.discount, product.extra_discount);
  const tabLabels = ["Description", "Ingredients", "How to Use", "Benefits", "Recommended"];

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#f8f9fa] min-h-screen p-4 lg:p-10 font-sans"
    >
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10"
        >
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all"
          >
            <ArrowLeft size={18} strokeWidth={3} />
            Back to Inventory
          </motion.button>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditProduct(product)}
              htmlFor="add_update_modal"
              className="flex-1 sm:flex-none btn bg-black text-white hover:bg-gray-800 border-none rounded-2xl px-6 shadow-xl shadow-black/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <Pencil size={16} /> Edit Product
            </motion.label>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-white p-6 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="aspect-square bg-[#fbfbfb] rounded-[2.5rem] overflow-hidden group border border-gray-50 flex items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={selectedImg} 
                            src={getCloudinaryImage(selectedImg || product.product_images[0]?.secure_url, { width: 800 })}
                            className="w-full h-full object-contain mix-blend-multiply absolute"
                            alt="Product"
                            variants={imageTransition}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        />
                    </AnimatePresence>
                </div>
                
                <motion.div 
                    className="flex gap-4 mt-6 overflow-x-auto py-2 justify-center px-3 no-scrollbar"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {product.product_images.map((img, i) => (
                        <motion.div 
                            key={i}
                            variants={itemVariants}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedImg(img.secure_url)}
                            className={`w-[20%] h-[20%] rounded-2xl cursor-pointer border-2 transition-all p-1 bg-white ${selectedImg === img.secure_url ? 'border-black shadow-md' : 'border-transparent opacity-60'}`}
                        >
                            <img src={getCloudinaryImage(img.secure_url, { width: 150, quality:100 })} className="w-full h-full object-cover rounded-xl" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-8"
          >
            <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-sm border border-gray-100 h-full">
                <div className="space-y-4">
                    <motion.div variants={itemVariants} className="flex items-center gap-2 text-emerald-600">
                        <Sparkles size={16} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Organic</span>
                    </motion.div>
                    <motion.h1 variants={itemVariants} className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                        {product.product_name}
                    </motion.h1>
                </div>

                <motion.div variants={itemVariants} className="mt-8 flex items-end gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Price</p>
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter">₹{finalPrice}</h2>
                    </div>
                    <div className="mb-1">
                        <span className="text-xl text-gray-300 font-bold">MRP: <span className="line-through">₹{product.price}</span></span>
                        <div className="mt-1 inline-flex ms-2 items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-[10px] font-black tracking-tighter">
                            <BadgePercent size={12} />
                            {product.discount + (product.extra_discount || 0)}% SAVING
                        </div>
                    </div>
                </motion.div>

                {/* Performance HUD */}
                <motion.div variants={containerVariants} className="grid grid-cols-3 gap-6 mt-12">
                    {[
                        { icon: Boxes, val: product.stock, label: "Stock" },
                        { icon: Users, val: product.buyers?.length || 0, label: "Buyers" },
                        { icon: Truck, val: `₹${product.cod_charges}`, label: "COD Cost" }
                    ].map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, backgroundColor: "#F9FAFB" }}
                            className="text-center p-4 rounded-3xl bg-gray-50 border border-gray-100 transition-colors cursor-default"
                        >
                            <stat.icon size={18} className="mx-auto mb-2 text-gray-400" />
                            <p className="text-xl font-black text-gray-900">{stat.val}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-gray-50 flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Calendar size={14} /> Registered: {formatDateTime(product.createdAt)}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Layers size={14} /> Category: Wellness
                    </div>
                </motion.div>
            </div>
          </motion.div>

          {/* --- BOTTOM: LUXURY TABS --- */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-12"
          >
            <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex bg-gray-50/50 p-2 overflow-x-auto no-scrollbar">
                    {tabLabels.map((label) => (
                        <button
                            key={label}
                            onClick={() => setActiveTab(label)}
                            className={`relative px-10 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap z-10 ${
                                activeTab === label ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {activeTab === label && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white rounded-[2.5rem] shadow-sm -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {label}
                        </button>
                    ))}
                </div>
                
                <div className="p-10 lg:p-16 min-h-50">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-4xl leading-[1.8] text-gray-600 text-lg"
                        >
                            {activeTab === "Description" && product.description}
                            {activeTab === "Ingredients" && product.ingredients}
                            {activeTab === "How to Use" && product.how_to_use}
                            {activeTab === "Benefits" && product.benefits}
                            {activeTab === "Recommended" && product.recommended}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
      <AddUpdateProduct />
    </motion.section>
  );
};

export default AdminProductDetails;