const asyncHandler = require("../utils/asyncHandler");
const Category = require("../models/Category");
const Product = require("../models/Product");

// @desc    Get all categories (optionally filter by type)
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.active) filter.isActive = req.query.active === "true";

  const categories = await Category.find(filter).sort({ name: 1 });
  res.json({ success: true, count: categories.length, data: categories });
});

// @desc    Get single category by ID or slug
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

  const category = await Category.findOne(
    isObjectId ? { _id: id } : { slug: id }
  );

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({ success: true, data: category });
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  Object.assign(category, req.body);
  const updatedCategory = await category.save();

  res.json({ success: true, data: updatedCategory });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const productCount = await Product.countDocuments({ category: category._id });
  if (productCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete category: ${productCount} product(s) are still assigned to it`
    );
  }

  await category.deleteOne();

  res.json({ success: true, message: "Category removed" });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
