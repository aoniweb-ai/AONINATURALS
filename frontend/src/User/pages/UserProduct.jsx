import { 
  RefreshCcw, 
  Search, 
  ShoppingCart, 
  Filter,
  ArrowRight
} from "lucide-react";
import useUserBear from "../../../store/user.store";
import { useNavigate } from "react-router-dom";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const UserProduct = () => {
  const { products, userGetProduct, userAddToCart } = useUserBear((state) => state);
  const [loader, setLoader] = useState(false);
  const [cartLoader, setCartLoader] = useState({}); // Track loader for specific product ID
  const navigate = useNavigate();

  // Initial Load
  useEffect(() => {
    if(!products || products.length === 0) {
      getProducts();
    }
  }, []);

  const getProducts = async () => {
    try {
      setLoader(true);
      await userGetProduct();
    } catch (error) {
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoader(false);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation(); // Card click hone se rokne ke liye
    try {
      setCartLoader((prev) => ({ ...prev, [product._id]: true }));
      await userAddToCart({
        id: product._id,
        quantity: 1,
      });
      toast.success("Added to bag! 🛍️");
    } catch (err) {
      toast.error(err?.message || "Could not add to cart");
    } finally {
      setCartLoader((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const truncateText = (text, length) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <section className="bg-[#f8f9fa] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Explore Collection
            </h1>
            <p className="text-gray-500 max-w-md text-sm md:text-base leading-relaxed">
              Premium essentials crafted for your daily routine. 
              Discover the perfect balance of quality and care.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={getProducts}
              className="bg-white border border-gray-200 p-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-gray-600"
              title="Refresh List"
            >
              <RefreshCcw size={20} className={loader ? "animate-spin" : ""} />
            </button>
            <button className="bg-black text-white p-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-black/20">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* --- PRODUCTS GRID --- */}
        {loader && (!products || products.length === 0) ? (
           <ProductSkeletonGrid />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products?.map((product) => {
              // Price Logic (Assuming backend sends final_price, or we calculate)
              const hasDiscount = product.discount > 0 || product.price > product.final_price;
              const displayPrice = product.final_price || product.price;

              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/products/details/${product._id}`)}
                  className="group relative bg-white rounded-3xl p-4 border border-transparent hover:border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f4f4f5] mb-4">
                    <img
                      src={getCloudinaryImage(product.product_images?.[0]?.secure_url, {
                        width: 500,
                        quality: 80,
                      })}
                      alt={product.product_name}
                      className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {hasDiscount && (
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-md">
                          Sale
                        </span>
                      )}
                      {(product.stock <= 0 || product.sold) && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-md">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* Quick Add Button (Visible on Hover/Mobile) */}
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={cartLoader[product._id] || (product.stock <= 0 || product.sold)}
                      className="absolute bottom-3 right-3 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cartLoader[product._id] ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <ShoppingCart size={18} />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.product_name}
                      </h3>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed h-8">
                      {truncateText(product.description, 55)}
                    </p>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Price</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-gray-900">
                            ₹{Math.round(displayPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through decoration-gray-300">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Mobile Only 'View' Icon or Arrow */}
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

// Simple Skeleton Component for better UX
const ProductSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-white p-4 rounded-3xl border border-gray-100 space-y-4">
          <div className="bg-gray-200 aspect-[4/5] rounded-2xl animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProduct;