const express = require("express");
const Order = require("../models/Order");
const verifyUser = require("../authMiddleware");

const router = express.Router();

router.post("/", verifyUser, async (req, res) => {
  const order = await Order.create({
    userId: req.user.uid,
    items: req.body.items,
    total: req.body.total
  });

  res.json(order);
});

router.get("/", verifyUser, async (req, res) => {
  const orders = await Order.find({ userId: req.user.uid });
  res.json(orders);
});

module.exports = router;
