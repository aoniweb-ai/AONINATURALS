import Product from "../models/product.model.js";
import uploadToCloudinary from "../libs/cloudinary.js"
export const adminAddProductController = async(req,res)=>{
    const admin = req.admin;

    const {
        product_name, 
        stock, 
        price, 
        discount, 
        extra_discount, 
        cod_charges, 
        description, 
        ingredients, 
        how_to_use, 
        benefits, 
        recommended, 
        coupon_code,
        sold
    } = req.body;
    try {
        console.log("before");
        const product_images = [];
        if(req.files && req.files.length>0 ){
            for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer);
            const obj = {
                secure_url:result.secure_url,
                public_id:result.public_id
            }
            product_images.push(obj);
            
        }
        }
        console.log("after")
        const product = new Product({
            owner:admin._id,
            product_name, 
            stock, 
            price, 
            discount, 
            extra_discount, 
            cod_charges, 
            description, 
            ingredients, 
            how_to_use, 
            benefits, 
            recommended, 
            coupon_code,
            sold,
            product_images
        });
        
        if(!product) return res.status(500).json({message:"Internal server error"});
        await product.save();
        return res.status(200).json({message:"successfully added",product});
    } catch (error) {
        console.log("error ",error);
    }
}

export const adminGetAllProductsController = async(req,res)=>{
    try {
        const products = await Product.find();
        if(!products) return res.status(500).json({message:"Internal server error"});
        return res.status(200).json({message:"success",products});
    } catch (error) {
        console.log("error while getting products ",error);
    }
}