import Order from "../models/order.model.js";

export const adminUpdateStatusController = async(req,res)=>{
    const {order_id,status} = req.body; 
    try {
        if(!["delivered","pending","shipped","cancelled"].includes(status)) return res.status(400).json({success:false,message:"Invalid credentials"});

        
        const order = await Order.findOneAndUpdate({order_id},{status,payment_status:"paid"},{new:true});

        if(!order) return res.status(400).json({success:false,message:"Invalid credentials"}); 

        return res.status(200).json({success:true,message:"Successfully updated",order});


    } catch (error) {
        return res.status(500).json({success:false,message:"Order updation failed"});        
    }
}

export const adminGetOrdersContoller = async(req,res)=>{
    const admin = req.admin;
    try {
        const orders = await Order.find().populate({
            path: "product.product",
            select: "product_name product_images final_price",
        })
        if(!orders) return res.status(500).json({success:false,message:"Order fetching failed"}); 

        return res.status(200).json({success:true,message:"Successfully orders getted",orders});
        
    } catch (error) {
        console.log("error while getting orders ",error)
        return res.status(500).json({success:false,message:"Orders fetching failed"});  
    }
}