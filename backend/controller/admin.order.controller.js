import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { getIO } from "../libs/socket.js";

export const adminUpdateStatusController = async (req, res) => {
    try {
        const { order_id, status, delivery_date = '' } = req.body;
        if (!["delivered", "pending", "shipped", "cancelled"].includes(status)) return res.status(400).json({ success: false, message: "Invalid credentials" });

        if (status.toLowerCase() == "cancelled") {
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

            getIO().emit("order:statusUpdated", {
                order: updatedOrder,
                userId: order.user.toString(),
            });

            return res.status(200).json({ success: true, message: "Successfully updated", order: updatedOrder });
        }

        const order = await Order.findOne({ order_id })
            .populate({
                path: "user",
                select: "fullname phone address email"
            })
            .populate({
                path: "product.product",
                select: "product_name product_images final_price",
            })
        if (order.status == "cancelled") return res.status(401).json({ success: false, message: "Invalid input" })
        order.status = status;
        order.payment_status = "paid";
        order.delivery_date = delivery_date;
        await order.save();

        const updatedOrder = await Order.findOne({ order_id })
            .populate({ path: "user", select: "fullname phone address email" })
            .populate({ path: "product.product", select: "product_name product_images final_price" });

        if (!updatedOrder) return res.status(400).json({ success: false, message: "Invalid credentials" });

        getIO().emit("order:statusUpdated", {
            order: updatedOrder,
            userId: updatedOrder.user?._id?.toString() || updatedOrder.user?.toString(),
        });

        return res.status(200).json({ success: true, message: "Successfully updated", order: updatedOrder });


    } catch (error) {
        console.log("error while updating status ", error)
        return res.status(500).json({ success: false, message: "Order updation failed" });
    }
}

export const adminGetOrdersContoller = async (req, res) => {
    try {
        const status = req.params?.status;
        const finalStatus = status || "pending";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const query = { status: finalStatus };

        if (finalStatus === "cancelled" || finalStatus === "delivered") {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            query.createdAt = { $gte: oneMonthAgo };
        }

        const total = await Order.countDocuments(query);

        const orders = await Order.find(query)
            .populate({
                path: "user",
                select: "fullname phone address email"
            })
            .populate({
                path: "product.product",
                select: "product_name product_images final_price",
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        if (!orders) return res.status(500).json({ success: false, message: "Orders fetching failed" });

        return res.status(200).json({
            success: true,
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        });

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

        const totalCustomers = await User.countDocuments();
        return res.status(200).json({
            success: true,
            totalRevenue: revenue[0]?.totalRevenue || 0,
            totalDeliveredOrders: revenue[0]?.totalOrders || 0,
            recentOrders,
            totalCustomers
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
            .populate("user", "fullname email phone").populate({
                path: "product.product",
                select: "product_name product_images final_price",
            })
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

export const adminGetOrderCountsController = async (req, res) => {
    try {
        const counts = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        const unseenCount = await Order.countDocuments({ admin_seen: false });
        const result = { pending: 0, shipped: 0, delivered: 0, cancelled: 0, unseen: unseenCount };
        counts.forEach((c) => {
            if (result.hasOwnProperty(c._id)) result[c._id] = c.count;
        });
        return res.status(200).json({ success: true, counts: result });
    } catch (error) {
        console.log("error while getting order counts ", error);
        return res.status(500).json({ success: false, message: "Failed to get counts" });
    }
};

export const adminMarkOrdersSeenController = async (req, res) => {
    try {
        await Order.updateMany({ admin_seen: false }, { admin_seen: true });
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log("error while marking orders seen ", error);
        return res.status(500).json({ success: false, message: "Failed" });
    }
};
