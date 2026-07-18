/**
 * Seeds the database with:
 *  - The 19 products from the original ShopEZ frontend (products.json)
 *  - The two demo accounts used by the frontend's LoginModal
 *
 * Run with: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const User = require("../models/User");
const productsData = require("./products.json");

const DEMO_USERS = [
  { name: "Demo User", email: "demo@shopez.com", password: "demo123", role: "USER" },
  { name: "Admin User", email: "admin@shopez.com", password: "admin123", role: "ADMIN" },
];

const seed = async () => {
  await connectDB();

  console.log("Clearing existing products...");
  await Product.deleteMany({});

  console.log(`Inserting ${productsData.length} products...`);
  // Strip the frontend's numeric "id" field — Mongo generates its own _id
  const docs = productsData.map(({ id, ...rest }) => rest);
  await Product.insertMany(docs);

  console.log("Seeding demo users (skipping any that already exist)...");
  for (const u of DEMO_USERS) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create(u);
      console.log(`  created ${u.email}`);
    } else {
      console.log(`  ${u.email} already exists, skipped`);
    }
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
