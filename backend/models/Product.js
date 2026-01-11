const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  images: [String], // Changed to array of images
  stock: Number,
  category: String,
  subcategory: String,
  era: String,
  description: String,
  sellerId: String
});

module.exports = mongoose.model("Product", ProductSchema);
