import User from "../models/user.model.js";
import Order from "../models/order.model.js";

// GET /users?page=1&limit=10&search=john
export const adminGetUsersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";

    const query = {};
    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
      // If search is a number, also match phone
      if (!isNaN(search)) {
        query.$or.push({ phone: Number(search) });
      }
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password -otp -otpExpiry -otp_limit -cart")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Attach order stats for each user
    const userIds = users.map((u) => u._id);
    const orderStats = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total_price" },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
    ]);

    const statsMap = {};
    orderStats.forEach((s) => {
      statsMap[s._id.toString()] = s;
    });

    const enrichedUsers = users.map((u) => ({
      ...u,
      orderStats: statsMap[u._id.toString()] || {
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null,
      },
    }));

    return res.status(200).json({
      users: enrichedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.log("error while getting users ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /users/:id  — single user + their orders
export const adminGetUserDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password -otp -otpExpiry -otp_limit -cart")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const orders = await Order.find({ user: id })
      .populate({
        path: "product.product",
        select: "product_name product_images final_price",
      })
      .sort({ createdAt: -1 })
      .lean();

    // summary stats
    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, o) => sum + (o.total_price || 0), 0),
      delivered: orders.filter((o) => o.status === "delivered").length,
      pending: orders.filter((o) => o.status === "pending").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    return res.status(200).json({ user, orders, stats });
  } catch (error) {
    console.log("error while getting user details ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
