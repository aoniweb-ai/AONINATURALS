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
} from "lucide-react";

const AddUpdateProduct = () => {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1);
  const [contentStep, setContentStep] = useState(1);
  const [loader, setLoader] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const { adminProduct_addUpdate, editProduct, setEditProduct } = useAdminBear(
    (state) => state,
  );
  const modalCheckboxRef = useRef(null);

  const { register, handleSubmit, reset, trigger } = useForm({
    mode: "onChange", // Real-time validation
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

  // --- INITIALIZATION (Edit Mode) ---
  useEffect(() => {
    if (editProduct) {
      // Pre-fill Form
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

      // Handle Existing Images (Assuming editProduct has 'product_images' array of URLs)
      if (
        editProduct.product_images &&
        Array.isArray(editProduct.product_images)
      ) {
        setExistingImages(editProduct.product_images);
      }
    } else {
      // Clear if adding new
      setExistingImages([]);
    }
  }, [editProduct, reset]);

  // --- IMAGE HANDLERS ---
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

  // --- NAVIGATION HANDLERS ---

  // 1. Next Button Logic
  const handleNext = async () => {
    let isValid = false;

    // Validate fields specific to the current step
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
      setStep((prev) => prev + 1);
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  // 2. Back Button Logic (Smart Navigation)
  const handleBack = () => {
    if (step === 3 && contentStep > 1) {
      // If in Details tabs, go back one tab
      setContentStep((prev) => prev - 1);
    } else {
      // Else go back one main step
      setStep((prev) => prev - 1);
    }
  };

  // 3. Reset & Close
  const closeModalHandler = () => {
    setEditProduct(null);
    setStep(1);
    setContentStep(1);
    setNewImages([]);
    setNewPreviews([]);
    setExistingImages([]);
    reset();

    // Uncheck the hidden checkbox to close modal
    if (modalCheckboxRef.current) modalCheckboxRef.current.checked = false;
  };

  // --- SUBMIT HANDLER ---
  const formHandler = async (data) => {
    if (step < 4) return;

    try {
      setLoader(true);
      const formData = new FormData();

      // Append text fields
      for (const [key, val] of Object.entries(data)) {
        formData.append(key, val);
      }

      // Append NEW images (Files)
      newImages.forEach((img) => {
        formData.append("product_images", img);
      });

      existingImages.forEach((url) => {
        formData.append("existing_images", url);
      });

      if (editProduct) {
        formData.append("product_id", editProduct._id);
      }

      await adminProduct_addUpdate(formData);
      toast.success(
        editProduct
          ? "Product updated successfully"
          : "Product created successfully",
      );
      closeModalHandler();
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
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
      <dialog
        className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
        role="dialog"
      >
        <form
          onSubmit={handleSubmit(formHandler)}
          className="modal-box w-full max-w-5xl p-0 bg-[#F8FAFC] overflow-hidden rounded-4xl shadow-2xl"
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }} // 🛑 BLOCK ENTER KEY SUBMIT
        >
          {/* --- HEADER --- */}
          <div className="bg-white px-8 py-5 border-b border-slate-100 flex justify-between items-center sticky top-0 z-20">
            <div>
              <h3 className="font-black text-2xl text-slate-800 tracking-tight">
                {editProduct ? "Update Product" : "New Product"}
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                Step {step} of 4: {stepConfig[step - 1].label}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-circle btn-ghost btn-sm hover:bg-rose-50 hover:text-rose-500 transition-colors"
              onClick={closeModalHandler}
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row h-[70vh] md:h-auto">
            {/* --- SIDEBAR STEPPER --- */}
            <div className="bg-white md:w-64 p-6 border-r border-slate-100 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible no-scrollbar shrink-0">
              {stepConfig.map((s) => (
                <div
                  key={s.n}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border ${
                    step === s.n
                      ? "bg-primary/5 border-primary/20 text-primary shadow-sm"
                      : step > s.n
                        ? "bg-slate-50 border-slate-100 text-slate-400"
                        : "bg-transparent border-transparent text-slate-400 opacity-60"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === s.n
                        ? "bg-primary text-white"
                        : step > s.n
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200"
                    }`}
                  >
                    {step > s.n ? <CheckCircle2 size={14} /> : s.n}
                  </div>
                  <span className="font-bold text-sm whitespace-nowrap">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* --- MAIN FORM CONTENT --- */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#F8FAFC]">
              {/* STEP 1: BASIC INFO */}
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="form-control md:col-span-2">
                    <label className="label font-bold text-slate-700">
                      Product Name <span className="text-error">*</span>
                    </label>
                    <input
                      className="input input-bordered w-full bg-white focus:ring-2 focus:ring-primary/20 rounded-xl"
                      placeholder="e.g. Vitamin C Face Serum"
                      {...register("product_name", { required: true })}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label font-bold text-slate-700">
                      Stock <span className="text-error">*</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full bg-white rounded-xl"
                      placeholder="0"
                      {...register("stock", { required: true })}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label font-bold text-slate-700">
                      Base Price (₹) <span className="text-error">*</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full bg-white rounded-xl"
                      placeholder="0.00"
                      {...register("price", { required: true })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: PRICING */}
              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="form-control">
                    <label className="label font-bold text-slate-700">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full bg-white rounded-xl"
                      placeholder="0"
                      {...register("discount")}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label font-bold text-slate-700">
                      Extra Discount (%)
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full bg-white rounded-xl"
                      placeholder="0"
                      {...register("extra_discount")}
                    />
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label font-bold text-slate-700">
                      COD Charges (₹) <span className="text-error">*</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full bg-white rounded-xl"
                      placeholder="0"
                      {...register("cod_charges", { required: true })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: CONTENT TABS */}
              {step === 3 && (
                <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
                  <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                    {[
                      "Description",
                      "Ingredients",
                      "Usage",
                      "Benefits",
                      "Recommended",
                    ].map((tab, idx) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setContentStep(idx + 1)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                          contentStep === idx + 1
                            ? "bg-slate-800 text-white shadow-lg"
                            : "bg-white text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {tab}
                        {/* Optional: Add a dot if field is filled */}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1">
                    <div className="form-control h-full">
                      {contentStep === 1 && (
                        <textarea
                          className="textarea textarea-bordered w-full h-60 bg-white rounded-2xl p-4 text-base focus:ring-2 focus:ring-primary/20"
                          placeholder="Product Description *"
                          {...register("description", { required: true })}
                        />
                      )}
                      {contentStep === 2 && (
                        <textarea
                          className="textarea textarea-bordered w-full h-60 bg-white rounded-2xl p-4 text-base focus:ring-2 focus:ring-primary/20"
                          placeholder="Ingredients *"
                          {...register("ingredients", { required: true })}
                        />
                      )}
                      {contentStep === 3 && (
                        <textarea
                          className="textarea textarea-bordered w-full h-60 bg-white rounded-2xl p-4 text-base focus:ring-2 focus:ring-primary/20"
                          placeholder="How to use *"
                          {...register("how_to_use", { required: true })}
                        />
                      )}
                      {contentStep === 4 && (
                        <textarea
                          className="textarea textarea-bordered w-full h-60 bg-white rounded-2xl p-4 text-base focus:ring-2 focus:ring-primary/20"
                          placeholder="Benefits *"
                          {...register("benefits", { required: true })}
                        />
                      )}
                      {contentStep === 5 && (
                        <textarea
                          className="textarea textarea-bordered w-full h-60 bg-white rounded-2xl p-4 text-base focus:ring-2 focus:ring-primary/20"
                          placeholder="Recommended for *"
                          {...register("recommended", { required: true })}
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 italic">
                    * All details are required
                  </p>
                </div>
              )}

              {/* STEP 4: GALLERY & FINAL */}
              {step === 4 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label font-bold text-slate-700">
                        Coupon Code
                      </label>
                      <input
                        className="input input-bordered w-full bg-white rounded-xl"
                        placeholder="OPTIONAL"
                        {...register("coupon_code")}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label font-bold text-slate-700">
                        Status
                      </label>
                      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                        <span className="text-sm font-semibold text-slate-600">
                          Mark as Sold Out
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-error"
                          {...register("sold")}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label font-bold text-slate-700 flex items-center gap-2">
                      <ImageIcon size={18} /> Product Images
                    </label>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {/* NEW UPLOADS (Local) */}
                      {newPreviews.map((src, i) => (
                        <div
                          key={`new-${i}`}
                          className="relative group aspect-square bg-white rounded-xl border border-emerald-200 p-1 shadow-sm ring-2 ring-emerald-50"
                        >
                          <img
                            src={src}
                            alt="preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute top-1 left-1 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-md shadow-sm">
                            New
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="absolute -top-2 -right-2 bg-white text-rose-500 p-1.5 rounded-full shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-110"
                          >
                            <Trash2 size={14} strokeWidth={3} />
                          </button>
                        </div>
                      ))}

                      {/* UPLOAD BUTTON */}
                      <label className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-slate-400 hover:text-primary group">
                        <UploadCloud
                          size={24}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span className="text-[10px] font-bold uppercase">
                          Add Photo
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- FOOTER ACTIONS --- */}
          <div className="bg-white p-5 border-t border-slate-100 flex justify-between items-center z-20">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="btn btn-ghost gap-2 text-slate-500 disabled:bg-transparent"
            >
              <ChevronLeft size={20} /> Back
            </button>

            {step < 4 ? (
              <div
                type="button"
                onClick={handleNext}
                className="btn btn-primary px-8 rounded-xl shadow-lg shadow-primary/20 gap-2"
              >
                Next Step <ChevronRight size={20} />
              </div>
            ) : (
              <button
                type="submit"
                disabled={loader}
                className="btn btn-success text-white px-10 rounded-xl shadow-lg shadow-green-500/20 gap-2"
              >
                {loader ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <CheckCircle2 size={20} />
                )}
                {editProduct ? "Update Product" : "Publish Product"}
              </button>
            )}
          </div>
        </form>
      </dialog>
    </>
  );
};

export default AddUpdateProduct;
