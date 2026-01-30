import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import useAdminBear from "../../../store/admin.store";
import toast from "react-hot-toast";
import {
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Package,
  Tag,
  FileText,
  CheckCircle2,
  X,
  UploadCloud,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- ANIMATION VARIANTS ---
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", duration: 0.5, bounce: 0.3 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

const contentVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    filter: "blur(4px)",
  }),
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const AddUpdateProduct = () => {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1);
  const [contentStep, setContentStep] = useState(1);
  const [direction, setDirection] = useState(0); // For slide direction
  const [loader, setLoader] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const { adminProduct_addUpdate, editProduct, setEditProduct } = useAdminBear(
    (state) => state,
  );
  const modalCheckboxRef = useRef(null);

  const { register, handleSubmit, reset, trigger } = useForm({
    mode: "onChange",
    defaultValues: {
      product_name: "",
      stock: "",
      price: "",
      discount: "",
      extra_discount: "",
      cod_charges: "",
      description: "",
      ingredients: "",
      how_to_use: "",
      benefits: "",
      recommended: "",
      coupon_code: "",
      sold: false,
    },
  });

  // --- INITIALIZATION ---
  useEffect(() => {
    if (editProduct) {
      reset({
        product_name: editProduct?.product_name || "",
        stock: editProduct?.stock || "",
        price: editProduct?.price || "",
        discount: editProduct?.discount || "",
        extra_discount: editProduct?.extra_discount || "",
        cod_charges: editProduct?.cod_charges || "",
        description: editProduct?.description || "",
        ingredients: editProduct?.ingredients || "",
        how_to_use: editProduct?.how_to_use || "",
        benefits: editProduct?.benefits || "",
        recommended: editProduct?.recommended || "",
        coupon_code: editProduct?.coupon_code || "",
        sold: editProduct?.sold || false,
      });

      if (
        editProduct.product_images &&
        Array.isArray(editProduct.product_images)
      ) {
        setExistingImages(editProduct.product_images);
      }
    } else {
      setExistingImages([]);
    }
  }, [editProduct, reset]);

  // --- HANDLERS ---
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...files]);
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setNewPreviews((prev) => [...prev, ...newUrls]);
    }
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) isValid = await trigger(["product_name", "stock", "price"]);
    if (step === 2) isValid = await trigger(["cod_charges"]);
    if (step === 3)
      isValid = await trigger([
        "description",
        "ingredients",
        "how_to_use",
        "benefits",
        "recommended",
      ]);

    if (isValid) {
      setDirection(1);
      setStep((prev) => prev + 1);
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  const handleBack = () => {
    if (step === 3 && contentStep > 1) {
      setContentStep((prev) => prev - 1);
    } else {
      setDirection(-1);
      setStep((prev) => prev - 1);
    }
  };

  const closeModalHandler = () => {
    setEditProduct(null);
    setStep(1);
    setContentStep(1);
    setNewImages([]);
    setNewPreviews([]);
    setExistingImages([]);
    reset();
    if (modalCheckboxRef.current) modalCheckboxRef.current.checked = false;
  };

  const formHandler = async (data) => {
    if (step < 4) return;
    try {
      setLoader(true);
      const formData = new FormData();
      for (const [key, val] of Object.entries(data)) {
        formData.append(key, val);
      }
      newImages.forEach((img) => formData.append("product_images", img));
      existingImages.forEach((url) => formData.append("existing_images", url));
      if (editProduct) formData.append("product_id", editProduct._id);

      await adminProduct_addUpdate(formData);
      toast.success(
        editProduct
          ? "Product updated successfully"
          : "Product created successfully",
      );
      closeModalHandler();
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  const stepConfig = [
    { n: 1, label: "Basic Info", icon: <Package size={18} /> },
    { n: 2, label: "Pricing", icon: <Tag size={18} /> },
    { n: 3, label: "Details", icon: <FileText size={18} /> },
    { n: 4, label: "Gallery", icon: <ImageIcon size={18} /> },
  ];

  return (
    <>
      <input
        type="checkbox"
        id="add_update_modal"
        className="modal-toggle"
        ref={modalCheckboxRef}
      />
      <div
        className="modal modal-bottom sm:modal-middle backdrop-blur-md bg-slate-900/30"
        role="dialog"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={modalVariants}
          className="modal-box w-full max-w-6xl p-0 bg-[#F8FAFC] overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-white/50"
        >
          <form
            onSubmit={handleSubmit(formHandler)}
            className="flex flex-col h-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          >
            {/* --- HEADER --- */}
            <div className="bg-white px-8 py-5 border-b border-slate-100 flex justify-between items-center sticky top-0 z-30">
              <div>
                <motion.h3
                  key={editProduct ? "edit" : "new"}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-black text-2xl text-slate-900 tracking-tight"
                >
                  {editProduct ? "Update Product" : "New Product"}
                </motion.h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Step {step} of 4
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-primary font-bold text-xs uppercase tracking-widest">
                    {stepConfig[step - 1].label}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-circle btn-ghost btn-sm hover:bg-rose-50 hover:text-rose-500 transition-colors hover:rotate-90 duration-300"
                onClick={closeModalHandler}
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row h-[75vh] md:h-[600px]">
              {/* --- SIDEBAR STEPPER --- */}
              <div className="bg-white md:w-72 p-6 border-r border-slate-100 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar shrink-0 z-20">
                {stepConfig.map((s) => {
                  const isActive = step === s.n;
                  const isCompleted = step > s.n;

                  return (
                    <div
                      key={s.n}
                      className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-default ${
                        isCompleted
                          ? "opacity-100"
                          : isActive
                            ? "opacity-100"
                            : "opacity-40"
                      }`}
                    >
                      {/* Magic Background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeStep"
                          className="absolute inset-0 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}

                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-colors duration-300 ${
                          isActive
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                            : isCompleted
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={18} /> : s.n}
                      </div>

                      <div className="relative z-10 flex flex-col">
                        <span
                          className={`font-bold text-sm ${isActive ? "text-slate-900" : "text-slate-500"}`}
                        >
                          {s.label}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {isCompleted
                            ? "Completed"
                            : isActive
                              ? "In Progress"
                              : "Pending"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* --- MAIN FORM CONTENT --- */}
              <div className="flex-1 relative overflow-hidden bg-[#F8FAFC]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={contentVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 p-8 overflow-y-auto no-scrollbar"
                  >
                    {/* STEP 1: BASIC INFO */}
                    {step === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        <motion.div
                          variants={itemVariants}
                          className="form-control md:col-span-2"
                        >
                          <label className="label font-bold text-slate-700">
                            Product Name{" "}
                            <span className="text-rose-500">*</span>
                          </label>
                          <input
                            className="input input-bordered w-full bg-white focus:ring-4 focus:ring-slate-100 border-slate-200 rounded-2xl h-14"
                            placeholder="e.g. Vitamin C Face Serum"
                            {...register("product_name", { required: true })}
                          />
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="form-control"
                        >
                          <label className="label font-bold text-slate-700">
                            Stock <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="number"
                            className="input input-bordered w-full bg-white rounded-2xl h-14"
                            placeholder="0"
                            {...register("stock", { required: true })}
                          />
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="form-control"
                        >
                          <label className="label font-bold text-slate-700">
                            Base Price (₹){" "}
                            <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="number"
                            className="input input-bordered w-full bg-white rounded-2xl h-14"
                            placeholder="0.00"
                            {...register("price", { required: true })}
                          />
                        </motion.div>
                      </div>
                    )}

                    {/* STEP 2: PRICING */}
                    {step === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        <motion.div
                          variants={itemVariants}
                          className="form-control"
                        >
                          <label className="label font-bold text-slate-700">
                            Discount (%)
                          </label>
                          <input
                            type="number"
                            className="input input-bordered w-full bg-white rounded-2xl h-14"
                            placeholder="0"
                            {...register("discount")}
                          />
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="form-control"
                        >
                          <label className="label font-bold text-slate-700">
                            Extra Discount (%)
                          </label>
                          <input
                            type="number"
                            className="input input-bordered w-full bg-white rounded-2xl h-14"
                            placeholder="0"
                            {...register("extra_discount")}
                          />
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="form-control md:col-span-2"
                        >
                          <label className="label font-bold text-slate-700">
                            COD Charges (₹){" "}
                            <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="number"
                            className="input input-bordered w-full bg-white rounded-2xl h-14"
                            placeholder="0"
                            {...register("cod_charges", { required: true })}
                          />
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          className="md:col-span-2 bg-blue-50 p-4 rounded-2xl flex gap-3 text-blue-700 text-sm"
                        >
                          <AlertCircle size={20} className="shrink-0" />
                          <p>
                            Ensure that the discount logic doesn't result in a
                            negative price. The final price will be calculated
                            automatically at checkout.
                          </p>
                        </motion.div>
                      </div>
                    )}

                    {/* STEP 3: CONTENT TABS */}
                    {step === 3 && (
                      <div className="flex flex-col h-full max-w-4xl mx-auto">
                        <motion.div
                          variants={itemVariants}
                          className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2"
                        >
                          {[
                            "Description",
                            "Ingredients",
                            "Usage",
                            "Benefits",
                            "Recommended",
                          ].map((tab, idx) => {
                            const isTabActive = contentStep === idx + 1;
                            return (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => setContentStep(idx + 1)}
                                className={`relative px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap z-10 ${
                                  isTabActive
                                    ? "text-white"
                                    : "bg-white text-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                {isTabActive && (
                                  <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-slate-800 rounded-xl shadow-lg shadow-slate-800/20 -z-10"
                                  />
                                )}
                                {tab}
                              </button>
                            );
                          })}
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="flex-1 relative"
                        >
                          <AnimatePresence mode="wait">
                            <motion.textarea
                              key={contentStep}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="textarea textarea-bordered w-full h-[350px] bg-white rounded-3xl p-6 text-base leading-relaxed focus:ring-4 focus:ring-slate-100 border-slate-200 resize-none shadow-sm"
                              placeholder={`Enter product ${["description", "ingredients", "usage instructions", "benefits", "recommendations"][contentStep - 1]}...`}
                              {...register(
                                contentStep === 1
                                  ? "description"
                                  : contentStep === 2
                                    ? "ingredients"
                                    : contentStep === 3
                                      ? "how_to_use"
                                      : contentStep === 4
                                        ? "benefits"
                                        : "recommended",
                                { required: true },
                              )}
                            />
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    )}

                    {/* STEP 4: GALLERY & FINAL */}
                    {step === 4 && (
                      <div className="space-y-8 max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div
                            variants={itemVariants}
                            className="form-control"
                          >
                            <label className="label font-bold text-slate-700">
                              Coupon Code
                            </label>
                            <input
                              className="input input-bordered w-full bg-white rounded-2xl h-14 uppercase tracking-widest font-bold placeholder:normal-case placeholder:font-normal placeholder:tracking-normal"
                              placeholder="OPTIONAL"
                              {...register("coupon_code")}
                            />
                          </motion.div>
                          <motion.div
                            variants={itemVariants}
                            className="form-control"
                          >
                            <label className="label font-bold text-slate-700">
                              Status
                            </label>
                            <div className="flex items-center justify-between px-5 h-14 bg-white border border-slate-200 rounded-2xl">
                              <span className="text-sm font-bold text-slate-600">
                                Mark as Sold Out
                              </span>
                              <input
                                type="checkbox"
                                className="toggle toggle-error"
                                {...register("sold")}
                              />
                            </div>
                          </motion.div>
                        </div>

                        <motion.div variants={itemVariants}>
                          <label className="label font-bold text-slate-700 flex items-center gap-2 mb-2">
                            <ImageIcon size={18} /> Product Images
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {/* EXISTING + NEW IMAGES */}
                            <AnimatePresence>
                              {newPreviews.map((src, i) => (
                                <motion.div
                                  key={`new-${i}`}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  className="relative group aspect-square bg-white rounded-2xl border border-emerald-200 p-1 shadow-sm ring-2 ring-emerald-50 overflow-hidden"
                                >
                                  <img
                                    src={src}
                                    alt="preview"
                                    className="w-full h-full object-cover rounded-xl"
                                  />
                                  <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                                    New
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeNewImage(i)}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <div className="bg-white text-rose-500 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                                      <Trash2 size={16} strokeWidth={2.5} />
                                    </div>
                                  </button>
                                </motion.div>
                              ))}
                            </AnimatePresence>

                            {/* UPLOAD BUTTON */}
                            <motion.label
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="aspect-square flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-slate-400 hover:text-primary group"
                            >
                              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center transition-colors">
                                <UploadCloud
                                  size={20}
                                  className="group-hover:scale-110 transition-transform"
                                />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-wider">
                                Add Photo
                              </span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                              />
                            </motion.label>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* --- FOOTER ACTIONS --- */}
            <div className="bg-white p-5 border-t border-slate-100 flex justify-between items-center z-30 relative">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="btn btn-ghost gap-2 text-slate-500 disabled:bg-transparent hover:bg-slate-50 rounded-xl"
              >
                <ChevronLeft size={20} /> Back
              </button>

              {step < 4 ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleNext}
                  className="btn btn-neutral px-8 rounded-xl shadow-lg shadow-slate-300 gap-2 bg-slate-900 text-white border-none"
                >
                  Next Step <ChevronRight size={20} />
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loader}
                  className="btn btn-success text-white px-10 rounded-xl shadow-lg shadow-emerald-200 border-none gap-2 bg-emerald-500 hover:bg-emerald-600"
                >
                  {loader ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                  {editProduct ? "Update Product" : "Publish Product"}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default AddUpdateProduct;
