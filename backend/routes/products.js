const express = require("express");
const Product = require("../models/Product");
const { verifyUser, optionalVerifyUser } = require("../authMiddleware");

const router = express.Router();

router.get("/", optionalVerifyUser, async (req, res) => {
  let products;
  // If authenticated admin, return all products
  if (req.user && req.user.admin) {
    products = await Product.find();
  } else if (req.user && req.user.seller) {
    // Sellers see only their own products in the seller/admin panel
    products = await Product.find({ sellerId: req.user.uid });
  } else {
    // Public listing
    products = await Product.find();
  }

  console.log("Fetched products:", products.length);
  res.json(products);
});

router.post("/", verifyUser, async (req, res) => {
  console.log("Adding product:", req.body);
  const payload = Object.assign({}, req.body, { sellerId: req.user.uid });
  const product = await Product.create(payload);
  console.log("Product created:", product);
  res.json(product);
});

router.put("/:id", verifyUser, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // allow if admin or owner
  if (!req.user.admin && product.sellerId !== req.user.uid) {
    return res.status(403).json({ message: "Not allowed to edit this product" });
  }

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

router.delete("/:id", verifyUser, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (!req.user.admin && product.sellerId !== req.user.uid) {
    return res.status(403).json({ message: "Not allowed to delete this product" });
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
