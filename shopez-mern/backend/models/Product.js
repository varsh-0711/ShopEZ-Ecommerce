const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["electronics", "fashion", "home", "beauty", "sports", "books"],
    },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    image: { type: String, default: "🛍️" }, // emoji fallback
    img: { type: String, default: "" }, // real image URL
    sizes: [{ type: String }],
    brand: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, default: "" },
    discount: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Virtual: computed discount %, kept in sync on save
productSchema.pre("save", function (next) {
  if (this.originalPrice > 0) {
    this.discount = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  next();
});

productSchema.index({ name: "text", brand: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
