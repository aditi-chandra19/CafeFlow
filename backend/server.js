const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { auth, adminOnly } = require("./middleware/auth");

const User = require("./models/User");
const Order = require("./models/order");
const Menu = require("./models/menu");
const Restaurant = require("./models/Restaurant");

const app = express();

app.use(cors());
app.use(express.json());

console.log("🔥 CLEAN SERVER RUNNING 🔥");


// ================= BASIC ROUTES =================

app.get("/", (req, res) => {
  res.send("CafeFlow Backend Running ☕");
});

app.get("/ping", (req, res) => {
  res.send("Backend alive");
});


// ================= RESTAURANT ROUTES =================

app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});

app.get("/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant" });
  }
});


// ================= MENU ROUTE (BY RESTAURANT) =================

app.get("/menu/:restaurantId", async (req, res) => {
  try {
    const items = await Menu.find({
      restaurantId: req.params.restaurantId
    });

    res.json(items);
  } catch (error) {
    console.log("MENU FETCH ERROR:", error);
    res.status(500).json({ message: "Error fetching menu" });
  }
});


// ================= AUTH ROUTES =================

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer"
    });

    await newUser.save();

    res.json({ message: "User registered successfully ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretkey123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= ORDER ROUTES =================

app.post("/place-order", auth, async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = new Order({
      userId: req.user.id,
      items,
      total
    });

    await newOrder.save();

    res.json({ message: "Order placed successfully ✅" });

  } catch (error) {
    console.log("ORDER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

app.get("/all-orders", auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
});


// ================= CONNECT DATABASE =================

mongoose.connect("mongodb://127.0.0.1:27017/cafedb")
.then(() => {
  console.log("MongoDB Connected Successfully ✅");

  app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
  });
})
.catch(err => console.log(err));