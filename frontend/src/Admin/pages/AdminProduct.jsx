import { Plus, Pencil, Trash2, Package, Menu } from "lucide-react";
import AddUpdateProduct from "../components/AddUpdateProduct";
import useAdminBear from "../../../store/admin.store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCloudinaryImage } from "../../../utils/getCloudinaryImage";

const AdminProduct = () => {
  const { adminGetproducts, products, setEditProduct } = useAdminBear(
    (state) => state,
  );
  const navigate = useNavigate();
  useEffect(() => {
    adminGetproducts();
  }, [adminGetproducts]);

  return (
    <div className="p-3 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package /> Products
        </h2>

        <label htmlFor="add_update_modal" className="btn btn-primary gap-2">
          <Plus size={18} /> Add Product
        </label>
      </div>

      {/* Products Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Extra Discount</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((item) => (
                  <tr
                    onClick={() =>
                      navigate(`/admin/products/details/${item._id}`)
                    }
                    className="cursor-pointer hover:bg-base-200"
                    key={item?.product_name}
                  >
                    <td>
                      <div className="avatar">
                        <div className="w-12 rounded bg-base-200">
                          <img
                            src={getCloudinaryImage(item?.product_images[0].secure_url, {
                              width: 200,
                              quality: 20,
                            })}
                            alt={item.product_name}
                            className="rounded-xl bg-gray-100"
                          />
                        </div>
                      </div>
                    </td>
                    <td>{item?.product_name}</td>
                    <td>{item?.price}</td>
                    <td>{item?.discount || 0}%</td>
                    <td>{item?.extra_discount || 0}%</td>
                    <td>{item?.final_price}</td>
                    <td>{item?.stock}</td>
                    <td>
                      {item?.stock > 0 && !item?.sold ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-error">Not Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddUpdateProduct />
    </div>
  );
};

export default AdminProduct;
