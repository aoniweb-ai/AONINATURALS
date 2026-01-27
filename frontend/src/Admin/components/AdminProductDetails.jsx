import { useEffect, } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2, ArrowLeft, Users, Boxes } from "lucide-react";
import toast from "react-hot-toast";
import useAdminBear from "../../../store/admin.store";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";
import CenterLoader from "../../../components/CenterLoader";
import AddUpdateProduct from "./AddUpdateProduct";

const getFinalPrice = (price, discount = 0, extra = 0) =>
  Math.round(price - (price * discount) / 100 - (price * extra) / 100);

const AdminProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminGetAproduct, setEditProduct, product } = useAdminBear((state) => state);

  useEffect(() => {
    adminGetAproduct(id)
    .catch((err)=>{
      toast.error(err)
    })
  }, [adminGetAproduct, id]);

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        <CenterLoader />
      </div>
    );
  }

  const finalPrice = getFinalPrice(
    product.price,
    product.discount,
    product.extra_discount,
  );

  return (
    <section className="bg-gray-50 min-h-screen p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black cursor-pointer"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex gap-3">
          <label
            onClick={() => {
                setEditProduct(product);
            }}
            htmlFor="add_update_modal"
            className="btn btn-sm btn-outline"
          >
            <Pencil size={16} />
          </label>

          <button
            // onClick={handleDelete}
            className="btn btn-error gap-2"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="bg-white rounded-2xl p-6 grid lg:grid-cols-2 gap-10">
        {/* IMAGES */}
        <div className="space-y-4">
          <div className="carousel carousel-vertical rounded-box h-96">
            {product.product_images.map((img, i) => (
              <div key={i} className="carousel-item h-full">
                <img
                  src={getCloudinaryImage(img.secure_url, {
                    width: 600,
                    quality: 80,
                  })}
                  alt={product.product_name}
                  className="rounded-xl bg-gray-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          <h1 className="text-3xl font-semibold">{product.product_name}</h1>

          <div className="mt-4 space-y-1">
            <p className="text-lg font-bold">
              ₹{finalPrice}
              <span className="line-through text-gray-400 text-sm ml-2">
                ₹{product.price}
              </span>
            </p>

            <p className="text-sm text-green-600">
              {product.discount || 0}% + {product.extra_discount || 0}% discount
            </p>

            <p className="text-sm text-gray-500">
              COD Charges: ₹{product.cod_charges}
            </p>
          </div>

          {/* META */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-sm text-gray-500">Stock</p>
              <p className="text-lg font-semibold">{product.stock}</p>
            </div>

            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-sm text-gray-500">Buyers</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <Users size={18} />
                {product.buyers?.length || 0}
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 text-xs text-gray-400 flex items-center gap-2">
            <Boxes size={14} />
            Created on {new Date(product.createdAt).toLocaleDateString("en-IN")}
          </div>
        </div>
      </div>
      <div>
        {/* name of each tab group should be unique */}
        <div className="tabs tabs-lift">
          <label className="tab">
            <input type="radio" name="my_tabs_4" defaultChecked />
            <p>Description</p>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {product.description}
          </div>

          <label className="tab">
            <input type="radio" name="my_tabs_4" />
            <p>Ingredients</p>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {product.ingredients}
          </div>

          <label className="tab">
            <input type="radio" name="my_tabs_4" />
            <p>How to Use</p>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {product.how_to_use}
          </div>
          <label className="tab">
            <input type="radio" name="my_tabs_4" />
            <p>Benefits</p>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {product.benefits}
          </div>
          <label className="tab">
            <input type="radio" name="my_tabs_4" />
            <p>Recommended</p>
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {product.recommended}
          </div>
        </div>
      </div>
      <AddUpdateProduct />
    </section>
  );
};

export default AdminProductDetails;
