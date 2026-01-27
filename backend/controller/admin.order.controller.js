import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const adminUpdateStatusController = async (req, res) => {
    const { order_id, status } = req.body;
    try {
        if (!["delivered", "pending", "shipped", "cancelled"].includes(status)) return res.status(400).json({ success: false, message: "Invalid credentials" });

        if (status.toLowerCase() == "cancelled") {
            console.log("chla chal")
            const order = await Order.findOne({ order_id });
            if (order.status == status) return res.status(401).json({ success: false, message: "Invalid input" })
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
            return res.status(200).json({ success: true, message: "Successfully updated", order: updatedOrder });
        }

        const order = await Order.findOne({ order_id });
        if (order.status == status || order.status == "cancelled") return res.status(401).json({ success: false, message: "Invalid input" })
        order.status = status;
        order.payment_status = "paid";
        const updatedUser = await order.save();

        if (!updatedUser) return res.status(400).json({ success: false, message: "Invalid credentials" });

        return res.status(200).json({ success: true, message: "Successfully updated", order: updatedUser });


    } catch (error) {
        console.log("error while updating status ", error)
        return res.status(500).json({ success: false, message: "Order updation failed" });
    }
}

export const adminGetOrdersContoller = async (req, res) => {
    try {
        const status = req.params?.status;
        console.log("status ", status)
        const admin = req.admin;
        const orders = await Order.find({ status: status || "pending" })
            .populate({
                path: "user",
                select: "fullname phone address email"
            })
            .populate({
                path: "product.product",
                select: "product_name product_images final_price",
            }).sort({ createdAt: -1 })
        if (!orders) return res.status(500).json({ success: false, message: "Orders fetching failed" });

        return res.status(200).json({ success: true, message: "Successfully orders getted", orders });

    } catch (error) {
        console.log("error while getting orders ", error)
        return res.status(500).json({ success: false, message: "Orders fetching failed" });
    }
}
export const adminGetAnOrderContoller = async (req, res) => {
    try {
        const { order_id } = req.params;
        const order = await Order.findOne({ order_id })
            .populate({
                path: "user",
                select: "fullname phone address email"
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

export const adminGetTotalRevenueController = async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            { $match: { status: "delivered" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total_price" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        const recentOrders = await Order.find()
            .populate("user", "fullname email phone")
            .sort({ createdAt: -1 })
            .limit(4);

        return res.status(200).json({
            success: true,
            totalRevenue: revenue[0]?.totalRevenue || 0,
            totalDeliveredOrders: revenue[0]?.totalOrders || 0,
            recentOrders
        });

    } catch (error) {
        console.log("error while getting orders ", error)
        return res.status(500).json({ success: false, message: "Revenue fetching failed" });
    }
}

export const adminSearchOrdersController = async (req, res) => {
    try {
        const { search = "" } = req.params;

        const orders = await Order.find({
            order_id: { $regex: search, $options: "i" },
        })
        .populate("user", "fullname email phone")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fining Match",
        });
    }
};
