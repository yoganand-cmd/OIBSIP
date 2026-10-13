const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { startLowStockAlert } = require("./jobs/lowStockAlert");
const app = express();

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Database connection process completed");
    startLowStockAlert();
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", paymentRoutes);
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Pizza Delivery API is running!"
  });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});