
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Pizza = require("../models/Pizza");

const checkLowStock = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Low-stock alert skipped: email configuration is missing.");
      return;
    }

    const lowStockPizzas = await Pizza.find({
      $expr: {
        $lte: [
          { $ifNull: ["$stockQuantity", 50] },
          { $ifNull: ["$lowStockThreshold", 10] }
        ]
      }
    });

    if (lowStockPizzas.length === 0) {
      console.log("Low-stock check completed: no alerts needed.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const lines = lowStockPizzas.map((pizza) =>
      `${pizza.name}: ${pizza.stockQuantity ?? 50} remaining (threshold: ${pizza.lowStockThreshold ?? 10})`
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.LOW_STOCK_ALERT_EMAIL || process.env.EMAIL_USER,
      subject: "Pizza Delivery: Low Stock Alert",
      text: `The following pizzas have reached their stock thresholds:\n\n${lines.join("\n")}`
    });

    console.log(`Low-stock alert sent for ${lowStockPizzas.length} pizza(s).`);
  } catch (error) {
    console.error("Low-stock alert failed:", error.message);
  }
};

const startLowStockAlert = () => {
  // Run once at startup, then every 15 minutes.
  checkLowStock();

  cron.schedule("*/15 * * * *", checkLowStock);

  console.log("Low-stock alert scheduler started (every 15 minutes).");
};

module.exports = { startLowStockAlert, checkLowStock };
