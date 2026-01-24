import { RefreshCcw, } from "lucide-react";
import useUserBear from "../../../store/user.store";
import { useNavigate } from "react-router-dom";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import toast from "react-hot-toast";
import { useState } from "react";

const UserProduct = () => {
  const { products, userGetProduct } = useUserBear((state) => state);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const getProducts = async()=>{
    try {
      setLoader(true)
      await userGetProduct();
    } catch (error) {
      toast.error(error);
    } finally{
      setLoader(false);
    }
  }
  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Shop Products
          </h1>
          <p className="mt-2 text-gray-500 max-w-xl">
            Thoughtfully crafted products for stronger, healthier hair.
          </p>
          <div className="flex justify-end">
            <div className="mt-3 btn btn-link w-fit cursor-pointer"
            onClick={getProducts}
          >
            <span className="flex text-accent-content items-center gap-3">Refresh {loader ? (<span className="loading loading-spinner loading-sm"></span>) : (<RefreshCcw size={20}/>)} </span> 
          </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products?.map((product) => (
            <div
              onClick={() => {
                navigate(`/products/details/${product._id}`);
              }}
              key={product._id}
              className="group cursor-pointer"
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-3xl bg-gray-50">
                <img
                  src={getCloudinaryImage(
                    product.product_images[0]?.secure_url,
                    {
                      width: 300,
                      quality: 50,
                    },
                  ) || null}
                  alt={product.product_name}
                  className="w-full h-80 object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {/* DESKTOP HOVER CTA (OPTIONAL, NICE TOUCH) */}
                <div className="hidden lg:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition items-center justify-center">
                  <button className="bg-white text-black px-6 py-3 rounded-full font-medium">
                    Quick View
                  </button>
                </div>
              </div>

              {/* INFO */}
              <div className="mt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium">
                      {product.product_name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.description}
                    </p>
                  </div>

                  <span className="text-lg font-semibold">
                    ₹{product.price}
                  </span>
                </div>

                {/* ADD TO CART – DESKTOP + MOBILE */}
                <button className="mt-4 w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserProduct;
