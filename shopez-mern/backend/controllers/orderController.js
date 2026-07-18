const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const STATUS_FLOW = ["confirmed", "processing", "shipped", "delivered"];

// @route  POST /api/orders
// body: { address, paymentMethod, upiId?, cardNumber?, cardExpiry?, cardCvv?, selectedBank? }
// Places an order from the user's current cart, exactly mirroring the frontend's validation
// @access Private
const placeOrder = async (req, res, next) => {
  try {
    const { address, paymentMethod, upiId, cardNumber, cardExpiry, cardCvv, selectedBank } = req.body;

    if (!address || !address.trim()) {
      return res.status(400).json({ message: "Delivery address is required." });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required." });
    }
    if (paymentMethod === "upi" && (!upiId || !upiId.trim())) {
      return res.status(400).json({ message: "Please enter your UPI ID." });
    }
    if (paymentMethod === "card") {
      if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
        return res.status(400).json({ message: "Please enter a valid 16-digit Card Number." });
      }
      if (!cardExpiry || !cardExpiry.trim()) {
        return res.status(400).json({ message: "Please enter Expiry Date (MM/YY)." });
      }
      if (!cardCvv || cardCvv.trim().length < 3) {
        return res.status(400).json({ message: "Please enter a valid CVV." });
      }
    }

    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user.cart.length) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    // Snapshot cart items & validate stock
    const items = [];
    let subtotal = 0;
    let origTotal = 0;

    for (const c of user.cart) {
      if (!c.product) continue;
      if (c.qty > c.product.stock) {
        return res.status(400).json({ message: `Insufficient stock for ${c.product.name}` });
      }
      items.push({
        product: c.product._id,
        name: c.product.name,
        img: c.product.img,
        price: c.product.price,
        originalPrice: c.product.originalPrice,
        selectedSize: c.selectedSize,
        qty: c.qty,
      });
      subtotal += c.product.price * c.qty;
      origTotal += c.product.originalPrice * c.qty;
    }

    const savings = origTotal - subtotal;
    const shipping = subtotal > 500 ? 0 : 49;
    const total = subtotal + shipping;

    let paymentDetails = "";
    if (paymentMethod === "upi") paymentDetails = `UPI (ID: ${upiId})`;
    else if (paymentMethod === "card") paymentDetails = `Card (ending in ${cardNumber.slice(-4)})`;
    else if (paymentMethod === "netbanking") paymentDetails = `Net Banking (${selectedBank || "N/A"})`;
    else paymentDetails = "Cash on Delivery";

    const order = await Order.create({
      orderNumber: "SZ" + Date.now(),
      user: user._id,
      items,
      subtotal,
      shipping,
      savings,
      total,
      address,
      paymentMethod,
      paymentDetails,
      status: "confirmed",
      trackingMessage: "Order confirmed and payment received.",
    });

    // Decrement stock
    for (const c of user.cart) {
      if (c.product) {
        await Product.findByIdAndUpdate(c.product._id, { $inc: { stock: -c.qty } });
      }
    }

    // Clear cart
    user.cart = [];
    await user.save();

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/orders
// @access Private (returns only the logged-in user's orders)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/orders/:id
// @access Private (owner or admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

// @route  PATCH /api/orders/:id/track
// Advances the order to its next status, mirroring the frontend's demo tracker
// @access Private (owner)
const advanceTracking = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "This order was cancelled and cannot be tracked." });
    }

    const idx = STATUS_FLOW.indexOf(order.status);
    const nextStatus = idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : order.status;

    const messages = {
      processing: "Your order is packed and handed over to the courier.",
      shipped: "Your order is out for delivery.",
      delivered: "Order delivered successfully.",
    };

    order.status = nextStatus;
    order.trackingMessage = messages[nextStatus] || order.trackingMessage;
    await order.save();

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

// @route  PATCH /api/orders/:id/cancel
// @access Private (owner)
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (order.status === "cancelled" || order.status === "delivered") {
      return res.status(400).json({ message: "This order cannot be cancelled." });
    }

    order.status = "cancelled";
    order.trackingMessage = "Order cancelled by you.";
    await order.save();

    // Restock items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, advanceTracking, cancelOrder };
