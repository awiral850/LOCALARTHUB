const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '.env') });

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("PORT:", process.env.PORT);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI is not set in environment variables");
  process.exit(1);
}

mongoose.connect(mongoUri)
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

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);
