// scripts/setAdmin.js
// Run once: node scripts/setAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const EMAIL = "umairnasim26@gmail.com"; // apna asli email yahan daalo
const NEW_PASSWORD = "Admin@1234"; // jo bhi simple password rakhna hai

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  let user = await User.findOne({ email: EMAIL });

  if (!user) {
    user = new User({
      name: "Admin",
      email: EMAIL,
      password: NEW_PASSWORD,
      role: "admin",
    });
  } else {
    user.password = NEW_PASSWORD; // pre-save hook ise hash kar dega
    user.role = "admin";
  }

  await user.save();
  console.log("Done. Login with:", EMAIL, "/", NEW_PASSWORD);

  await mongoose.disconnect();
}

run();
