const express = require("express");
const Product = require("../models/Product");
const verifyUser = require("../authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  console.log("Fetched products:", products.length);
  res.json(products);
});

router.post("/", verifyUser, async (req, res) => {
  console.log("Adding product:", req.body);
  const product = await Product.create(req.body);
  console.log("Product created:", product);
  res.json(product);
});

router.put("/:id", verifyUser, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

router.delete("/:id", verifyUser, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
