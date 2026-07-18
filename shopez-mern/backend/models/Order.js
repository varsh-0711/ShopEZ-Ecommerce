const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    img: String,
    price: Number,
    originalPrice: Number,
    selectedSize: String,
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true }, // e.g. "SZ1719999999999"
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true, default: 0 },
    savings: { type: Number, default: 0 },
    total: { type: Number, required: true },
    address: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "cod"],
      required: true,
    },
    paymentDetails: { type: String, default: "" }, // e.g. "UPI (ID: xyz@bank)"
    status: {
      type: String,
      enum: ["confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "confirmed",
    },
    trackingMessage: { type: String, default: "Order confirmed and payment received." },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
