const User = require("../models/User");
const Product = require("../models/Product");

// @route  GET /api/wishlist
// @access Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/wishlist/:productId
// Toggles a product in/out of the wishlist
// @access Private
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);
    const isIn = user.wishlist.some((id) => id.toString() === productId);

    if (isIn) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const populated = await user.populate("wishlist");
    res.json({ wishlist: populated.wishlist, added: !isIn });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/wishlist/:productId
// @access Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
    await user.save();
    const populated = await user.populate("wishlist");
    res.json({ wishlist: populated.wishlist });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
