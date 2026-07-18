const User = require("../models/User");
const Product = require("../models/Product");

// @route  GET /api/cart
// @access Private
const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.json({ cart: user.cart });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/cart
// body: { productId, selectedSize, qty }
// @access Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, selectedSize = "", qty = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);
    const existing = user.cart.find(
      (c) => c.product.toString() === productId && c.selectedSize === selectedSize
    );

    if (existing) {
      existing.qty = Math.min(product.stock, existing.qty + qty);
    } else {
      user.cart.push({ product: productId, selectedSize, qty: Math.min(qty, product.stock) });
    }

    await user.save();
    const populated = await user.populate("cart.product");
    res.status(201).json({ cart: populated.cart });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/cart/:productId
// body: { selectedSize, qty }
// @access Private
const updateCartItem = async (req, res, next) => {
  try {
    const { qty, selectedSize = "" } = req.body;
    const user = await User.findById(req.user._id);

    const item = user.cart.find(
      (c) => c.product.toString() === req.params.productId && c.selectedSize === selectedSize
    );
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.qty = qty;
    await user.save();
    const populated = await user.populate("cart.product");
    res.json({ cart: populated.cart });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/cart/:productId
// query: ?selectedSize=
// @access Private
const removeFromCart = async (req, res, next) => {
  try {
    const { selectedSize = "" } = req.query;
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(
      (c) => !(c.product.toString() === req.params.productId && c.selectedSize === selectedSize)
    );
    await user.save();
    const populated = await user.populate("cart.product");
    res.json({ cart: populated.cart });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/cart
// @access Private
const clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json({ cart: [] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
