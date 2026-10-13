
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    pizza: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pizza",
      required: true
    },

    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    // Pizza customizations
    size: {
      type: String,
      enum: ["Regular", "Medium", "Large"],
      default: "Regular"
    },

    crust: {
      type: String,
      enum: ["Classic", "Thin", "Cheese Burst"],
      default: "Classic"
    },

    cheese: {
      type: String,
      enum: ["Regular", "Extra"],
      default: "Regular"
    },

    toppings: {
      type: [String],
      default: []
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item"
      }
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    deliveryAddress: {
      type: String,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay"],
      default: "cod"
    },

    paymentStatus: {
  type: String,
  enum: ["pending", "paid", "failed"],
  default: "pending"
},

// Razorpay payment references
razorpayOrderId: {
  type: String,
  default: null
},

razorpayPaymentId: {
  type: String,
  default: null
},

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "preparing",
        "out-for-delivery",
        "delivered",
        "cancelled"
      ],
      default: "placed"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);
