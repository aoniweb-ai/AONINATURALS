import { Plus, Package, ExternalLink, Hash, Layers, Search, Filter } from "lucide-react";
import AddUpdateProduct from "../components/AddUpdateProduct";
import useAdminBear from "../../../store/admin.store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { motion, AnimatePresence } from "framer-motion";

// --- ANIMATION VARIANTS ---
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

const AdminProduct = () => {
  const { adminGetproducts, products } = useAdminBear((state) => state);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    adminGetproducts();
  }, [adminGetproducts]);

  const filteredProducts = products?.filter(p => 
    p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="p-4 md:p-8 flex flex-col gap-8 bg-[#f8f9fa] min-h-screen font-sans"
    >
      
      {/* --- HEADER SECTION --- */}
      <motion.div 
        variants={pageVariants}
        className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"
      >
        <div className="flex-1">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <div className="p-3 bg-black text-white rounded-xl shadow-lg shadow-black/20">
               <Package size={24} />
            </div>
            Products Inventory
          </h2>
          <p className="text-slate-500 font-medium ml-[3.75rem] -mt-1 text-sm">
            Manage your store's catalog, prices, and stock levels.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            {/* Search Bar */}
            <div className="relative group w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-black transition-all outline-none"
                />
            </div>

            <motion.label 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                htmlFor="add_update_modal" 
                className="btn bg-black text-white border-none px-6 py-3 h-auto rounded-xl gap-2 font-bold shadow-xl shadow-black/10 normal-case hover:bg-gray-800 cursor-pointer flex items-center justify-center"
            >
                <Plus size={20} strokeWidth={3} /> 
                Add Product
            </motion.label>
        </div>
      </motion.div>

      {/* --- TABLE CARD --- */}
      <motion.div 
        variants={pageVariants}
        className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col"
      >
        <div className="overflow-x-auto">
          <table className="table w-full border-separate border-spacing-y-2 px-4">
            {/* HEAD */}
            <thead>
              <tr className="text-slate-400">
                <th className="py-5 pl-6 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50">Product</th>
                <th className="font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-center">Price</th>
                <th className="font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-center">Discount</th>
                <th className="font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-center">Inventory</th>
                <th className="font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-center">Status</th>
                <th className="pr-6 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-right">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <motion.tbody 
              variants={tableContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredProducts?.map((item) => (
                    <motion.tr 
                    key={item?._id}
                    variants={rowVariants}
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(248, 250, 252, 0.8)" }}
                    className="group bg-white transition-all cursor-default shadow-sm hover:shadow-md border border-transparent hover:border-gray-100 rounded-2xl"
                    style={{ borderRadius: "1rem" }} // Fix for border-radius on tr
                    >
                    {/* Product Info */}
                    <td className="py-4 pl-4 rounded-l-2xl border-none">
                        <div className="flex items-center gap-4">
                        <motion.div 
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            className="avatar"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 p-1">
                            <img
                                src={getCloudinaryImage(item?.product_images[0]?.secure_url, {
                                width: 200,
                                quality: 40,
                                })}
                                alt={item.product_name}
                                className="object-contain h-full w-full rounded-xl"
                            />
                            </div>
                        </motion.div>
                        <div>
                            <div className="font-black text-slate-800 text-base line-clamp-1">{item?.product_name}</div>
                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1 bg-slate-100 w-fit px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                <Hash size={10} /> {item?._id?.slice(-6)}
                            </div>
                        </div>
                        </div>
                    </td>

                    {/* Price */}
                    <td className="text-center border-none">
                        <div className="flex flex-col items-center">
                        <span className="text-base font-black text-slate-900">₹{item?.final_price}</span>
                        {item?.price > item?.final_price && (
                            <span className="text-[10px] font-bold text-slate-400 line-through">₹{item?.price}</span>
                        )}
                        </div>
                    </td>

                    {/* Discount Badges */}
                    <td className="text-center border-none">
                        <div className="flex flex-col gap-1 items-center justify-center">
                        {item?.discount > 0 ? (
                            <span className="badge badge-sm bg-emerald-50 text-emerald-600 border-none font-bold text-[10px]">- {item?.discount}%</span>
                        ) : <span className="text-gray-300">-</span>}
                        
                        {item?.extra_discount > 0 && (
                            <span className="badge badge-sm bg-blue-50 text-blue-600 border-none font-bold text-[10px]">+ {item?.extra_discount}% Off</span>
                        )}
                        </div>
                    </td>

                    {/* Stock */}
                    <td className="text-center border-none">
                        <div className="flex flex-col items-center gap-1.5 w-24 mx-auto">
                        <div className="flex items-center gap-1.5 font-bold text-slate-600 text-xs">
                            <Layers size={12} className="text-slate-400" />
                            {item?.stock} units
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(item.stock, 100)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full ${item.stock < 10 ? 'bg-rose-500' : item.stock < 30 ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                            />
                        </div>
                        </div>
                    </td>

                    {/* Status */}
                    <td className="text-center border-none">
                        {item?.stock > 0 && !item?.sold ? (
                        <div className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase bg-emerald-50/50 border border-emerald-100 px-2.5 py-1 rounded-full">
                            <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            Active
                        </div>
                        ) : (
                        <div className="inline-flex items-center gap-1.5 text-rose-600 font-bold text-[10px] uppercase bg-rose-50/50 border border-rose-100 px-2.5 py-1 rounded-full">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                            Inactive
                        </div>
                        )}
                    </td>

                    {/* Actions */}
                    <td className="pr-4 text-right rounded-r-2xl border-none">
                        <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/${import.meta.env.VITE_ADMIN_POST_URI}/products/details/${item._id}`)}
                        className="p-2 bg-gray-50 text-gray-500 hover:bg-black hover:text-white rounded-xl transition-colors group/btn shadow-sm"
                        >
                        <ExternalLink size={18} />
                        </motion.button>
                    </td>
                    </motion.tr>
                ))}
              </AnimatePresence>
            </motion.tbody>
          </table>

          {filteredProducts?.length === 0 && (
             <div className="p-12 text-center flex flex-col items-center text-gray-400">
                <Package size={48} className="mb-4 opacity-20" />
                <p>No products found matching your search.</p>
             </div>
          )}
        </div>
      </motion.div>

      <AddUpdateProduct />
    </motion.div>
  );
};

export default AdminProduct;