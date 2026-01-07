const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  qty: { type: Number, default: 1 }
});

module.exports = mongoose.model("Cart", CartSchema);
