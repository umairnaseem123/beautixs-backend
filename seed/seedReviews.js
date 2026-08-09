require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");

const REVIEWER_NAMES = [
  "Ayesha Khan",
  "Sara Ahmed",
  "Fatima Malik",
  "Zainab Raza",
  "Hira Sheikh",
  "Amna Iqbal",
  "Mahnoor Aslam",
  "Iqra Farooq",
  "Sana Baig",
  "Rabia Yousuf",
  "Noor Fatima",
  "Aliza Hassan",
  "Maryam Siddiqui",
  "Kiran Javed",
  "Anum Tariq",
];

const COMMENT_TEMPLATES = [
  "Absolutely love this! {product} has become a staple in my routine.",
  "Great quality for the price. Noticed a difference within a couple weeks.",
  "This exceeded my expectations. Will definitely repurchase.",
  "Good product overall, packaging could be better but the results are worth it.",
  "My skin feels so much better since I started using this. Highly recommend!",
  "Decent product, does what it says. Nothing extraordinary but reliable.",
  "Been using this for a month now and I'm impressed with the results.",
  "Perfect for my skin type. Gentle and effective.",
  "Fast shipping and the product works really well. Very happy with this purchase.",
  "One of the better products I've tried from Beautixs. Worth the money.",
  "It's okay, not amazing but not bad either. Might repurchase.",
  "Amazing texture and smell. Doesn't feel heavy on the skin at all.",
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function ensureReviewerUsers() {
  const existing = await User.find({ email: /^reviewer\d+@beautixs\.demo$/ });
  if (existing.length >= REVIEWER_NAMES.length) return existing;

  const toCreate = REVIEWER_NAMES.slice(existing.length).map((name, idx) => ({
    name,
    email: `reviewer${existing.length + idx + 1}@beautixs.demo`,
    password: "DemoReviewer@123",
    role: "customer",
  }));

  const created = await User.create(toCreate);
  return [...existing, ...created];
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const reviewers = await ensureReviewerUsers();
  const products = await Product.find({});
  console.log(`Found ${products.length} products`);

  for (const product of products) {
    const reviewCount = randomInt(3, 5);
    const chosenReviewers = shuffle(reviewers).slice(0, reviewCount);

    const reviewDocs = chosenReviewers.map((reviewer) => {
      const rating = randomInt(4, 5); // mostly positive, realistic
      const template = pickRandom(COMMENT_TEMPLATES);
      const comment = template.replace("{product}", product.name);
      return {
        product: product._id,
        user: reviewer._id,
        name: reviewer.name,
        rating,
        comment,
        isApproved: true,
      };
    });

    // Skip reviewers who already reviewed this product (unique index safety)
    for (const doc of reviewDocs) {
      const exists = await Review.findOne({
        product: doc.product,
        user: doc.user,
      });
      if (!exists) {
        await Review.create(doc);
      }
    }

    const allReviews = await Review.find({ product: product._id });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    product.rating = Math.round(avgRating * 10) / 10;
    product.numReviews = allReviews.length;
    await product.save();

    console.log(
      `${product.name}: ${allReviews.length} reviews, avg rating ${product.rating}`,
    );
  }

  console.log("Done seeding reviews.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
