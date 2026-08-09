const asyncHandler = require("../utils/asyncHandler");
const BlogPost = require("../models/BlogPost");

// @desc    Get all published blog posts
// @route   GET /api/blog
// @access  Public
const getBlogPosts = asyncHandler(async (req, res) => {
  const filter = { isPublished: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;

  const posts = await BlogPost.find(filter)
    .populate("author", "name")
    .sort({ publishedAt: -1 });

  res.json({ success: true, count: posts.length, data: posts });
});

// @desc    Get all blog posts including drafts
// @route   GET /api/blog/admin
// @access  Private/Admin
const getAllBlogPostsAdmin = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find()
    .populate("author", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: posts.length, data: posts });
});

// @desc    Get single blog post by ID or slug
// @route   GET /api/blog/:id
// @access  Public
const getBlogPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

  const post = await BlogPost.findOne(
    isObjectId ? { _id: id } : { slug: id }
  ).populate("author", "name");

  if (!post) {
    res.status(404);
    throw new Error("Blog post not found");
  }

  res.json({ success: true, data: post });
});

// @desc    Create a blog post
// @route   POST /api/blog
// @access  Private/Admin
const createBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.create({
    ...req.body,
    author: req.user._id,
    publishedAt: req.body.isPublished ? Date.now() : undefined,
  });

  res.status(201).json({ success: true, data: post });
});

// @desc    Update a blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
const updateBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Blog post not found");
  }

  const wasPublished = post.isPublished;
  Object.assign(post, req.body);

  if (!wasPublished && post.isPublished) {
    post.publishedAt = Date.now();
  }

  const updatedPost = await post.save();
  res.json({ success: true, data: updatedPost });
});

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Blog post not found");
  }

  await post.deleteOne();
  res.json({ success: true, message: "Blog post removed" });
});

module.exports = {
  getBlogPosts,
  getAllBlogPostsAdmin,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
