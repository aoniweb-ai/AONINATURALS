import { 
  ShoppingCart, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Leaf, 
  ShieldCheck, 
  Droplets, 
  Quote
} from "lucide-react";
import Hero from "../components/Hero";
import useUserBear from "../../../store/user.store";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

const UserHome = () => {
  const { products, userAddToCart, user } = useUserBear((state) => state);
  const [loader,setLoader] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e, id) => {
    e.stopPropagation();
    try {
      setLoader(true)
      await userAddToCart({ id, quantity: 1 });
      toast.success("Added to cart");
    } catch (error) {
      if(error=="Unauthorized"){
        toast("Create your account and Login first",{icon:'🔑'})
        navigate('/login')
      }
    } finally{
      setLoader(false);
    }
  };

  // Features Data with Icons
  const features = [
    { icon: <Leaf className="text-emerald-500" />, title: "100% Natural", desc: "Pure organic ingredients" },
    { icon: <ShieldCheck className="text-blue-500" />, title: "No Chemicals", desc: "Paraben & Sulfate free" },
    { icon: <ArrowRight className="text-orange-500" />, title: "Fast Results", desc: "Visible change in weeks" },
    { icon: <Droplets className="text-cyan-500" />, title: "Clinically Tested", desc: "Dermatologist approved" },
  ];

  return (
    <div className="w-full font-sans bg-white">
      <Hero />

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-500">We blend nature's finest ingredients to create products that actually work.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 p-8 rounded-4xl hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS (ZIG-ZAG LAYOUT) --- */}
      <section className="py-24 bg-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Our Collection</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">Featured Products</h2>
          </div>
          {products?.slice(0, 3).map((item, index) => { // Showing top 3 only to keep home clean
             const isEven = index % 2 === 0;
             return (
              <div 
                key={item._id} 
                onClick={() => navigate(`/products/details/${item._id}`)}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center sm:gap-12 lg:gap-24 group cursor-pointer`}
              >
                {/* Image Side */}
                <div className="w-full  lg:w-1/2 relative">
                  <div className={`absolute inset-0 bg-linear-to-tr ${isEven ? 'from-emerald-50 to-transparent' : 'from-blue-50 to-transparent'} rounded-[3rem] -rotate-3 group-hover:rotate-0 transition-transform duration-500`}></div>
                  <div className="relative bg-base-200 border border-gray-100 rounded-[2.5rem] p-2 md:p-12 shadow-2xl shadow-gray-200/50">
                    <img
                      src={getCloudinaryImage(item.product_images[0]?.secure_url, {
                        width: 600,
                        quality: 80,
                      })}
                      alt={item.product_name}
                      className="w-full h-80 md:h-100 object-contain drop-shadow-lg transition-transform duration-700 group-hover:scale-105"
                    />
                    {item.discount > 0 && (
                      <div className="absolute top-8 right-8 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                        {item.discount+item?.extra_discount}% OFF
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 bg- space-y-2 text-center lg:text-left">
                  <div className="space-y-2">
                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                      {item?.product_name}
                    </h3>
                    <span className=" badge badge-accent text-accent-content font-bold text-sm">
                {item.discount }% {item?.extra_discount &&  '+ '+item.extra_discount} OFF
              </span>
                  </div>

                  <p className="text-gray-500 text-lg leading-relaxed line-clamp-3">
                    {item?.description}
                  </p>

                  <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                    <div>
                      <span className="text-3xl font-black text-gray-900">₹{Math.round(item?.final_price)}</span>
                      {item.price > item.final_price && (
                        <span className="block text-sm text-gray-400 line-through decoration-gray-300">
                          MRP: ₹{item?.price}
                        </span>
                      )}
                    </div>
                    
                    <button 
                      onClick={(e) => (item.stock>0 && !item.sold) && handleAddToCart(e, item._id)}
                      className={`ml-4 bg-black ${(item.stock<=0 || item.sold) && 'cursor-not-allowed '} text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-gray-800 hover:gap-4 transition-all active:scale-95 shadow-xl shadow-black/10`}
                    >
                      Add to Cart {loader ? <span className="loading loading-spinner loading-sm"></span> : <ArrowRight size={18} />} 
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* View All Button */}
          <div className="flex justify-center pt-10">
            <button 
              onClick={() =>{
                if(!user) return navigate('/login');
                 navigate('/products')
              }}
              className="border-2 border-black text-black px-10 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-sm"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Real Stories, Real Results ❤️</h2>
            <p className="text-gray-400">Join thousands of happy customers transforming their hair care routine.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "My hair fall stopped completely within 2 weeks. The scent is also very soothing!", name: "Anjali S." },
              { text: "Best organic oil I've ever used. Non-sticky and gives a great shine.", name: "Rahul M." },
              { text: "Highly recommended! The delivery was super fast and packaging was premium.", name: "Sneha K." },
            ].map((review, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl relative hover:-translate-y-2 transition-transform duration-300">
                <Quote className="absolute top-6 right-6 text-white/20" size={40} />
                <div className="flex gap-1 text-emerald-400 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{review.name}</p>
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle2 size={12} /> Verified Buyer
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER / CTA --- */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Ready to transform your hair?</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Subscribe to our newsletter for exclusive tips, early access to new products, and special discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
            <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-black text-gray-900 mb-4">HERBAL OIL.</h3>
            <p className="text-gray-500 max-w-xs leading-relaxed">
              Crafting pure, organic solutions for your hair care needs. Born from nature, backed by science.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li className="hover:text-black cursor-pointer">All Products</li>
              <li className="hover:text-black cursor-pointer">Best Sellers</li>
              <li className="hover:text-black cursor-pointer">New Arrivals</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li className="hover:text-black cursor-pointer">Track Order</li>
              <li className="hover:text-black cursor-pointer">Contact Us</li>
              <li className="hover:text-black cursor-pointer">Shipping Policy</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm border-t border-gray-100 pt-8">
          © 2026 Herbal Oil. All Rights Reserved. Made with ❤️
        </div>
      </footer>
    </div>
  );
};

export default UserHome;