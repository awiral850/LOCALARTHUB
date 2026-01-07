const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  stock: Number,
  category: String,
  description: String
});

module.exports = mongoose.model("Product", ProductSchema);
