import {
  ShoppingCart,
  Star,
  ArrowRight,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Droplets,
  Quote,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import Hero from "../components/Hero"; // Assuming this is your existing Hero
import useUserBear from "../../../store/user.store";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";

const UserHome = () => {
  const { products, userAddToCart, user } = useUserBear((state) => state);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e, id) => {
    e.stopPropagation();
    if (!user) {
      toast("Create an account or login to add cart", { icon: 'ℹ️' });
      return navigate("/login");
    }
    try {
      setLoader(true);
      await userAddToCart({ id, quantity: 1 });
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  const truncateText = (text, length) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // --- ANIMATION VARIANTS ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const features = [
    { icon: <Leaf className="text-emerald-500" />, title: "100% Natural", desc: "Pure organic ingredients sourced from nature." },
    { icon: <ShieldCheck className="text-blue-500" />, title: "No Chemicals", desc: "Completely Paraben, Sulfate & Silicone free." },
    { icon: <Sparkles className="text-orange-500" />, title: "Fast Results", desc: "Visible improvement in texture within 2 weeks." },
    { icon: <Droplets className="text-cyan-500" />, title: "Clinically Tested", desc: "Dermatologist approved for all hair types." },
  ];

  return (
    <div className="w-full font-sans bg-white overflow-x-hidden">
      <Hero />

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-2 block">Our Promise</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              Why Choose Herbal Oil?
            </h2>
            <p className="text-gray-500 text-lg">
              We don't just sell oil; we sell confidence, purity, and the ancient wisdom of Ayurveda bottled for modern needs.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-gray-50/50 border border-gray-100 p-8 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-gray-50">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS (ZIG-ZAG LAYOUT) --- */}
      <section className="py-24 bg-gray-50/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center"
          >
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">
              Our Collection
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
              Featured Products
            </h2>
          </motion.div>

          {products?.slice(0, 3).map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                key={item._id}
                onClick={() => navigate(`/products/details/${item._id}`)}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-24 group cursor-pointer`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative perspective-1000">
                  {/* Abstract Background Blob */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr ${isEven ? "from-emerald-100/50 to-transparent" : "from-blue-100/50 to-transparent"} rounded-full blur-3xl -z-10`} />
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-white/60 backdrop-blur-sm border border-white/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 overflow-hidden"
                  >
                    <motion.img
                      // Floating Animation
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      src={getCloudinaryImage(
                        item.product_images[0]?.secure_url,
                        { width: 600, quality: 90 }
                      )}
                      alt={item.product_name}
                      className="w-full h-80 md:h-[400px] object-contain drop-shadow-xl z-10 relative"
                    />
                    
                    {item.discount > 0 && (
                      <div className="absolute top-6 right-6 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest z-20">
                        {item.discount}%{item?.extra_discount && ' + '+item.extra_discount+'%'} OFF
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                  <div>
                     <h3 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-2 group-hover:text-gray-700 transition-colors">
                      {item?.product_name}
                    </h3>
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                         <div className="flex text-yellow-400">
                             <Star size={16} fill="currentColor"/>
                             <Star size={16} fill="currentColor"/>
                             <Star size={16} fill="currentColor"/>
                             <Star size={16} fill="currentColor"/>
                             <Star size={16} fill="currentColor"/>
                         </div>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Best Seller</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-lg leading-relaxed line-clamp-3">
                    {truncateText(item?.description, 180)}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                    <div className="flex flex-col items-center lg:items-start">
                      <span className="text-4xl font-black text-gray-900">
                        ₹{Math.round(item?.final_price)}
                      </span>
                      {item.price > item.final_price && (
                        <span className="text-sm text-gray-400 font-medium  ">
                          MRP: <span className="line-through decoration-red-300">₹{item?.price}</span>
                        </span>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) =>
                        item.stock > 0 && !item.sold && handleAddToCart(e, item._id)
                      }
                      disabled={item.stock <= 0 || item.sold}
                      className={`px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all shadow-xl shadow-black/5 ${
                          (item.stock <= 0 || item.sold) 
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                          : "bg-black text-white hover:bg-gray-900"
                      }`}
                    >
                      {loader ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <>
                          Add to Cart <ShoppingCart size={18} strokeWidth={2.5} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <div className="flex justify-center pt-8">
            <motion.button
              whileHover={{ scale: 1.05, gap: "12px" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="group flex items-center gap-2 border-2 border-black text-black px-10 py-4 rounded-full font-bold hover:bg-black hover:text-white transition-all uppercase tracking-widest text-sm"
            >
              View All Collection
              <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
            </motion.button>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS (Dark Mode) --- */}
      <section className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px]" 
        />
        <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" 
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              Real Stories, Real Results ❤️
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Join thousands of happy customers transforming their hair care routine with our natural formulas.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { text: "My hair fall stopped completely within 2 weeks. The scent is also very soothing and natural.", name: "Anjali S.", bg: "from-emerald-400 to-green-500" },
              { text: "Best organic oil I've ever used. It's non-sticky, absorbs quickly and gives a great shine.", name: "Rahul M.", bg: "from-blue-400 to-indigo-500" },
              { text: "Highly recommended! The delivery was super fast and the packaging feels so premium.", name: "Sneha K.", bg: "from-purple-400 to-pink-500" },
            ].map((review, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl relative hover:bg-white/10 transition-colors"
              >
                <Quote className="absolute top-8 right-8 text-white/10 rotate-180" size={48} />
                
                <div className="flex gap-1 text-yellow-400 mb-6">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={18} fill="currentColor" />)}
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-8 text-lg font-light">
                  "{review.text}"
                </p>
                
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${review.bg} rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg`}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">
                      {review.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium uppercase tracking-wider">
                      <CheckCircle2 size={12} /> Verified Buyer
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="py-24 bg-emerald-50">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
            Unlock 10% Off Your First Order
          </h2>
          <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg">
            Subscribe to our newsletter for exclusive tips, early access to new products, and secret discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white"
            />
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-xl shadow-black/10"
            >
              Subscribe
            </motion.button>
          </div>
          <p className="text-xs text-gray-400 mt-4">No spam, ever. Unsubscribe anytime.</p>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
              HERBAL OIL.
            </h3>
            <p className="text-gray-500 max-w-xs leading-relaxed text-sm">
              Crafting pure, organic solutions for your hair care needs. Born from nature, backed by science, made for you.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Shop</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">All Products</li>
              <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Best Sellers</li>
              <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">New Arrivals</li>
              <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Combos</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Track Order</li>
              <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Contact Us</li>
              <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Shipping Policy</li>
              <li className="hover:text-black cursor-pointer hover:translate-x-1 transition-transform">Returns</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6 gap-4">
            <span>© 2026 Herbal Oil. All Rights Reserved.</span>
            <span className="flex items-center gap-1">Made with <span className="text-red-500 animate-pulse">❤️</span> in India</span>
        </div>
      </footer>
    </div>
  );
};

export default UserHome;