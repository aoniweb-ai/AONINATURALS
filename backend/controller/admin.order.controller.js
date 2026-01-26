import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const adminUpdateStatusController = async (req, res) => {
    const { order_id, status } = req.body;
    try {
        if (!["delivered", "pending", "shipped", "cancelled"].includes(status)) return res.status(400).json({ success: false, message: "Invalid credentials" });
        
        if (status.toLowerCase() == "cancelled") {
            console.log("chla chal")
            const order = await Order.findOne({order_id});
            if(order.status==status) return res.status(401).json({success:false,message:"Invalid input"})
            const bulkOps = [];

            for (const item of order.product) {
                bulkOps.push({
                    updateOne: {
                        filter: { _id: item.product },
                        update: {
                            $inc: { stock: item.quantity },
                        },
                    },
                });

                const hasDeliveredOrder = await Order.exists({
                    user: order.user,
                    status: "delivered",
                    "product.product": item.product,
                });

                if (!hasDeliveredOrder) {
                    bulkOps.push({
                        updateOne: {
                            filter: { _id: item.product },
                            update: {
                                $pull: { buyers: order.user },
                            },
                        },
                    });
                }
            }

            await Product.bulkWrite(bulkOps);

            order.status = status;
            order.payment_status = "paid";
            const updatedOrder = await order.save();
            return res.status(200).json({ success: true, message: "Successfully updated", order:updatedOrder });
        }

        const order = await Order.findOne({ order_id });
        if(order.status==status || order.status=="cancelled") return res.status(401).json({success:false,message:"Invalid input"})
        order.status = status;
        order.payment_status = "paid";
        const updatedUser = await order.save();

        if (!updatedUser) return res.status(400).json({ success: false, message: "Invalid credentials" });

        return res.status(200).json({ success: true, message: "Successfully updated", order:updatedUser });


    } catch (error) {
        console.log("error while updating status ",error)
        return res.status(500).json({ success: false, message: "Order updation failed" });
    }
}

export const adminGetOrdersContoller = async (req, res) => {
    try {
        const status = req.params?.status;
        console.log("status ",status)
        const admin = req.admin;
        const orders = await Order.find({status: status || "pending"})
        .populate({
            path:"user",
            select:"fullname phone address email"
        })
        .populate({
            path: "product.product",
            select: "product_name product_images final_price",
        }).sort({createdAt:-1})
        if (!orders) return res.status(500).json({ success: false, message: "Orders fetching failed" });

        return res.status(200).json({ success: true, message: "Successfully orders getted", orders });

    } catch (error) {
        console.log("error while getting orders ", error)
        return res.status(500).json({ success: false, message: "Orders fetching failed" });
    }
}
export const adminGetAnOrderContoller = async (req, res) => {
    try {
        const admin = req.admin;
        const {order_id} = req.params;
        const order = await Order.findOne({order_id})
        .populate({
            path:"user",
            select:"fullname phone address email"
        })
        .populate({
            path: "product.product",
            select: "product_name product_images final_price",
        })
        if (!order) return res.status(500).json({ success: false, message: "Order fetching failed" });

        return res.status(200).json({ success: true, message: "Successfully orders getted", order });

    } catch (error) {
        console.log("error while getting orders ", error)
        return res.status(500).json({ success: false, message: "Orders fetching failed" });
    }
}