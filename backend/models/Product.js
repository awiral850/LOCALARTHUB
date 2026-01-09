const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  stock: Number,
  category: String,
  subcategory: String,
  era: String,
  description: String,
  sellerId: String
});

module.exports = mongoose.model("Product", ProductSchema);
