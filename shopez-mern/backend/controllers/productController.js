const Product = require("../models/Product");

// @route  GET /api/products
// Supports: ?search=&category=&brand=&minPrice=&maxPrice=&tag=&sort=priceLow|priceHigh|rating|discount&page=&limit=
// @access Public
const getProducts = async (req, res, next) => {
  try {
    const { search, category, brand, minPrice, maxPrice, tag, sort } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (tag) query.tags = tag;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "priceLow") sortOption = { price: 1 };
    if (sort === "priceHigh") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };
    if (sort === "discount") sortOption = { discount: -1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/products/:id
// @access Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/products
// @access Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/products/meta/categories
// @access Public
const getCategories = async (req, res, next) => {
  try {
    const categories = [
      { id: "electronics", name: "Electronics", icon: "💻" },
      { id: "fashion", name: "Fashion", icon: "👗" },
      { id: "home", name: "Home & Kitchen", icon: "🏠" },
      { id: "beauty", name: "Beauty", icon: "💄" },
      { id: "sports", name: "Sports", icon: "⚽" },
      { id: "books", name: "Books", icon: "📚" },
    ];
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
};
