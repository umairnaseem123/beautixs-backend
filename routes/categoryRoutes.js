const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getCategories)
  .post(verifyToken, isAdmin, createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .put(verifyToken, isAdmin, updateCategory)
  .delete(verifyToken, isAdmin, deleteCategory);

module.exports = router;
