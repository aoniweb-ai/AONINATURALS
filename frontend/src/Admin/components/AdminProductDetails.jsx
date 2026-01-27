import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Pencil, 
  Trash2, 
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

const getFinalPrice = (price, discount = 0, extra = 0) =>
  Math.round(price - (price * discount) / 100 - (price * extra) / 100);

const AdminProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminGetAproduct, setEditProduct, product, setProductNull } = useAdminBear((state) => state);
  
  // Tab state for premium navigation
  const [activeTab, setActiveTab] = useState("Description");
  // Main image preview state
  const [selectedImg, setSelectedImg] = useState("");

  useEffect(() => {
    setProductNull();
    adminGetAproduct(id).catch((err) => toast.error(err));
  }, [adminGetAproduct, id]);

  useEffect(() => {
    if (product?.product_images?.length > 0) {
      setSelectedImg(product.product_images[0].secure_url);
    }
  }, [product]);

  if (!product) return <CenterLoader />;

  const finalPrice = getFinalPrice(product.price, product.discount, product.extra_discount);

  const tabLabels = ["Description", "Ingredients", "How to Use", "Benefits", "Recommended"];

  return (
    <section className="bg-[#f9fafb] min-h-screen p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- ULTRA-CLEAN HEADER --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all"
          >
            <ArrowLeft size={18} strokeWidth={3} />
            Back to Inventory
          </button>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <label
              onClick={() => setEditProduct(product)}
              htmlFor="add_update_modal"
              className="flex-1 sm:flex-none btn bg-black text-white hover:bg-neutral-800 border-none rounded-2xl px-6 shadow-xl shadow-black/10 transition-transform active:scale-95"
            >
              <Pencil size={16} /> Edit Product
            </label>
            <button className="flex-1 sm:flex-none btn btn-ghost text-red-500 hover:bg-red-50 rounded-2xl border border-red-50">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: IMAGE SHOWCASE --- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-[3rem] shadow-sm border border-gray-100">
                <div className="aspect-square bg-[#fbfbfb] rounded-[2.5rem] overflow-hidden group border border-gray-50">
                    <img
                        src={getCloudinaryImage(selectedImg || product.product_images[0]?.secure_url, { width: 800 })}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                        alt="Product"
                    />
                </div>
                {/* Modern Thumbnail Bar */}
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2 no-scrollbar">
                    {product.product_images.map((img, i) => (
                        <div 
                            key={i}
                            onClick={() => setSelectedImg(img.secure_url)}
                            className={`w-20 h-20 rounded-2xl cursor-pointer border-2 transition-all p-1 bg-white ${selectedImg === img.secure_url ? 'border-black scale-105 shadow-md' : 'border-transparent opacity-50'}`}
                        >
                            <img src={getCloudinaryImage(img.secure_url, { width: 150 })} className="w-full h-full object-cover rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* --- RIGHT: ESSENTIALS --- */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600">
                        <Sparkles size={16} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Organic</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                        {product.product_name}
                    </h1>
                </div>

                <div className="mt-8 flex items-end gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Price</p>
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter">₹{finalPrice}</h2>
                    </div>
                    <div className="mb-1">
                        <span className="text-xl text-gray-300 line-through font-bold">₹{product.price}</span>
                        <div className="mt-1 inline-flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-[10px] font-black tracking-tighter">
                            <BadgePercent size={12} />
                            {product.discount + (product.extra_discount || 0)}% SAVING
                        </div>
                    </div>
                </div>

                {/* Performance HUD */}
                <div className="grid grid-cols-3 gap-6 mt-12">
                    <div className="text-center p-4 rounded-3xl bg-gray-50 border border-gray-100">
                        <Boxes size={18} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-xl font-black text-gray-900">{product.stock}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Stock</p>
                    </div>
                    <div className="text-center p-4 rounded-3xl bg-gray-50 border border-gray-100">
                        <Users size={18} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-xl font-black text-gray-900">{product.buyers?.length || 0}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Buyers</p>
                    </div>
                    <div className="text-center p-4 rounded-3xl bg-gray-50 border border-gray-100">
                        <Truck size={18} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-xl font-black text-gray-900">₹{product.cod_charges}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">COD Cost</p>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Calendar size={14} /> Registered: {formatDateTime(product.createdAt)}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Layers size={14} /> Category: Wellness
                    </div>
                </div>
            </div>
          </div>

          {/* --- BOTTOM: LUXURY TABS --- */}
          <div className="lg:col-span-12">
            <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex bg-gray-50/50 p-2 overflow-x-auto no-scrollbar">
                    {tabLabels.map((label) => (
                        <button
                            key={label}
                            onClick={() => setActiveTab(label)}
                            className={`px-10 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                                activeTab === label 
                                ? 'bg-white text-black shadow-sm' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="p-10 lg:p-16">
                    <div className="max-w-4xl leading-[1.8] text-gray-600 text-lg animate-in fade-in slide-in-from-bottom-2">
                        {/* Dynamic content rendering based on activeTab */}
                        {activeTab === "Description" && product.description}
                        {activeTab === "Ingredients" && product.ingredients}
                        {activeTab === "How to Use" && product.how_to_use}
                        {activeTab === "Benefits" && product.benefits}
                        {activeTab === "Recommended" && product.recommended}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <AddUpdateProduct />
    </section>
  );
};

export default AdminProductDetails;