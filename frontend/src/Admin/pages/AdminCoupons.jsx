import { useEffect, useState } from "react";
import {
  Plus,
  Ticket,
  Trash2,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Percent,
  IndianRupee,
  Clock,
  Hash,
  X,
  Tag,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import useAdminBear from "../../../store/admin.store";
import toast from "react-hot-toast";
import CenterLoader from "../../../components/CenterLoader";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { formatDateTime } from "../../../utils/formatDateTime";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 12 },
  },
};

const AdminCoupons = () => {
  const {
    coupons,
    editCoupon,
    setEditCoupon,
    adminGetCoupons,
    adminCoupon_addUpdate,
    adminDeleteCoupon,
    adminToggleCoupon,
  } = useAdminBear((state) => state);

  const [loader, setLoader] = useState(true);
  const [formLoader, setFormLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiry, setExpiry] = useState("");
  const [active, setActive] = useState(true);
  const [description, setDescription] = useState("");

  useEffect(() => {
    adminGetCoupons()
      .catch((err) => toast.error(err))
      .finally(() => setLoader(false));
  }, [adminGetCoupons]);

  // Populate form when editing
  useEffect(() => {
    if (editCoupon) {
      setCode(editCoupon.code || "");
      setDiscountType(editCoupon.discount_type || "percent");
      setDiscountValue(editCoupon.discount_value || "");
      setMinOrderAmount(editCoupon.min_order_amount || "");
      setMaxDiscount(editCoupon.max_discount || "");
      setUsageLimit(editCoupon.usage_limit || "");
      setExpiry(
        editCoupon.expiry
          ? new Date(editCoupon.expiry).toISOString().slice(0, 16)
          : ""
      );
      setActive(editCoupon.active);
      setDescription(editCoupon.description || "");
      setShowModal(true);
    }
  }, [editCoupon]);

  const resetForm = () => {
    setCode("");
    setDiscountType("percent");
    setDiscountValue("");
    setMinOrderAmount("");
    setMaxDiscount("");
    setUsageLimit("");
    setExpiry("");
    setActive(true);
    setDescription("");
    setEditCoupon(null);
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return toast.error("Coupon code is required");
    if (!discountValue || discountValue <= 0)
      return toast.error("Discount value must be greater than 0");
    if (discountType === "percent" && discountValue > 100)
      return toast.error("Percent discount cannot exceed 100");

    try {
      setFormLoader(true);
      await adminCoupon_addUpdate({
        coupon_id: editCoupon?._id || null,
        code,
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order_amount: Number(minOrderAmount) || 0,
        max_discount: maxDiscount ? Number(maxDiscount) : null,
        usage_limit: usageLimit ? Number(usageLimit) : null,
        expiry: expiry || null,
        active,
        description,
      });
      toast.success(editCoupon ? "Coupon updated!" : "Coupon created!");
      closeModal();
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setFormLoader(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await adminDeleteCoupon(id);
      toast.success("Coupon deleted");
    } catch (error) {
      toast.error(error || "Delete failed");
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminToggleCoupon(id);
    } catch (error) {
      toast.error(error || "Toggle failed");
    }
  };

  if (loader) return <CenterLoader />;

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      {/* Header */}
      <Motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="navbar bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-4 lg:px-8"
      >
        <div className="flex-1">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Ticket size={22} /> Coupons
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Manage Discount Coupons
            </p>
          </div>
        </div>
        <Motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openNewModal}
          className="btn btn-sm bg-black text-white hover:bg-gray-800 rounded-lg capitalize shadow-lg shadow-black/10 border-none"
        >
          <Plus size={16} /> New Coupon
        </Motion.button>
      </Motion.nav>

      {/* Stats */}
      <Motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Motion.div
            variants={itemVariants}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center"
          >
            <p className="text-2xl font-black text-gray-900">
              {coupons?.length || 0}
            </p>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Total Coupons
            </p>
          </Motion.div>
          <Motion.div
            variants={itemVariants}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center"
          >
            <p className="text-2xl font-black text-emerald-600">
              {coupons?.filter((c) => c.active)?.length || 0}
            </p>
            <p className="text-xs text-gray-400 font-medium mt-1">Active</p>
          </Motion.div>
          <Motion.div
            variants={itemVariants}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center"
          >
            <p className="text-2xl font-black text-red-500">
              {coupons?.filter((c) => !c.active)?.length || 0}
            </p>
            <p className="text-xs text-gray-400 font-medium mt-1">Inactive</p>
          </Motion.div>
          <Motion.div
            variants={itemVariants}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center"
          >
            <p className="text-2xl font-black text-blue-600">
              {coupons?.reduce((a, c) => a + (c.used_count || 0), 0) || 0}
            </p>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Total Uses
            </p>
          </Motion.div>
        </div>

        {/* Coupons List */}
        {coupons?.length > 0 ? (
          <Motion.div
            variants={containerVariants}
            className="grid gap-4 sm:grid-cols-2"
          >
            {coupons.map((coupon) => {
              const isExpired =
                coupon.expiry && new Date(coupon.expiry) < new Date();
              const isLimitReached =
                coupon.usage_limit !== null &&
                coupon.used_count >= coupon.usage_limit;

              return (
                <Motion.div
                  key={coupon._id}
                  variants={itemVariants}
                  layout
                  className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all ${
                    !coupon.active || isExpired || isLimitReached
                      ? "border-gray-200 opacity-70"
                      : "border-gray-100"
                  }`}
                >
                  {/* Top band */}
                  <div
                    className={`px-5 py-3 flex items-center justify-between ${
                      coupon.active && !isExpired && !isLimitReached
                        ? "bg-linear-to-r from-emerald-500 to-teal-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Ticket size={18} className="text-white" />
                      <span className="font-black text-white tracking-widest text-lg">
                        {coupon.code}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {isExpired && (
                        <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                          EXPIRED
                        </span>
                      )}
                      {isLimitReached && (
                        <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                          LIMIT REACHED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Discount info */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          coupon.discount_type === "percent"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {coupon.discount_type === "percent" ? (
                          <Percent size={20} />
                        ) : (
                          <IndianRupee size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-2xl font-black text-gray-900">
                          {coupon.discount_type === "percent"
                            ? `${coupon.discount_value}% OFF`
                            : `₹${coupon.discount_value} OFF`}
                        </p>
                        {coupon.max_discount &&
                          coupon.discount_type === "percent" && (
                            <p className="text-xs text-gray-400">
                              Max discount: ₹{coupon.max_discount}
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <ShoppingCart size={14} />
                        <span>
                          Min order:{" "}
                          <strong className="text-gray-700">
                            ₹{coupon.min_order_amount || 0}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500">
                        <Hash size={14} />
                        <span>
                          Used:{" "}
                          <strong className="text-gray-700">
                            {coupon.used_count}
                          </strong>
                          {coupon.usage_limit !== null && (
                            <> / {coupon.usage_limit}</>
                          )}
                        </span>
                      </div>

                      {coupon.expiry && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock size={14} />
                          <span>
                            Expires:{" "}
                            <strong className="text-gray-700">
                              {formatDateTime(coupon.expiry)}
                            </strong>
                          </span>
                        </div>
                      )}

                      {coupon.description && (
                        <div className="flex items-start gap-2 text-gray-500">
                          <Tag size={14} className="mt-0.5 shrink-0" />
                          <span className="text-gray-600 text-xs">
                            {coupon.description}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleToggle(coupon._id)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                          coupon.active
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {coupon.active ? (
                          <ToggleRight size={16} />
                        ) : (
                          <ToggleLeft size={16} />
                        )}
                        {coupon.active ? "Active" : "Inactive"}
                      </button>

                      <button
                        onClick={() => setEditCoupon(coupon)}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <Pencil size={14} /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-auto"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </Motion.div>
              );
            })}
          </Motion.div>
        ) : (
          <Motion.div
            variants={itemVariants}
            className="text-center py-20 bg-white rounded-3xl border border-gray-100"
          >
            <Ticket size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-medium">
              No coupons created yet
            </p>
            <button
              onClick={openNewModal}
              className="mt-4 btn btn-sm bg-black text-white border-none rounded-lg"
            >
              Create First Coupon
            </button>
          </Motion.div>
        )}
      </Motion.main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-5 flex items-center justify-between z-10">
                <h3 className="text-lg font-black text-gray-900">
                  {editCoupon ? "Edit Coupon" : "New Coupon"}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                {/* Code */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.toUpperCase().replace(/\s/g, ""))
                    }
                    placeholder="e.g. SAVE20"
                    className="input input-bordered w-full rounded-xl font-mono text-lg tracking-widest"
                    required
                  />
                </div>

                {/* Discount Type + Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Discount Type *
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="select select-bordered w-full rounded-xl"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="flat">Flat (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder={discountType === "percent" ? "e.g. 20" : "e.g. 100"}
                      min="1"
                      max={discountType === "percent" ? "100" : undefined}
                      className="input input-bordered w-full rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* Min Order + Max Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Min Order Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={minOrderAmount}
                      onChange={(e) => setMinOrderAmount(e.target.value)}
                      placeholder="e.g. 500"
                      min="0"
                      className="input input-bordered w-full rounded-xl"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Cart must be ≥ this amount
                    </p>
                  </div>
                  {discountType === "percent" && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                        Max Discount (₹)
                      </label>
                      <input
                        type="number"
                        value={maxDiscount}
                        onChange={(e) => setMaxDiscount(e.target.value)}
                        placeholder="e.g. 200"
                        min="0"
                        className="input input-bordered w-full rounded-xl"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">
                        Cap on discount amount
                      </p>
                    </div>
                  )}
                </div>

                {/* Usage Limit + Expiry */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      placeholder="Unlimited"
                      min="1"
                      className="input input-bordered w-full rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Expiry Date
                    </label>
                    <input
                      type="datetime-local"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="input input-bordered w-full rounded-xl"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Summer sale discount for orders above ₹500"
                    rows={2}
                    className="textarea textarea-bordered w-full rounded-xl resize-none"
                  />
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                  <span className="text-sm font-bold text-gray-700">
                    Active on creation
                  </span>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="toggle toggle-success"
                  />
                </div>

                {/* Info box */}
                <div className="flex items-start gap-2 text-xs text-blue-600 bg-blue-50 p-3 rounded-xl">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <p>
                    Users can apply this coupon at checkout. The discount will
                    only be applied if their cart total meets the minimum order
                    amount.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formLoader}
                  className="btn w-full bg-black text-white hover:bg-gray-800 rounded-xl border-none shadow-lg shadow-black/10 capitalize"
                >
                  {formLoader ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : editCoupon ? (
                    "Update Coupon"
                  ) : (
                    "Create Coupon"
                  )}
                </button>
              </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCoupons;
