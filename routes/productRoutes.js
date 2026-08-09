const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.route("/").get(getProducts).post(verifyToken, isAdmin, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(verifyToken, isAdmin, updateProduct)
  .delete(verifyToken, isAdmin, deleteProduct);

module.exports = router;
