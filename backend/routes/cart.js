const express = require("express");
const Cart = require("../models/Cart");
const verifyUser = require("../authMiddleware");

const router = express.Router();

// add to cart
router.post("/", verifyUser, async (req, res) => {
  console.log("Adding to cart:", req.body);
  const { productId } = req.body;

  let item = await Cart.findOne({
    userId: req.user.uid,
    productId
  });

  if (item) {
    item.qty += 1;
    await item.save();
  } else {
    item = await Cart.create({
      userId: req.user.uid,
      productId
    });
  }

  res.json(item);
});

// get user cart
router.get("/", verifyUser, async (req, res) => {
  const cart = await Cart.find({ userId: req.user.uid });
  console.log("Fetched cart:", cart.length, "items");
  res.json(cart);
});

module.exports = router;
