const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo error:", err))

  app.get("/", (req, res) => res.send("API running"));

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running at port " + (process.env.PORT || 5000))
);

const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);


const cartRoutes = require("./routes/cart");
app.use("/api/cart", cartRoutes);


const orderRoutes = require("./routes/orders");
app.use("/api/orders", orderRoutes);
