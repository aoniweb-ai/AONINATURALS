import Product from "../models/product.model.js";
import {uploadToCloudinary, deleteCloudinaryImages} from "../libs/cloudinary.js"
export const adminAddProductController = async(req,res)=>{
    const admin = req.admin;

    const {
        product_id, 
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
        const editProduct = await Product.findOne({_id:product_id})
        const product_images = [];
        
        if(req.files && req.files.length>0 ){
            if(editProduct){
                const public_ids = editProduct?.product_images?.map(item=>item.public_id);
                deleteCloudinaryImages(public_ids);
            }
            for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer);
            product_images.push({
                secure_url:result.secure_url,
                public_id:result.public_id
            });
            
        }
        }

        const final_price = Math.round(((parseInt(price || 0)*(100-parseInt(discount || 0))/100)*(100-parseInt(extra_discount || 0))/100));
        console.log("final price value ",final_price,price,discount,extra_discount)
        if(editProduct){
            editProduct.product_name = product_name
            editProduct.stock = stock
            editProduct.price = price
            editProduct.final_price = final_price
            editProduct.discount = discount
            editProduct.extra_discount = extra_discount
            editProduct.cod_charges = cod_charges
            editProduct.description = description
            editProduct.ingredients = ingredients
            editProduct.how_to_use = how_to_use
            editProduct.benefits = benefits
            editProduct.recommended = recommended
            editProduct.coupon_code = coupon_code
            editProduct.sold = sold
            editProduct.product_images = product_images.length>0 ? product_images : editProduct.product_images

            const product = await editProduct.save();
            if(!product) return res.status(500).json({message:"Internal server error"});
            return res.status(200).json({message:"successfully added",edit:true,product});
        }
        const product = new Product({
            owner:admin._id,
            product_name, 
            stock, 
            price, 
            final_price, 
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
        return res.status(200).json({message:"successfully added",edit:false,product});
    } catch (error) {
        console.log("error while creating a product ",error);
        return res.status(500).json({success:false,message:"Product creation error"})
    }
}

export const adminGetAllProductsController = async(req,res)=>{
    try {
        const products = await Product.find();
        if(!products) return res.status(500).json({message:"Internal server error"});
        return res.status(200).json({message:"success",products});
    } catch (error) {
        console.log("error while getting products ",error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}
export const adminGetAProductController = async(req,res)=>{
    const {id} = req.params;
    try {
        console.log("id aai ",id)
        const product = await Product.findOne({_id:id});

        if(!product) return res.status(500).json({message:"Internal server error"});
        return res.status(200).json({message:"success",product});
    } catch (error) {
        console.log("error while getting a product ",error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}