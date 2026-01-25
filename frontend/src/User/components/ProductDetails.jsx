import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Heart, RefreshCcw, ArrowLeft } from "lucide-react";
import useUserBear from "../../../store/user.store";
import { useNavigate, useParams } from "react-router-dom";
import ProductDetailsSkeleton from "./Skeleton/ProductDetailsSkeleton";
import toast from "react-hot-toast";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";

const ProductDetails = () => {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const cartQuantityRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [refreshLoader, setRefreshLoader] = useState(false);

  const { userGetaProduct, userAddToCart, product, setProduct } = useUserBear(
    (state) => state,
  );
  const { id } = useParams();

  useEffect(() => {
    setProduct(null);
    userGetaProduct(id)
      .then((res) => {

      })
      .catch((error) => {
        toast.error(error);
      });
  }, [id, userGetaProduct]);

  const addToCartProduct = async () => {
    try {
      setLoader(true);
      await userAddToCart({
        id,
        quantity: Number(cartQuantityRef.current.innerText),
      });
      toast.success("Item added to your cart 😀");
    } catch (error) {
      toast.error(error);
    } finally {
      setLoader(false);
    }
  };

  // TABS
  const tabs = [
    {
      key: "description",
      label: "Description",
      content: product?.description,
    },
    {
      key: "ingredients",
      label: "Ingredients",
      content: product?.ingredients,
    },
    { key: "how", label: "How to Use", content: product?.how_to_use },
    { key: "benefits", label: "Benefits", content: product?.benefits },
    {
      key: "recommended",
      label: "Recommended",
      content: product?.recommended,
    },
  ];

  const getProduct = async () => {
    try {
      setRefreshLoader(true);
      await userGetaProduct(id);
    } catch (error) {
      toast.error(error);
    } finally {
      setRefreshLoader(false);
    }
  };

  if (!product) {
    return <ProductDetailsSkeleton />;
  }else{
    return (
      <section className="bg-white min-h-screen">
        {/* TOP SECTION */}
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div
            className="mt-3 btn btn-link w-fit cursor-pointer"
            onClick={getProduct}
          >
            <span className="flex text-accent-content items-center gap-3">
              Refresh{" "}
              {refreshLoader ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <RefreshCcw size={20} />
              )}{" "}
            </span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* IMAGE */}
            <div className="bg-gray-50 rounded-3xl flex items-center justify-center p-6">
              <div className="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">
                {product?.product_images?.map((img) => (
                  <div key={img.public_id} className="carousel-item">
                    <img
                      src={getCloudinaryImage(img.secure_url, {
                        width: 800,
                        quality: 90,
                      })}
                      alt={product.product_name}
                      className="w-[320px] sm:w-95 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
  
            {/* DETAILS */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                {product?.product_name}
              </h1>
  
              {/* PRICE */}
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    ₹{Math.round(product.final_price)}
                  </span>
  
                  {(product?.discount || product?.extra_discount) && (
                    <span className="line-through text-gray-400">
                      ₹{product.price}
                    </span>
                  )}
                </div>
  
                {(product?.discount || product?.extra_discount) && (
                  <p className="text-sm text-green-600 mt-1">
                    {product?.discount || 0}% + {product?.extra_discount || 0}%
                    OFF
                  </p>
                )}
  
                {product?.cod_charges > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    COD Charges: ₹{product?.cod_charges}
                  </p>
                )}
              </div>
  
              {/* QUANTITY */}
              { (product.stock > 0 && !product.sold)  &&<div className="flex items-center gap-4 mt-8">
                <span className="font-medium">Quantity</span>
                <div className="flex items-center border rounded-xl overflow-hidden">
                  <button
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                  >
                    −
                  </button>
                  <span ref={cartQuantityRef} className="px-4">
                    {qty}
                  </span>
                  <button className="px-4 py-2 cursor-pointer" onClick={() => product.stock > qty && setQty(qty + 1)}>
                    +
                  </button>
                </div>
              </div>}
  
              {/* ACTIONS */}
              {product.stock > 0 && !product.sold ? (
                loader ? (
                  <div className="hidden sm:flex gap-4 mt-10">
                    <button
                      className={` ${loader ? "cursor-progress" : ""} flex-1 bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition`}
                    >
                      <ShoppingCart size={18} />{" "}
                      <span className="loading loading-dots loading-xl"></span>
                    </button>
                  </div>
                ) : (
                  <div className="hidden sm:flex gap-4 mt-10">
                    <button
                      onClick={addToCartProduct}
                      className="flex-1 cursor-pointer bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition"
                    >
                      <ShoppingCart size={18} /> Add to Cart
                    </button>
                  </div>
                )
              ) : (
                <div className="mt-10 hidden sm:block text-center">
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
            </div>
          </div>
        </div>
  
        {/* TABS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex flex-wrap gap-3 border-b pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "bg-blue-100 text-blue-600 border border-blue-400"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
  
          <div className="mt-6 text-gray-700 leading-relaxed text-sm sm:text-base">
            {tabs.find((tab) => tab.key === activeTab)?.content}
          </div>
        </div>
  
        {/* MOBILE BAR */}
        {product.stock > 0 && !product.sold ? (
          loader ? (
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3">
              <button
                className={` ${loader ? "cursor-progress" : ""} flex-1 bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition`}
              >
                <ShoppingCart size={18} />{" "}
                <span className="loading loading-dots loading-xl"></span>
              </button>
            </div>
          ) : (
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3">
              <button
                onClick={addToCartProduct}
                className="flex-1 cursor-pointer bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          )
        ) : (
          <div className="mt-10 sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 text-center">
            <span className="text-red-600 font-medium">Out of Stock</span>
          </div>
        )}
      </section>
    )
  }

};

export default ProductDetails;
