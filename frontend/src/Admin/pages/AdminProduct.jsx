import { Plus, Pencil, Trash2, Package, Menu } from "lucide-react";
import AddUpdateProduct from "../components/AddUpdateProduct";
import useAdminBear from "../../../store/admin.store";
import { useEffect } from "react";

const AdminProduct = () => {
  const { adminGetproducts, products, setEditProduct } = useAdminBear(
    (state) => state,
  );
  useEffect(() => {
    adminGetproducts();
  }, []);

  return (
    <div className="drawer-content flex flex-col gap-6 min-h-screen p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-none lg:hidden">
          <label htmlFor="admin-drawer" className="btn btn-ghost btn-square">
            <Menu />
          </label>
        </div>
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
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((item) => (
                  <tr key={item?.product_name}>
                    <td>
                      <div className="avatar">
                        <div className="w-12 rounded bg-base-200"></div>
                      </div>
                    </td>
                    <td>{item?.product_name}</td>
                    <td>{item?.price}</td>
                    <td>{item?.stock}</td>
                    <td>
                      {item?.stock > 0 && !item.sold ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-error">Not Active</span>
                      )}
                    </td>
                    <td className="text-right space-x-2">
                      <label
                        onClick={() => {
                          setEditProduct(item);
                        }}
                        htmlFor="add_update_modal"
                        className="btn btn-sm btn-outline"
                      >
                        <Pencil size={16} />
                      </label>
                      <button className="btn btn-sm btn-error btn-outline">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* <tr>
                  <td>
                    <div className="avatar">
                      <div className="w-12 rounded bg-base-200"></div>
                    </div>
                  </td>
                  <td>Onion Hair Oil</td>
                  <td>₹1,299</td>
                  <td>40</td>
                  <td>
                    <span className="badge badge-warning">Low Stock</span>
                  </td>
                  <td className="text-right space-x-2">
                    <button className="btn btn-sm btn-outline">
                      <Pencil size={16} />
                    </button>
                    <button className="btn btn-sm btn-error btn-outline">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr> */}
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
