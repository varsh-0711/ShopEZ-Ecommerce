const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// @route  GET /api/admin/overview
// @access Private/Admin
const getOverview = async (req, res, next) => {
  try {
    const [totalOrders, totalProducts, totalUsers, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).populate("user", "name email");

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/orders
// @access Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

// @route  PATCH /api/admin/orders/:id/status
// body: { status }
// @access Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const valid = ["confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/users
// @access Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -cart -wishlist");
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// @route  PATCH /api/admin/users/:id/role
// body: { role: "USER" | "ADMIN" }
// @access Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @route  PATCH /api/admin/users/:id/deactivate
// @access Private/Admin
const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ user: user.toSafeObject(), isActive: user.isActive });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/analytics
// Basic sales-by-category and revenue-over-time breakdown
// @access Private/Admin
const getAnalytics = async (req, res, next) => {
  try {
    const salesByCategory = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: "$productInfo.category",
          revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
          unitsSold: { $sum: "$items.qty" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    const revenueByDay = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ salesByCategory, revenueByDay });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOverview,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  toggleUserActive,
  getAnalytics,
};
