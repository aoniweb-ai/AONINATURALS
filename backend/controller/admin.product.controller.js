import Product from "../models/product.model.js";
export const adminAddProductController = async(req,res)=>{
    const admin = req.admin;
    const {name, price, discount, extra_discount, cod_charges, payment_type, description,sold, quantity} = req.body;
    try {
        const product = new Product({owner:admin._id,name, price, discount, extra_discount, cod_charges, payment_type, description,sold, quantity});
        if(!product) return res.status(500).json({message:"Internal server error"});
        await product.save();
        return res.status(200).json({message:"successfully added",product});
    } catch (error) {
        console.log("error ",error);
    }
}