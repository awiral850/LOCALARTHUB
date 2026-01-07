const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  total: Number,
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Order", OrderSchema);
