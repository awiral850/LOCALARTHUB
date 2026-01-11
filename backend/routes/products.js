const express = require("express");
const Product = require("../models/Product");
const { verifyUser, optionalVerifyUser } = require("../authMiddleware");
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: path.join(__dirname, '../../images/') });

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
  
  // Ensure images is an array for each product
  const productsData = products.map(product => {
    const data = product.toObject();
    if (typeof data.images === 'string') {
      if (data.images === 'undefined') {
        data.images = [];
      } else {
        data.images = [data.images];
      }
    } else if (!Array.isArray(data.images)) {
      data.images = [];
    } else {
      // Filter out invalid images
      data.images = data.images.filter(img => img && img !== 'undefined' && img.trim() !== '');
    }
    return data;
  });
  
  res.json(productsData);
});

router.get("/:id", optionalVerifyUser, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  
  // Ensure images is an array
  const productData = product.toObject();
  if (typeof productData.images === 'string') {
    if (productData.images === 'undefined') {
      productData.images = [];
    } else {
      productData.images = [productData.images];
    }
  } else if (!Array.isArray(productData.images)) {
    productData.images = [];
  } else {
    // Filter out invalid images
    productData.images = productData.images.filter(img => img && img !== 'undefined' && img.trim() !== '');
  }
  
  res.json(productData);
});

router.post("/", upload.single('image'), verifyUser, async (req, res) => {
  console.log("Adding product:", req.body);
  const payload = { sellerId: req.user.uid };
  payload.title = req.body.title;
  payload.price = req.body.price;
  payload.stock = req.body.stock;
  payload.category = req.body.category;
  payload.subcategory = req.body.subcategory;
  payload.era = req.body.era;
  payload.description = req.body.description;

  if (req.file) {
    payload.images = [`/images/${req.file.filename}`];
  } else {
    payload.images = [req.body.image];
  }

  const product = await Product.create(payload);
  console.log("Product created:", product);
  res.json(product);
});

router.put("/:id", upload.single('image'), verifyUser, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  // allow if admin or owner
  if (!req.user.admin && product.sellerId !== req.user.uid) {
    return res.status(403).json({ message: "Not allowed to edit this product" });
  }

  const payload = {};
  if (req.body.title) payload.title = req.body.title;
  if (req.body.price) payload.price = req.body.price;
  if (req.body.stock) payload.stock = req.body.stock;
  if (req.body.category) payload.category = req.body.category;
  if (req.body.subcategory) payload.subcategory = req.body.subcategory;
  if (req.body.era) payload.era = req.body.era;
  if (req.body.description) payload.description = req.body.description;

  if (req.file) {
    payload.images = [`/images/${req.file.filename}`];
  } else if (req.body.image) {
    payload.images = [req.body.image];
  }

  Object.assign(product, payload);
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
