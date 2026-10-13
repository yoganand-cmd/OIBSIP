const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order and link it to the saved database order
router.post("/create-order", protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Saved order ID is required"
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user
    });

    if (!order) {
      return res.status(404).json({
        message: "Saved order not found"
      });
    }

    if (order.paymentMethod !== "razorpay") {
      return res.status(400).json({
        message: "This order is not a Razorpay order"
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "This order has already been paid"
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${order._id}`
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);

    return res.status(500).json({
      message: "Failed to create Razorpay order"
    });
  }
});

// Verify Razorpay payment signature
// Verify Razorpay payment signature
router.post("/verify-payment", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details"
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const signatureBuffer = Buffer.from(generatedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      signatureBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Payment signature is valid.
    // The order must be linked to this Razorpay order ID
    // before its database payment status can safely be updated.
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Matching saved order not found"
      });
    }

    order.paymentStatus = "paid";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully"
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
});

module.exports = router;