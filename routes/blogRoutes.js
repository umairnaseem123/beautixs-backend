const express = require("express");
const router = express.Router();
const {
  getBlogPosts,
  getAllBlogPostsAdmin,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} = require("../controllers/blogController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/admin", verifyToken, isAdmin, getAllBlogPostsAdmin);

router.route("/").get(getBlogPosts).post(verifyToken, isAdmin, createBlogPost);

router
  .route("/:id")
  .get(getBlogPostById)
  .put(verifyToken, isAdmin, updateBlogPost)
  .delete(verifyToken, isAdmin, deleteBlogPost);

module.exports = router;
