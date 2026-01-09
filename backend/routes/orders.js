const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { verifyUser } = require("../authMiddleware");

const router = express.Router();

router.post("/", verifyUser, async (req, res) => {
  // Annotate each incoming item with sellerId
  const itemsIn = req.body.items || [];
  const annotated = [];

  for (const it of itemsIn) {
    const prod = await Product.findById(it.productId);
    annotated.push({
      productId: it.productId,
      qty: it.qty || 1,
      sellerId: prod ? prod.sellerId : null
    });
  }

  const order = await Order.create({
    userId: req.user.uid,
    items: annotated,
    total: req.body.total
  });

  res.json(order);
});

// Get orders: buyers get their orders, sellers get orders that include their products, admin gets all
router.get("/", verifyUser, async (req, res) => {
  if (req.user.admin) {
    const orders = await Order.find();
    return res.json(orders);
  }

  if (req.user.seller) {
    const orders = await Order.find({ "items.sellerId": req.user.uid });
    return res.json(orders);
  }

  const orders = await Order.find({ userId: req.user.uid });
  res.json(orders);
});

// Cancel an order (admin or seller related to order)
router.put("/:id/cancel", verifyUser, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  // admin can cancel any order
  if (req.user.admin) {
    order.status = "cancelled";
    await order.save();
    return res.json(order);
  }

  // seller can cancel orders that include their products
  if (req.user.seller) {
    const has = order.items.some(i => i.sellerId === req.user.uid);
    if (!has) return res.status(403).json({ message: "Not allowed to cancel this order" });
    order.status = "cancelled";
    await order.save();
    return res.json(order);
  }

  res.status(403).json({ message: "Not allowed to cancel this order" });
});

module.exports = router;
