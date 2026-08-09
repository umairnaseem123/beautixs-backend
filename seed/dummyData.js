const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");

// ⚠️ All `price` / `discountPrice` values below are PLACEHOLDERS.
// Search this file for "PLACEHOLDER" to find every price that needs
// to be replaced with the real price from the client before going live.
//
// Image paths point at the Next.js frontend's /public/assets/products
// folder (e.g. http://localhost:3000/assets/products/...). The frontend
// serves these directly, so the backend just stores the relative path.

const categories = [
  {
    name: "Sunscreen",
    type: "skincare",
    description: "SPF protection for daily use",
  },
  {
    name: "Serums",
    type: "skincare",
    description: "Targeted treatments for specific skin concerns",
  },
  {
    name: "Masks",
    type: "skincare",
    description: "Clay, sheet, and treatment masks",
  },
  {
    name: "Eye Care",
    type: "skincare",
    description: "Eye creams and treatments",
  },
  { name: "Kits", type: "skincare", description: "Travel and special sets" },
  {
    name: "Multi-use",
    type: "makeup",
    description: "Multi-purpose lip and cheek products",
  },
  {
    name: "Lip Tint",
    type: "makeup",
    description: "Sheer, buildable lip tints",
  },
  {
    name: "Eyebrow",
    type: "makeup",
    description: "Brow pencils, gels, and powders",
  },
];

const productsData = [
  {
    name: "Beauty of Joseon Relief Sun",
    description:
      "A cult-favorite lightweight sunscreen formulated with rice extract and probiotics to protect skin from UV damage while keeping it hydrated and glowing. Leaves no white cast and layers well under makeup.",
    shortDescription:
      "Lightweight daily sunscreen with rice and probiotics for a dewy, hydrated finish.",
    price: 2800, // PLACEHOLDER PRICE
    discountPrice: null,
    stock: 30,
    categoryName: "Sunscreen",
    type: "skincare",
    concern: "sun protection",
    subtype: "sunscreen",
    brand: "Beauty of Joseon",
    ingredients: ["Rice Extract", "Probiotics", "SPF 50+"],
    skinType: ["all"],
    sizes: ["50ml"],
    howToUse:
      "Apply generously as the last step of your morning skincare routine, before makeup.",
    images: [
      "/assets/products/beauty-of-joseon-relief-sun/1.jpeg",
      "/assets/products/beauty-of-joseon-relief-sun/2.jpeg",
      "/assets/products/beauty-of-joseon-relief-sun/3.png",
      "/assets/products/beauty-of-joseon-relief-sun/4.png",
    ],
    rating: 4.8,
    numReviews: 214,
    badges: ["bestseller"],
    isFeatured: true,
  },
  {
    name: "GEGEBEAR Lips & Cheek Multi-purpose Cream",
    description:
      "A creamy, blendable multi-stick that adds a natural flush of color to both lips and cheeks in seconds. Buildable formula that melts into skin for a your-skin-but-better finish.",
    shortDescription:
      "Multi-purpose cream tint for a soft, natural flush on lips and cheeks.",
    price: 1800, // PLACEHOLDER PRICE
    discountPrice: null,
    stock: 35,
    categoryName: "Multi-use",
    type: "makeup",
    subtype: "cream tint",
    brand: "GEGEBEAR",
    ingredients: ["Shea Butter", "Vitamin E"],
    shades: ["Coral", "Rose", "Peach"],
    howToUse:
      "Dab onto cheeks and blend with fingertips, then swipe directly onto lips.",
    images: [
      "/assets/products/gegebear-lips-cheek-cream/1.jpg",
      "/assets/products/gegebear-lips-cheek-cream/2.jpg",
      "/assets/products/gegebear-lips-cheek-cream/3.jpg",
    ],
    rating: 4.6,
    numReviews: 87,
    badges: ["new"],
  },
  {
    name: "Glutathione Eye Cream Special Set",
    description:
      "A complete eye care set formulated with glutathione and brightening actives to visibly reduce the look of dark circles, puffiness, and fine lines around the delicate eye area.",
    shortDescription:
      "Brightening eye cream set with glutathione to target dark circles and puffiness.",
    price: 3800, // PLACEHOLDER PRICE (original price)
    discountPrice: 3200, // PLACEHOLDER PRICE (sale price)
    stock: 20,
    categoryName: "Eye Care",
    type: "skincare",
    concern: "dark circles",
    subtype: "eye cream set",
    ingredients: ["Glutathione", "Niacinamide", "Caffeine"],
    skinType: ["all"],
    includes: ["Eye Cream 15ml", "Applicator Wand", "Travel Pouch"],
    howToUse:
      "Gently pat a small amount around the orbital bone morning and night.",
    images: [
      "/assets/products/glutathione-eye-cream-set/1.jpeg",
      "/assets/products/glutathione-eye-cream-set/2.png",
      "/assets/products/glutathione-eye-cream-set/3.webp",
      "/assets/products/glutathione-eye-cream-set/4.png",
    ],
    rating: 4.7,
    numReviews: 52,
    badges: ["bestseller", "sale"],
    isFeatured: true,
  },
  {
    name: "Madagascar Centella Asiatica 100 Ampoule",
    description:
      "A concentrated ampoule packed with centella asiatica extract to calm redness, strengthen the skin barrier, and support recovery for sensitive or irritated skin.",
    shortDescription:
      "Soothing ampoule with 100% centella asiatica extract to calm and repair skin.",
    price: 2600, // PLACEHOLDER PRICE
    discountPrice: null,
    stock: 42,
    categoryName: "Serums",
    type: "skincare",
    concern: "sensitivity",
    subtype: "ampoule",
    brand: "SKIN1004",
    ingredients: ["Centella Asiatica", "Madecassoside"],
    skinType: ["sensitive", "all"],
    sizes: ["100ml"],
    howToUse:
      "Apply 2-3 drops to clean skin morning and night before moisturizer.",
    images: [
      "/assets/products/madagascar-centella-ampoule/1.png",
      "/assets/products/madagascar-centella-ampoule/2.png",
      "/assets/products/madagascar-centella-ampoule/3.png",
      "/assets/products/madagascar-centella-ampoule/4.png",
    ],
    rating: 4.9,
    numReviews: 301,
    badges: ["bestseller"],
    isFeatured: true,
  },
  {
    name: "Madagascar Centella Poremizing Quick Clay Stick Mask",
    description:
      "A no-mess clay stick mask that glides on for targeted pore care. Formulated with centella asiatica to purify oily areas without over-drying skin.",
    shortDescription:
      "Convenient stick-format clay mask to minimize pores and control oil.",
    price: 1900, // PLACEHOLDER PRICE
    discountPrice: null,
    stock: 25,
    categoryName: "Masks",
    type: "skincare",
    concern: "pores",
    subtype: "clay stick mask",
    brand: "SKIN1004",
    ingredients: ["Centella Asiatica", "Kaolin Clay"],
    skinType: ["oily", "combination"],
    sizes: ["40g"],
    howToUse:
      "Glide onto clean, dry skin in circular motions, leave 5-10 minutes, then rinse.",
    images: [
      "/assets/products/madagascar-clay-stick-mask/1.jpg",
      "/assets/products/madagascar-clay-stick-mask/2.jpg",
      "/assets/products/madagascar-clay-stick-mask/3.jpg",
      "/assets/products/madagascar-clay-stick-mask/4.jpg",
    ],
    rating: 4.5,
    numReviews: 76,
  },
  {
    name: "Madagascar Centella Travel Kit",
    description:
      "A curated travel kit featuring mini sizes of the Madagascar Centella lineup — everything you need to keep your calming skincare routine going while traveling.",
    shortDescription:
      "Travel-sized centella asiatica essentials for skin-soothing skincare on the go.",
    price: 2400, // PLACEHOLDER PRICE
    discountPrice: null,
    stock: 18,
    categoryName: "Kits",
    type: "skincare",
    concern: "sensitivity",
    subtype: "travel kit",
    brand: "SKIN1004",
    ingredients: ["Centella Asiatica"],
    skinType: ["sensitive", "all"],
    includes: ["Mini Ampoule", "Mini Cleanser", "Mini Cream", "Pouch"],
    howToUse:
      "Use as a complete mini routine morning and night while traveling.",
    images: [
      "/assets/products/madagascar-travel-kit/1.jpg",
      "/assets/products/madagascar-travel-kit/2.png",
      "/assets/products/madagascar-travel-kit/3.webp",
      "/assets/products/madagascar-travel-kit/4.png",
    ],
    rating: 4.7,
    numReviews: 44,
    badges: ["new"],
  },
  {
    name: "The Juicy Tints",
    description:
      "A sheer, buildable lip tint that gives lips a natural juicy flush of color with a comfortable, non-drying finish. Available in multiple everyday-wearable shades.",
    shortDescription:
      "Juicy, buildable lip tints in a range of everyday shades.",
    price: 1450, // PLACEHOLDER PRICE
    discountPrice: null,
    stock: 60,
    categoryName: "Lip Tint",
    type: "makeup",
    subtype: "lip tint",
    ingredients: ["Jojoba Oil", "Vitamin E"],
    shades: ["Dark Coconut", "Juju Fig", "Mulled Peach", "Plum Coke"],
    howToUse: "Apply directly to lips, blend with fingertip for a softer look.",
    images: [
      "/assets/products/the-juicy-tints/main.webp",
      "/assets/products/the-juicy-tints/juju-fig.webp",
      "/assets/products/the-juicy-tints/mulled-peach.webp",
      "/assets/products/the-juicy-tints/plum-coke.webp",
    ],
    rating: 4.6,
    numReviews: 168,
    badges: ["bestseller"],
    isFeatured: true,
  },
  {
    name: "Unleashia Shaper Defining Eyebrow Pencil",
    description:
      "A fine-tip brow pencil that lets you draw natural, hair-like strokes for a fuller, defined brow shape that lasts all day without smudging.",
    shortDescription:
      "Precision brow pencil for natural, defined, feathery-looking brows.",
    price: 1650, // PLACEHOLDER PRICE
    discountPrice: null,
    stock: 50,
    categoryName: "Eyebrow",
    type: "makeup",
    subtype: "eyebrow pencil",
    brand: "Unleashia",
    shades: ["Ash Brown", "Natural Brown", "Grey Brown"],
    howToUse:
      "Use short, feathery strokes following your natural brow shape, then blend with a spoolie.",
    images: [
      "/assets/products/unleashia-eyebrow-pencil/1.jpg",
      "/assets/products/unleashia-eyebrow-pencil/2.png",
      "/assets/products/unleashia-eyebrow-pencil/3.png",
      "/assets/products/unleashia-eyebrow-pencil/4.jpg",
    ],
    rating: 4.5,
    numReviews: 93,
  },
];

const importData = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany({ email: "admin@beautixs.com" });

    console.log("Seeding categories...");
    const createdCategories = await Category.create(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log("Seeding products...");
    const productsWithCategory = productsData.map(
      ({ categoryName, ...rest }) => ({
        ...rest,
        category: categoryMap[categoryName],
      }),
    );
    await Product.create(productsWithCategory);

    console.log("Seeding admin user...");
    await User.create({
      name: "Beautixs Admin",
      email: "admin@beautixs.com",
      password: "Admin@12345",
      role: "admin",
    });

    console.log("Data imported successfully!");
    console.log(
      "Admin login -> email: admin@beautixs.com | password: Admin@12345",
    );
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany({ email: "admin@beautixs.com" });

    console.log("Data destroyed successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
