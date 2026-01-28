import { Plus, Package, ExternalLink, Hash, IndianRupee, Layers } from "lucide-react";
import AddUpdateProduct from "../components/AddUpdateProduct";
import useAdminBear from "../../../store/admin.store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";

const AdminProduct = () => {
  const { adminGetproducts, products } = useAdminBear((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    adminGetproducts();
  }, [adminGetproducts]);

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 bg-[#fcfcfc] min-h-screen">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
               <Package size={28} />
            </div>
            Products
          </h2>
          <p className="text-slate-500 font-medium ml-14 -mt-1">
            Manage your inventory and stock levels
          </p>
        </div>

        <label 
          htmlFor="add_update_modal" 
          className="btn btn-primary px-8 rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20 normal-case hover:scale-105 transition-all"
        >
          <Plus size={20} strokeWidth={3} /> 
          Add New Product
        </label>
      </div>

      {/* --- TABLE CARD --- */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full border-separate border-spacing-0">
            {/* HEAD */}
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 pl-8 text-slate-500 font-bold uppercase text-[11px] tracking-widest border-b border-gray-100">Product</th>
                <th className="text-slate-500 font-bold uppercase text-[11px] tracking-widest border-b border-gray-100 text-center">Price Details</th>
                <th className="text-slate-500 font-bold uppercase text-[11px] tracking-widest border-b border-gray-100 text-center">Discount</th>
                <th className="text-slate-500 font-bold uppercase text-[11px] tracking-widest border-b border-gray-100 text-center">Inventory</th>
                <th className="text-slate-500 font-bold uppercase text-[11px] tracking-widest border-b border-gray-100 text-center">Status</th>
                <th className="pr-8 text-slate-500 font-bold uppercase text-[11px] tracking-widest border-b border-gray-100 text-right">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-50">
              {products?.map((item) => (
                <tr 
                  key={item?._id}
                  className="group bg-white hover:bg-slate-50/80 transition-colors cursor-default"
                >
                  {/* Product Info */}
                  <td className="py-4 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 group-hover:scale-110 transition-transform">
                          <img
                            src={getCloudinaryImage(item?.product_images[0]?.secure_url, {
                              width: 200,
                              quality: 50,
                            })}
                            alt={item.product_name}
                            className="object-contain p-1"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-base line-clamp-1">{item?.product_name}</div>
                        <div className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-0.5 uppercase">
                           <Hash size={10} /> {item?._id?.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black text-slate-900">₹{item?.final_price}</span>
                      <span className="text-xs font-bold text-slate-400 line-through">₹{item?.price}</span>
                    </div>
                  </td>

                  {/* Discount Badges */}
                  <td className="text-center">
                    <div className="flex flex-col gap-1 items-center">
                      <span className="badge badge-sm bg-emerald-50 text-emerald-600 border-none font-bold">-{item?.discount || 0}% Reg.</span>
                      {item?.extra_discount > 0 && (
                        <span className="badge badge-sm bg-blue-50 text-blue-600 border-none font-bold">-{item?.extra_discount}% Extra</span>
                      )}
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5 font-black text-slate-700">
                        <Layers size={14} className="text-slate-400" />
                        {item?.stock}
                      </div>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${Math.min(item.stock, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="text-center">
                    {item?.stock > 0 && !item?.sold ? (
                      <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-xs uppercase bg-emerald-50 px-3 py-1.5 rounded-full w-fit mx-auto">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        Active
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 text-rose-600 font-bold text-xs uppercase bg-rose-50 px-3 py-1.5 rounded-full w-fit mx-auto">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                        Inactive
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="pr-8 text-right ">
                    <button
                      onClick={() => navigate(`/admin/products/details/${item._id}`)}
                      className="p-2.5 bg-slate-100 cursor-pointer text-slate-600 hover:bg-slate-900 hover:text-white rounded-xl transition-all inline-flex items-center gap-2 group/btn"
                    >
                      <span className="text-xs font-bold px-1 overflow-hidden w-0 group-hover/btn:w-16 transition-all duration-300">View Details</span>
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddUpdateProduct />
    </div>
  );
};

export default AdminProduct;