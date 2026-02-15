import {
  RefreshCcw,
  ShoppingCart,
  Filter,
  ArrowRight,
  Sparkles,
  Tag
} from "lucide-react";
import useUserBear from "../../../store/user.store";
import { useNavigate } from "react-router-dom";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UserProduct = () => {
  const { products, userGetProduct, userAddToCart, user } = useUserBear(
    (state) => state
  );
  const [loader, setLoader] = useState(false);
  const [cartLoader, setCartLoader] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    userGetProduct();
  }, [userGetProduct]);

  const getProducts = async () => {
    try {
      setLoader(true);
      await userGetProduct();
    } catch (error) {
      toast.error(error || "Failed to fetch products");
    } finally {
      setLoader(false);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (!user) {
      toast("Create an account or login to add cart", { icon: "ℹ️" });
      return navigate("/login");
    }
    try {
      setCartLoader((prev) => ({ ...prev, [product._id]: true }));
      await userAddToCart({
        id: product._id,
        quantity: 1,
      });
      toast.success("Added to cart! 🛍️");
    } catch (err) {
      toast.error(err || "Could not add to cart");
    } finally {
      setCartLoader((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  return (
    <section className="bg-[#f8f9fa] min-h-screen font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-2">
              Explore Collection
            </h1>
            <p className="text-gray-500 max-w-md text-sm md:text-base leading-relaxed font-medium">
              Premium essentials crafted for your daily routine. Discover the
              perfect balance of quality and care.
            </p>
          </motion.div>

          {/* Action Bar */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="flex items-center gap-3 w-full md:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={getProducts}
              className="bg-white border border-gray-200 p-3 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-gray-600"
              title="Refresh List"
            >
              <RefreshCcw
                size={20}
                className={loader ? "animate-spin text-primary" : ""}
              />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white p-3 rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20"
            >
              <Filter size={20} />
            </motion.button>
          </motion.div>
        </div>

        {/* --- PRODUCTS GRID --- */}
        <AnimatePresence mode="wait">
          {loader && (!products || products?.length === 0) ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductSkeletonGrid />
            </motion.div>
          ) : products?.length === 0 ? (
            <EmptyState key="empty" onRefresh={getProducts} />
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              {products?.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  navigate={navigate} 
                  handleAddToCart={handleAddToCart}
                  cartLoader={cartLoader}
                  cardVariants={cardVariants}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const ProductCard = ({ product, navigate, handleAddToCart, cartLoader, cardVariants }) => {
  const hasDiscount = product.discount > 0 || product.price > product.final_price;
  const displayPrice = product.final_price || product.price;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      onClick={() => navigate(`/products/details/${product._id}`)}
      className="group relative bg-white rounded-4xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-[#f4f4f5] mb-5">
        <motion.img
          whileHover={{ scale: 1.1, rotate: 2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          src={getCloudinaryImage(
            product.product_images?.[0]?.secure_url,
            { width: 500, quality: 80 }
          )}
          alt={product.product_name}
          className="w-full h-full object-contain p-6 mix-blend-multiply"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {hasDiscount && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1"
            >
              <Tag size={10} /> Sale
            </motion.span>
          )}
          {(product.stock <= 0 || product.sold) && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Sold Out
            </span>
          )}
        </div>

        {/* Floating Add To Cart Button */}
        <motion.button
          onClick={(e) => handleAddToCart(e, product)}
          disabled={cartLoader[product._id] || product.stock <= 0 || product.sold}
          whileTap={{ scale: 0.8 }}
          className="absolute bottom-4 right-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed z-20"
        >
          {cartLoader[product._id] ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <ShoppingCart size={20} strokeWidth={2.5} />
          )}
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-1 px-1">
        <div className="flex flex-col justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
            {product.product_name}
          </h3>
          {product?.discount > 0 && (
             <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md mt-1">
                {product?.discount}% {product?.extra_discount && `+ ${product.extra_discount}%`} OFF
             </span>
          )}
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-10 mb-2">
           {product.description}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-gray-900">
                ₹{Math.round(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through decoration-gray-300 decoration-2">
                  ₹{product.price}
                </span>
              )}
            </div>
          </div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-300"
          >
            <ArrowRight size={18} strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Skeleton Loader ---
const ProductSkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="bg-white p-4 rounded-4xl border border-gray-100 space-y-4 shadow-sm">
        <div className="bg-gray-100 aspect-4/5 rounded-3xl animate-pulse w-full"></div>
        <div className="space-y-3 px-2">
          <div className="h-5 bg-gray-100 rounded-lg w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded-lg w-full animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded-lg w-1/2 animate-pulse"></div>
        </div>
        <div className="flex justify-between items-center pt-2 px-2">
          <div className="h-8 bg-gray-100 rounded-lg w-1/3 animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ onRefresh }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingCart size={40} className="text-gray-300" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
    <p className="text-gray-500 mb-6 max-w-sm">We couldn't find any products at the moment. Try refreshing the page.</p>
    <button onClick={onRefresh} className="btn bg-black text-white rounded-xl">
        Refresh Page
    </button>
  </motion.div>
);

export default UserProduct;