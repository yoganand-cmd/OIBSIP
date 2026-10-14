const Order = require("../models/Order");
const Pizza = require("../models/Pizza");

const createOrder = async (req, res) => {
let reservedStock = [];

try {
const { items, deliveryAddress, paymentMethod } = req.body;

if (
  !req.user ||
  !Array.isArray(items) ||
  items.length === 0 ||
  typeof deliveryAddress !== "string" ||
  !deliveryAddress.trim()
) {
  return res.status(400).json({
    message: "Please provide valid order details"
  });
}

const selectedPaymentMethod = paymentMethod || "cod";

if (!["cod", "razorpay"].includes(selectedPaymentMethod)) {
  return res.status(400).json({
    message: "Invalid payment method"
  });
}

const orderItems = [];
let calculatedTotal = 0;

// Combine duplicate pizza IDs so stock is checked correctly.
const quantities = new Map();

for (const item of items) {
  if (
    !item.pizza ||
    !Number.isInteger(Number(item.quantity)) ||
    Number(item.quantity) < 1
  ) {
    return res.status(400).json({
      message: "One or more order items are invalid"
    });
  }

  const pizzaId = String(item.pizza);
  const quantity = Number(item.quantity);

  quantities.set(
    pizzaId,
    (quantities.get(pizzaId) || 0) + quantity
  );
}

// Reserve stock atomically to prevent orders exceeding inventory.
const pizzas = new Map();

for (const [pizzaId, quantity] of quantities) {
  const pizza = await Pizza.findOneAndUpdate(
    {
      _id: pizzaId,
      isAvailable: true,
      stockQuantity: { $gte: quantity }
    },
    {
      $inc: { stockQuantity: -quantity }
    },
    {
  returnDocument: "after"
    }
  );

  if (!pizza) {
    throw new Error(
      `INSUFFICIENT_STOCK:${pizzaId}`
    );
  }

  reservedStock.push({
    pizzaId,
    quantity
  });

  pizzas.set(pizzaId, pizza);
}

for (const item of items) {
  const pizza = pizzas.get(String(item.pizza));
  const quantity = Number(item.quantity);

  orderItems.push({
    pizza: pizza._id,
    name: pizza.name,
    price: pizza.price,
    quantity,
    size: item.size || "Regular",
    crust: item.crust || "Classic",
    cheese: item.cheese || "Regular",
    toppings: Array.isArray(item.toppings)
      ? item.toppings
      : []
  });

  calculatedTotal += pizza.price * quantity;
}

const order = await Order.create({
  user: req.user,
  items: orderItems,
  totalAmount: calculatedTotal,
  deliveryAddress: deliveryAddress.trim(),
  paymentMethod: selectedPaymentMethod,
  paymentStatus: "pending"
});

return res.status(201).json({
  message: "Order created successfully",
  order
});

} catch (error) {
// Restore reserved stock if order creation fails.
for (const reservation of reservedStock) {
try {
await Pizza.updateOne(
{ _id: reservation.pizzaId },
{ $inc: { stockQuantity: reservation.quantity } }
);
} catch (restoreError) {
console.error(
"Stock restoration failed:",
reservation.pizzaId
);
}
}

if (error.message?.startsWith("INSUFFICIENT_STOCK:")) {
  return res.status(400).json({
    message: "A selected pizza is unavailable or has insufficient stock"
  });
}

console.error("Create order error:", error);

return res.status(500).json({
  message: "Failed to create order"
});

}
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Customers can access only their own orders.
    // Admins can access any customer's orders.
    const User = require("../models/User");
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(401).json({
        message: "User not found or not authorized"
      });
    }

    if (user.role !== "admin" && userId !== req.user.toString()) {
      return res.status(403).json({
        message: "You can only access your own orders"
      });
    }

    const orders = await Order.find({ user: userId })
      .populate("items.pizza")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.pizza")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all orders",
      error: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      {
        returnDocument: "after",
    runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};