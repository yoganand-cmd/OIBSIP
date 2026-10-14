
const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    image: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true
    },

    ingredients: {
      type: [String],
      default: []
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    // Available inventory quantity
    stockQuantity: {
      type: Number,
      default: 50,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Stock quantity must be a whole number."
      }
    },

    // Alert when stock reaches this quantity or lower
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Low-stock threshold must be a whole number."
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Pizza", pizzaSchema);
