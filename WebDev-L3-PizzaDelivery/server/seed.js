const mongoose = require("mongoose");
require("dotenv").config();

const Pizza = require("./models/Pizza");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const pizzas = [
  {
    name: "Margherita",
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil.",
    price: 299,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    category: "veg",
    ingredients: ["Tomato Sauce", "Mozzarella", "Basil"]
  },
  {
    name: "Farmhouse",
    description: "Loaded with onions, capsicum, mushrooms, and fresh vegetables.",
    price: 399,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    category: "veg",
    ingredients: ["Onion", "Capsicum", "Mushrooms", "Mozzarella"]
  },
  {
    name: "Paneer Tikka",
    description: "Indian-style pizza topped with spicy paneer tikka and vegetables.",
    price: 449,
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65",
    category: "veg",
    ingredients: ["Paneer", "Onion", "Capsicum", "Tikka Sauce"]
  },
  {
    name: "Chicken Pepperoni",
    description: "Cheesy pizza topped with chicken pepperoni and mozzarella.",
    price: 499,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    category: "non-veg",
    ingredients: ["Chicken Pepperoni", "Mozzarella", "Tomato Sauce"]
  },
  {
    name: "BBQ Chicken",
    description: "Smoky barbecue chicken pizza with onions and extra cheese.",
    price: 549,
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498",
    category: "non-veg",
    ingredients: ["BBQ Chicken", "Onion", "Mozzarella", "BBQ Sauce"]
  }
];

const adminPassword = "Admin12345";

const createAdmin = async () => {
  const existingAdmin = await User.findOne({
    email: "admin@pizzadelivery.com"
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: "Pizza Admin",
      email: "admin@pizzadelivery.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin user created successfully");
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Pizza.deleteMany();
    await Pizza.insertMany(pizzas);
    await createAdmin();

    console.log("Sample pizzas added successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();