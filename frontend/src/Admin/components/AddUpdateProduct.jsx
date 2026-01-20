import React from 'react'

const AddUpdateProduct = () => {
  return (
    <div>
        <form >
            <dialog id="addProduct" className="modal">
                <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Add Product</h3>

                <div className="space-y-3">
                    <input className="input input-bordered w-full" placeholder="Product name" />
                    <input className="input input-bordered w-full" placeholder="Price" />
                    <input className="input input-bordered w-full" placeholder="Stock" />
                    <input type="file" className="file-input file-input-bordered w-full" />
                </div>

                <div className="modal-action">
                    <form method="dialog">
                    <button className="btn">Cancel</button>
                    </form>
                    <button className="btn btn-primary">Save</button>
                </div>
                </div>
            </dialog>

        </form>
    </div>
  )
}

export default AddUpdateProduct