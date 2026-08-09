const express = require("express");
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
} = require("../controllers/reviewController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, isAdmin, getAllReviews);

router
  .route("/product/:productId")
  .get(getProductReviews)
  .post(verifyToken, createReview);

router.route("/:id").put(verifyToken, updateReview).delete(verifyToken, deleteReview);

module.exports = router;
