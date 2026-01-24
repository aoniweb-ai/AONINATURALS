import { Menu, ShoppingCart, Star } from "lucide-react";
import Hero from "../components/Hero";

const UserHome = () => {
  return (
    <div className="w-full">
      
      <Hero/>

      
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "100% Natural",
            "No Chemicals",
            "Fast Hair Growth",
            "Clinically Tested",
          ].map((item, i) => (
            <div
              key={i}
              className="border rounded-xl p-6 text-center hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg">{item}</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Trusted by thousands of happy users.
              </p>
            </div>
          ))}
        </div>
      </section>

      
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          <img
            src="/product.png"
            alt="product"
            className="w-70 mx-auto"
          />

          <div>
            <h2 className="text-3xl font-bold">Herbal Hair Oil</h2>
            <p className="text-gray-600 mt-3">
              Reduce hair fall, nourish roots & promote growth naturally.
            </p>

            <p className="mt-4 text-2xl font-semibold text-emerald-600">
              ₹499
            </p>

            <button className="mt-6 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl">
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>

        </div>
      </section>

      
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            What Our Customers Say ❤️
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-xl p-6">
                <div className="flex gap-1 text-yellow-400 mb-2">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600">
                  “Amazing product! Hair fall reduced in just few weeks.”
                </p>
                <p className="mt-3 font-semibold">— Verified User</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <footer className="bg-black text-gray-300 py-6 text-center">
        © 2026 Herbal Oil. All Rights Reserved.
      </footer>

    </div>
  );
};

export default UserHome;
