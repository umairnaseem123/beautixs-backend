const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Product");

// @desc    Get all products (with filtering, search, pagination)
// @route   GET /api/products
// @access  Public
// Query params: type, category, concern, subtype, brand, skinType,
//                minPrice, maxPrice, search, sort, page, limit, featured
const getProducts = asyncHandler(async (req, res) => {
  const {
    type,
    category,
    concern,
    subtype,
    brand,
    skinType,
    minPrice,
    maxPrice,
    search,
    sort,
    featured,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = { isActive: true };

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (concern) filter.concern = concern;
  if (subtype) filter.subtype = subtype;
  if (brand) filter.brand = brand;
  if (skinType) filter.skinType = { $in: [skinType] };
  if (featured) filter.isFeatured = featured === "true";

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$text = { $search: search };
  }

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };
  if (sort === "rating") sortOption = { rating: -1 };
  if (sort === "newest") sortOption = { createdAt: -1 };

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug type")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: products,
  });
});

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

  const product = await Product.findOne(
    isObjectId ? { _id: id } : { slug: id }
  ).populate("category", "name slug type");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, data: product });
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);
  const updatedProduct = await product.save();

  res.json({ success: true, data: updatedProduct });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.json({ success: true, message: "Product removed" });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
