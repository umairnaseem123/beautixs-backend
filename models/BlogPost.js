const mongoose = require("mongoose");
const slugify = require("slugify");

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["skincare-tips", "makeup-tips", "product-guide", "trends", "general"],
      default: "general",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

blogPostSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-5);
  }
  next();
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
