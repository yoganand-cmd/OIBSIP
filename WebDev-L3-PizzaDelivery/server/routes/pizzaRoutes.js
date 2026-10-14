
const express = require("express");

const {
  getPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza
} = require("../controllers/pizzaController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// Public routes: customers can view pizzas
router.get("/", getPizzas);
router.get("/:id", getPizzaById);

// Admin-only routes: manage the pizza menu and inventory
router.post("/", protect, adminOnly, createPizza);
router.put("/:id", protect, adminOnly, updatePizza);
router.delete("/:id", protect, adminOnly, deletePizza);

module.exports = router;
