import Product from "../models/product.model.js";

export const productController = async(req,res)=>{
    const user = req.user;
    try {
        const products = await Product.find();
        if(!products) return res.status(500).json({message:"Internal server error"});
        
        return res.status(200).json({message:"Products getted",products});
        
    } catch (error) {
        console.log("error ",error);        
    }
}

export const updateCartController = async(req,res)=>{
    const user = req.user;
    const {product_id, quantity} = req.params;
    try {
        if(!product_id || quantity) return res.status(401).json({message:"Invalid credentials"});

        const product = await Product.findById(product_id);
        if(!product) return res.status(401).json({message:"Invalid credentials"});

        if(product.quantity<quantity) return res.status(402).json({message:"Unavailable"});

        for(let i=0;i<=Math.floor(user.cart.length/2);i++){
            if(user.cart[i].product==product_id){
                user.cart[i].quantity = quantity;
            }else if(user.cart[(user.cart.length-1)-i].product==product_id){
                user.cart[(user.cart.length-1)-i].quantity = quantity;
            }else continue;

            const newUser = await user.save();
            return res.status(200).json({message:"item added Successfully",user:newUser})
        }

        const cartData = {
            product:product_id,
            quantity
        }
        user.cart.push(cartData);
        const newUser = await user.save();
        return res.status(200).json({message:"item added Successfully",user:newUser})



    } catch (error) {
        
    }
}
