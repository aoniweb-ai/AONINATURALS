import Product from "../models/product.model.js";
import User from "../models/user.model.js";
export const productController = async(req,res)=>{
    try {
        const products = await Product.find();
        if(!products) return res.status(500).json({message:"Internal server error"});
        
        return res.status(200).json({sucess:true,message:"Products getted",products});
        
    } catch (error) {
        console.log("error while getting products ",error);  
        return res.status(500).json({success:false,message:"Internal server error"})      
    }
}
export const aProductController = async(req,res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findOne({_id:id});
        if(!product) return res.status(500).json({message:"Internal server error"});
        
        return res.status(200).json({success:true,message:"Product getted",product});
        
    } catch (error) {
        console.log("error while getting a product ",error);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

export const updateCartController = async(req,res)=>{
    const user = req.user;
    const {product_id} = req.params;
    const quantity = Number(req.params.quantity);
    try {
        if(!product_id || !quantity || isNaN(parseInt(quantity))) return res.status(401).json({message:"Invalid credentials"});

        const product = await Product.findById(product_id);
        if(!product) return res.status(401).json({message:"Invalid credentials"});

        if(product.quantity<quantity) return res.status(402).json({message:"Unavailable"});

        for(let i=0;i<=Math.floor(user.cart.length/2);i++){
            if(user.cart[i]?.product==product_id){
                user.cart[i].value += quantity;
            }else if(user.cart[(user.cart.length-1)-i]?.product==product_id){
                user.cart[(user.cart.length-1)-i].value += quantity;
            }else continue;

            const newUser = await user.save();
            const popUser = await User.findById(newUser._id).populate({
            path: "cart.product",
            select: "product_name cod_charges stock sold price final_price discount extra_discount product_images",
        });
            return res.status(200).json({success:true,message:"item added Successfully",user:popUser})
        }

        const cartData = {
            product:product_id,
            value:quantity
        }
        user.cart.push(cartData);
        const newUser = await user.save();
        const popUser = await User.findById(newUser._id).populate({
            path: "cart.product",
            select: "product_name cod_charges stock sold price final_price discount extra_discount product_images",
        });
        return res.status(200).json({success:true,message:"item added Successfully",user:popUser})



    } catch (error) {
        console.log("error while update cart ",error)
        return res.status(500).json({success:false,message:"Updation error"})
    }
}

export const removeCartItemController = async(req,res)=>{
    const user = req.user;
    try {
        const {id} = req.params;
        const newUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
            $pull: {
            cart: { _id: id },
            },
        },
        { new: true } 
        );

        if(!newUser) return res.status(400).json({success:false,message:"Invalid credentials"});

        return res.status(200).json({success:true,message:"Successfully removed item",user:newUser});
        
    } catch (error) {
        console.log("error while remove from cart ",error)
        return res.status(500).json({success:false,message:"Cart updation error"})
    }
}
