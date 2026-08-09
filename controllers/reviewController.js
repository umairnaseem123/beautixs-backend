const asyncHandler = require("../utils/asyncHandler");
const Review = require("../models/Review");
const Product = require("../models/Product");

// Recalculate and save a product's average rating and review count
const recalculateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    rating: stats[0]?.avgRating || 0,
    numReviews: stats[0]?.numReviews || 0,
  });
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    product: req.params.productId,
    isApproved: true,
  }).sort({ createdAt: -1 });

  res.json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Create a review for a product
// @route   POST /api/reviews/product/:productId
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
  });

  await recalculateProductRating(product._id);

  res.status(201).json({ success: true, data: review });
});

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this review");
  }

  review.rating = req.body.rating ?? review.rating;
  review.comment = req.body.comment ?? review.comment;

  const updatedReview = await review.save();
  await recalculateProductRating(review.product);

  res.json({ success: true, data: updatedReview });
});

// @desc    Delete a review (owner or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  const isOwner = review.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  const productId = review.product;
  await review.deleteOne();
  await recalculateProductRating(productId);

  res.json({ success: true, message: "Review removed" });
});

// @desc    Get all reviews (admin moderation)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("product", "name")
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: reviews.length, data: reviews });
});

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
};
