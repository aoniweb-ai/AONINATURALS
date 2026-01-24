import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAdminBear from "../../../store/admin.store";
import { useEffect } from "react";
const AddUpdateProduct = () => {
  const [step, setStep] = useState(1);
  const [contentStep, setContentStep] = useState(1);
  const [loader, setLoader] = useState(false);
  const [images, setImages] = useState([]);
  const [imageInputs, setImageInputs] = useState([0]);
  const { adminProduct_addUpdate, editProduct, setEditProduct } = useAdminBear(
    (state) => state,
  );
  const { register, handleSubmit, reset } = useForm({
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

  useEffect(() => {
    if (editProduct !== false) {
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
    }
  }, [editProduct, reset]);

  const formHandler = async (data) => {
    try {
      setLoader(true);
      const formData = new FormData();

      for (const [key, val] of Object.entries(data)) {
        formData.append(key, val);
      }

      images.forEach((img) => {
        formData.append("product_images", img);
      });

      await adminProduct_addUpdate(formData);
    } catch (error) {
      console.log("error ", error);
    } finally {
      setLoader(false);
      reset();
      setImages([]);
      setImageInputs([0]);
      document.getElementById("closeModal").click();
    }
  };
  return (
    <>
      <input type="checkbox" id="add_update_modal" className="modal-toggle" />
      <dialog className="modal" role="dialog">
        <form
          onSubmit={handleSubmit(formHandler)}
          className="w-full flex justify-center"
        >
          <div className="modal-box w-full max-w-4xl relative">
            {/* CLOSE BUTTON */}
            <label
              id="closeModal"
              htmlFor="add_update_modal"
              className={`btn btn-sm ${loader && "btn-disabled"} btn-circle btn-ghost absolute right-4 top-4`}
              onClick={() => {
                setEditProduct(null);
                setStep(1);
                setContentStep(1);
              }}
            >
              ✕
            </label>

            <h3 className="font-bold text-xl mb-2">Add / Update Product</h3>

            {/* MAIN PROGRESS */}
            <progress
              className="progress progress-primary w-full mb-6"
              value={step}
              max="4"
            />

            {/* STEP 1 – BASIC INFO */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  className="input input-bordered w-full"
                  placeholder="Product Name"
                  {...register("product_name", { required: true })}
                />
                <input
                  className="input input-bordered w-full"
                  placeholder="Stock"
                  {...register("stock", { required: true })}
                />
                <input
                  className="input input-bordered w-full"
                  placeholder="Price (rs)"
                  {...register("price", { required: true })}
                />
              </div>
            )}

            {/* STEP 2 – PRICING */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  className="input input-bordered w-full"
                  placeholder="Discount (%)"
                  {...register("discount", { required: false })}
                />
                <input
                  className="input input-bordered w-full"
                  placeholder="Extra Discount (%)"
                  {...register("extra_discount", { required: false })}
                />
                <input
                  className="input input-bordered w-full"
                  placeholder="COD Charges (rs)"
                  {...register("cod_charges", { required: true })}
                />
              </div>
            )}

            {/* STEP 3 – CONTENT SLIDER */}
            {step === 3 && (
              <div className="space-y-4">
                <progress
                  className="progress progress-accent w-full"
                  value={contentStep}
                  max="5"
                />

                {contentStep === 1 && (
                  <textarea
                    className="textarea textarea-bordered w-full h-56"
                    placeholder="Product Description"
                    {...register("description", { required: true })}
                  />
                )}

                {contentStep === 2 && (
                  <textarea
                    className="textarea textarea-bordered w-full h-56"
                    placeholder="Ingredients"
                    {...register("ingredients", { required: true })}
                  />
                )}

                {contentStep === 3 && (
                  <textarea
                    className="textarea textarea-bordered w-full h-56"
                    placeholder="How To Use"
                    {...register("how_to_use", { required: true })}
                  />
                )}

                {contentStep === 4 && (
                  <textarea
                    className="textarea textarea-bordered w-full h-56"
                    placeholder="Benefits"
                    {...register("benefits", { required: true })}
                  />
                )}

                {contentStep === 5 && (
                  <textarea
                    className="textarea textarea-bordered w-full h-56"
                    placeholder="Recommended"
                    {...register("recommended", { required: true })}
                  />
                )}

                {/* FIXED BACK / NEXT */}
                <div className="flex justify-between pt-4">
                  <button
                    className="btn"
                    onClick={() => {
                      if (contentStep === 1) {
                        setStep(2);
                      } else {
                        setContentStep(contentStep - 1);
                      }
                    }}
                  >
                    Back
                  </button>

                  {contentStep < 5 ? (
                    <div
                      className="btn btn-primary"
                      onClick={() => setContentStep(contentStep + 1)}
                    >
                      Next
                    </div>
                  ) : (
                    <div
                      className="btn btn-success"
                      onClick={() => {
                        setStep(4);
                        setContentStep(1);
                      }}
                    >
                      Continue
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4 – FINAL */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input input-bordered w-full"
                    placeholder="Coupon Code"
                    {...register("coupon_code", { required: false })}
                  />
                  <label
                    htmlFor="soldCount"
                    className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                  >
                    <span className="text-lg font-semibold">Sold Count</span>
                    <input
                      type="checkbox"
                      id="soldCount"
                      className="toggle toggle-secondary"
                      {...register("sold", { required: false })}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Upload Product Images
                  </label>

                  <div className="space-y-3">
                    {imageInputs.map((_, index) => (
                      <input
                        key={index}
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full"
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setImages((prev) => [...prev, ...files]);
                        }}
                      />
                    ))}
                  </div>

                  {/* ➕ ADD MORE BUTTON */}
                  <button
                    type="button"
                    className="btn btn-outline btn-primary btn-sm mt-3 flex items-center gap-2"
                    onClick={() =>
                      setImageInputs((prev) => [...prev, prev.length])
                    }
                  >
                    ➕ Add more image
                  </button>
                </div>

                <div className="alert alert-info">
                  <svg
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>Review all details before submitting</span>
                </div>
              </div>
            )}

            {/* MAIN ACTIONS (HIDE DURING CONTENT SLIDER) */}
            {step !== 3 && (
              <div className="modal-action flex justify-between">
                <button
                  className="btn"
                  disabled={step === 1}
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </button>

                {step < 4 ? (
                  <div
                    className="btn btn-primary"
                    onClick={() => setStep(step + 1)}
                  >
                    Next
                  </div>
                ) : !editProduct ? (
                  <button
                    className={`btn ${loader && "btn-disabled"} btn-success`}
                  >
                    {loader ? "Submitting..." : "Submit"}
                  </button>
                ) : (
                  <button
                    className={`btn ${loader && "btn-disabled"} btn-success`}
                  >
                    {loader ? "Saving..." : "Save changes"}
                  </button>
                )}
              </div>
            )}
          </div>
        </form>
      </dialog>
    </>
  );
};

export default AddUpdateProduct;
