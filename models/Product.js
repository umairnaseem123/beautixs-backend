const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    type: {
      type: String,
      enum: ["skincare", "makeup"],
      required: [true, "Product type is required"],
    },
    // For skincare: e.g. "acne", "dryness", "anti-aging"
    // For makeup: e.g. "lipstick", "foundation", "eyeliner"
    concern: {
      type: String,
      trim: true,
    },
    subtype: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    skinType: {
      type: [String],
      enum: ["oily", "dry", "combination", "sensitive", "normal", "all"],
      default: ["all"],
    },
    shade: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-5);
  }
  next();
});

productSchema.index({ name: "text", description: "text", brand: "text" });

module.exports = mongoose.model("Product", productSchema);
