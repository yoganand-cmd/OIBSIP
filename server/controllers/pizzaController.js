const Pizza = require("../models/Pizza");

// Get all available pizzas
const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true }).sort({
      createdAt: -1,
    });

    res.status(200).json(pizzas);
  } catch (error) {
    console.error("Failed to fetch pizzas:", error);
    res.status(500).json({
      message: "Failed to fetch pizzas",
    });
  }
};

// Get one pizza by ID
const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        message: "Pizza not found",
      });
    }

    res.status(200).json(pizza);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pizza",
    });
  }
};

// Validate inventory values
const validateInventory = (stockQuantity, lowStockThreshold) => {
  return (
    Number.isInteger(Number(stockQuantity)) &&
    Number(stockQuantity) >= 0 &&
    Number.isInteger(Number(lowStockThreshold)) &&
    Number(lowStockThreshold) >= 0
  );
};

// Create a pizza
const createPizza = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      ingredients,
      isAvailable,
      stockQuantity = 50,
      lowStockThreshold = 10,
    } = req.body;

    if (
      !name?.trim() ||
      price === undefined ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      !category
    ) {
      return res.status(400).json({
        message: "Provide a name, valid price, and category.",
      });
    }

    if (!validateInventory(stockQuantity, lowStockThreshold)) {
      return res.status(400).json({
        message: "Stock quantity and low-stock threshold must be non-negative whole numbers.",
      });
    }

    const pizza = await Pizza.create({
      name: name.trim(),
      description,
      price: Number(price),
      image,
      category,
      ingredients,
      isAvailable: isAvailable ?? true,
      stockQuantity: Number(stockQuantity),
      lowStockThreshold: Number(lowStockThreshold),
    });

    res.status(201).json({
      message: "Pizza created successfully",
      pizza,
    });
  } catch (error) {
    console.error("Failed to create pizza:", error);
    res.status(400).json({
      message: "Failed to create pizza",
    });
  }
};

// Update a pizza
const updatePizza = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Validate inventory only when the fields are supplied.
    for (const field of ["stockQuantity", "lowStockThreshold"]) {
      if (
        updates[field] !== undefined &&
        (!Number.isInteger(Number(updates[field])) ||
          Number(updates[field]) < 0)
      ) {
        return res.status(400).json({
          message: `${field} must be a non-negative whole number.`,
        });
      }
    }

    if (updates.stockQuantity !== undefined) {
      updates.stockQuantity = Number(updates.stockQuantity);
    }

    if (updates.lowStockThreshold !== undefined) {
      updates.lowStockThreshold = Number(updates.lowStockThreshold);
    }

    if (updates.price !== undefined) {
      if (
        updates.price === "" ||
        !Number.isFinite(Number(updates.price)) ||
        Number(updates.price) < 0
      ) {
        return res.status(400).json({
          message: "Price must be a valid non-negative number.",
        });
      }

      updates.price = Number(updates.price);
    }

    const pizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      updates,
      {
  returnDocument: "after",
  runValidators: true,
      }
    );

    if (!pizza) {
      return res.status(404).json({
        message: "Pizza not found",
      });
    }

    res.status(200).json({
      message: "Pizza updated successfully",
      pizza,
    });
  } catch (error) {
    console.error("Failed to update pizza:", error);
    res.status(400).json({
      message: "Failed to update pizza",
    });
  }
};

// Delete a pizza
const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        message: "Pizza not found",
      });
    }

    res.status(200).json({
      message: "Pizza deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete pizza",
    });
  }
};

module.exports = {
  getPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
};