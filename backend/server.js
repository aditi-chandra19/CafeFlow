const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TableBooking = require("./models/TableBooking");
const { auth, adminOnly } = require("./middleware/auth");

const User = require("./models/User");
const Order = require("./models/order");
const Menu = require("./models/menu");
const Restaurant = require("./models/Restaurant");

const app = express();
const JWT_SECRET = "secretkey123";

app.use(cors());
app.use(express.json());

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    pincode: user.pincode || "",
    referralCode: user.referralCode || ""
  };
}

function formatOrderResponse(order) {
  return {
    _id: order._id,
    orderId: String(order._id),
    batchId: order.batchId,
    restaurantId: order.restaurantId,
    restaurantName: order.restaurantName,
    items: order.items || [],
    subtotal: order.subtotal || 0,
    couponDiscountShare: order.couponDiscountShare || 0,
    multiRestaurantDiscountShare: order.multiRestaurantDiscountShare || 0,
    deliveryFeeShare: order.deliveryFeeShare || 0,
    platformFeeShare: order.platformFeeShare || 0,
    total: order.total || 0,
    totalAmount: order.total || 0,
    finalTotalAmount: order.total || 0,
    paymentMethod: order.paymentMethod || "",
    bank: order.bank || "",
    orderMode: order.orderMode || "Delivery",
    preOrderTime: order.preOrderTime || "",
    delivery: order.delivery || {},
    deliveryPartner: order.deliveryPartner || {},
    status: order.status || "Preparing",
    estimatedMinutes: order.estimatedMinutes || 30,
    createdAt: order.createdAt
  };
}

function getRewardSummary(orders, fallbackReferralCode) {
  const orderCount = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalPoints = Math.floor(totalSpent / 10);

  let tier = "Bronze Member";
  let minPoints = 0;
  let nextTierPoints = 500;
  if (totalPoints >= 2000) {
    tier = "Gold Member";
    minPoints = 2000;
    nextTierPoints = 4000;
  } else if (totalPoints >= 500) {
    tier = "Silver Member";
    minPoints = 500;
    nextTierPoints = 2000;
  }

  const progress = nextTierPoints > minPoints
    ? Math.max(0, Math.min(100, Math.round(((totalPoints - minPoints) / (nextTierPoints - minPoints)) * 100)))
    : 100;

  return {
    tier,
    totalPoints,
    orderCount,
    totalSpent,
    progress,
    nextTierPoints,
    referralCode: fallbackReferralCode || "CAFEFLOW"
  };
}

function createEmptyAnalytics() {
  return {
    summaryCards: [
      { title: "Total Revenue", value: 0, change: "+0.0%", icon: "wallet" },
      { title: "Total Orders", value: 0, change: "+0.0%", icon: "browse" },
      { title: "Avg Order Value", value: 0, change: "+0.0%", icon: "analytics" },
      { title: "Customer Retention", value: 0, change: "+0.0%", icon: "profile" }
    ],
    revenueTrend: [
      { month: "Jan", revenue: 0 },
      { month: "Feb", revenue: 0 },
      { month: "Mar", revenue: 0 },
      { month: "Apr", revenue: 0 },
      { month: "May", revenue: 0 },
      { month: "Jun", revenue: 0 }
    ],
    peakHours: [
      { label: "8-10 AM", orders: 0 },
      { label: "10-12 PM", orders: 0 },
      { label: "12-2 PM", orders: 0 },
      { label: "2-4 PM", orders: 0 },
      { label: "4-6 PM", orders: 0 },
      { label: "6-8 PM", orders: 0 },
      { label: "8-10 PM", orders: 0 },
      { label: "10-12 AM", orders: 0 }
    ],
    topItems: [],
    categoryBreakdown: [
      { label: "Beverages", value: 0 },
      { label: "Main Course", value: 0 },
      { label: "Desserts", value: 0 },
      { label: "Starters", value: 0 },
      { label: "Salads", value: 0 }
    ]
  };
}

function getAnalyticsSummary(orders) {
  if (!orders.length) {
    return createEmptyAnalytics();
  }

  const now = new Date();
  const monthKeys = [];
  for (let index = 5; index >= 0; index -= 1) {
    const current = new Date(now.getFullYear(), now.getMonth() - index, 1);
    monthKeys.push({
      key: `${current.getFullYear()}-${current.getMonth()}`,
      month: current.toLocaleString("en-IN", { month: "short" })
    });
  }

  const revenueByMonth = monthKeys.reduce((accumulator, item) => {
    accumulator[item.key] = 0;
    return accumulator;
  }, {});

  const peakHours = [
    { label: "8-10 AM", min: 8, max: 10, orders: 0 },
    { label: "10-12 PM", min: 10, max: 12, orders: 0 },
    { label: "12-2 PM", min: 12, max: 14, orders: 0 },
    { label: "2-4 PM", min: 14, max: 16, orders: 0 },
    { label: "4-6 PM", min: 16, max: 18, orders: 0 },
    { label: "6-8 PM", min: 18, max: 20, orders: 0 },
    { label: "8-10 PM", min: 20, max: 22, orders: 0 },
    { label: "10-12 AM", min: 22, max: 24, orders: 0 }
  ];

  const categoryCounts = {
    Beverages: 0,
    "Main Course": 0,
    Desserts: 0,
    Starters: 0,
    Salads: 0
  };
  const itemMap = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (Object.prototype.hasOwnProperty.call(revenueByMonth, monthKey)) {
      revenueByMonth[monthKey] += order.total || 0;
    }

    const bucket = peakHours.find((item) => date.getHours() >= item.min && date.getHours() < item.max);
    if (bucket) {
      bucket.orders += 1;
    }

    (order.items || []).forEach((item) => {
      const quantity = item.qty || 1;
      const rawCategory = item.category || "Main Course";
      let normalizedCategory = "Main Course";
      if (/beverage|coffee|tea|drink|chai/i.test(rawCategory)) normalizedCategory = "Beverages";
      else if (/dessert|sweet|ice cream|kulfi|cake/i.test(rawCategory)) normalizedCategory = "Desserts";
      else if (/starter|chaat|snack|appetizer/i.test(rawCategory)) normalizedCategory = "Starters";
      else if (/salad|healthy/i.test(rawCategory)) normalizedCategory = "Salads";

      categoryCounts[normalizedCategory] += quantity;

      const itemKey = item.name || "Item";
      if (!itemMap[itemKey]) {
        itemMap[itemKey] = {
          name: item.name || "Item",
          orders: 0,
          revenue: 0
        };
      }
      itemMap[itemKey].orders += quantity;
      itemMap[itemKey].revenue += (item.price || 0) * quantity;
    });
  });

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const previousRevenue = monthKeys.slice(0, 3).reduce((sum, item) => sum + revenueByMonth[item.key], 0);
  const recentRevenue = monthKeys.slice(3).reduce((sum, item) => sum + revenueByMonth[item.key], 0);
  const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0;
  const retention = Math.min(100, Math.round(42 + orders.length * 3));
  const revenueChange = previousRevenue > 0 ? (((recentRevenue - previousRevenue) / previousRevenue) * 100) : recentRevenue > 0 ? 100 : 0;
  const orderChange = orders.length > 1 ? ((orders.length - Math.max(1, Math.floor(orders.length / 2))) / Math.max(1, Math.floor(orders.length / 2))) * 100 : 0;
  const avgChange = avgOrderValue > 0 ? Math.min(35, avgOrderValue / 40) : 0;
  const retentionChange = Math.min(12, orders.length * 0.6);

  const categoryTotal = Object.values(categoryCounts).reduce((sum, value) => sum + value, 0) || 1;

  return {
    summaryCards: [
      { title: "Total Revenue", value: totalRevenue, change: `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`, icon: "wallet" },
      { title: "Total Orders", value: orders.length, change: `${orderChange >= 0 ? "+" : ""}${orderChange.toFixed(1)}%`, icon: "browse" },
      { title: "Avg Order Value", value: avgOrderValue, change: `+${avgChange.toFixed(1)}%`, icon: "analytics" },
      { title: "Customer Retention", value: retention, change: `+${retentionChange.toFixed(1)}%`, icon: "profile" }
    ],
    revenueTrend: monthKeys.map((item) => ({
      month: item.month,
      revenue: revenueByMonth[item.key]
    })),
    peakHours: peakHours.map(({ label, orders: count }) => ({
      label,
      orders: count
    })),
    topItems: Object.values(itemMap)
      .sort((a, b) => b.orders - a.orders || b.revenue - a.revenue)
      .slice(0, 5)
      .map((item, index) => ({
        rank: index + 1,
        name: item.name,
        detail: `${item.orders} orders | Rs${item.revenue}`,
        change: `+${Math.max(3, Math.round(item.orders / 5))}%`
      })),
    categoryBreakdown: Object.entries(categoryCounts).map(([label, value]) => ({
      label,
      value: Math.round((value / categoryTotal) * 100)
    }))
  };
}

app.get("/", (req, res) => {
  res.send("CafeFlow Backend Running");
});

app.get("/ping", (req, res) => {
  res.send("Backend alive");
});

app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ name: 1 });
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

app.get("/menu", async (req, res) => {
  try {
    const filter = req.query.restaurantId ? { restaurantId: req.query.restaurantId } : {};
    const items = await Menu.find(filter).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu" });
  }
});

app.get("/menu/:restaurantId", async (req, res) => {
  try {
    const items = await Menu.find({ restaurantId: req.params.restaurantId }).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu" });
  }
});

app.get("/catalog", async (req, res) => {
  try {
    const [restaurants, items] = await Promise.all([
      Restaurant.find().sort({ name: 1 }),
      Menu.find().sort({ name: 1 })
    ]);
    res.json({ restaurants, items });
  } catch (error) {
    res.status(500).json({ message: "Error fetching catalog" });
  }
});

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

    res.json({ message: "User registered successfully", user: sanitizeUser(newUser) });
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
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

app.put("/me", auth, async (req, res) => {
  try {
    const allowedFields = ["name", "email", "phone", "address", "city", "pincode"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        updates[field] = req.body[field].trim();
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated", user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

app.post("/place-order", auth, async (req, res) => {
  try {
    const { batch, items, total, paymentMethod, bank, delivery } = req.body;
    const ordersPayload = batch?.orders?.length
      ? batch.orders.map((order) => ({
        batchId: batch.id || `${Date.now()}`,
        restaurantId: order.restaurantId || "",
        restaurantName: order.restaurantName || "CafeFlow Restaurant",
        items: (order.items || []).map((item) => ({
          itemId: item._id || item.itemId || "",
          name: item.name,
          price: item.price,
          qty: item.qty || 1,
          category: item.category || "",
          image: item.image || ""
        })),
        subtotal: order.subtotal || 0,
        couponDiscountShare: order.couponDiscountShare || 0,
        multiRestaurantDiscountShare: order.multiRestaurantDiscountShare || 0,
        deliveryFeeShare: order.deliveryFeeShare || 0,
        platformFeeShare: order.platformFeeShare || 0,
        total: order.finalTotalAmount || order.totalAmount || order.total || 0,
        paymentMethod: batch.paymentMethod || paymentMethod || "",
        bank: batch.bank || bank || "",
        orderMode: order.orderMode || "Delivery",
        preOrderTime: order.preOrderTime || "",
        delivery: batch.delivery || delivery || {},
        deliveryPartner: order.deliveryPartner || {},
        status: order.status || "Preparing",
        estimatedMinutes: batch.estimatedMinutes || order.estimatedMinutes || 30,
        createdAt: batch.createdAt ? new Date(batch.createdAt) : new Date()
      }))
      : [{
        batchId: `${Date.now()}`,
        restaurantId: "",
        restaurantName: "CafeFlow Order",
        items: (items || []).map((item) => ({
          itemId: item._id || "",
          name: item.name,
          price: item.price,
          qty: item.qty || 1,
          category: item.category || "",
          image: item.image || ""
        })),
        subtotal: total || 0,
        total: total || 0,
        paymentMethod: paymentMethod || "",
        bank: bank || "",
        orderMode: "Delivery",
        preOrderTime: "",
        delivery: delivery || {},
        deliveryPartner: {},
        status: "Preparing",
        estimatedMinutes: 30,
        createdAt: new Date()
      }];

    if (!ordersPayload.length || !ordersPayload[0].items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const createdOrders = await Order.insertMany(
      ordersPayload.map((order) => ({
        ...order,
        userId: req.user.id
      }))
    );

    res.json({
      message: "Order placed successfully",
      orders: createdOrders.map(formatOrderResponse)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders.map(formatOrderResponse));
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

app.get("/all-orders", auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
});

app.post("/book-table", auth, async (req, res) => {
  try {
    const { name, phone, guests, date, time, restaurantId } = req.body;
    const booking = new TableBooking({
      userId: req.user.id,
      name,
      phone,
      guests,
      date,
      time,
      restaurantId: restaurantId || ""
    });

    await booking.save();

    res.json({ message: "Table booked successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Booking failed" });
  }
});

app.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await TableBooking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

app.get("/me/rewards", auth, async (req, res) => {
  try {
    const [orders, user] = await Promise.all([
      Order.find({ userId: req.user.id }),
      User.findById(req.user.id)
    ]);
    res.json(getRewardSummary(orders, user?.referralCode));
  } catch (error) {
    res.status(500).json({ message: "Error fetching rewards" });
  }
});

app.get("/me/analytics", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(getAnalyticsSummary(orders));
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

app.get("/dashboard", auth, async (req, res) => {
  try {
    const orders = req.user.role === "admin"
      ? await Order.find().sort({ createdAt: -1 }).limit(10)
      : await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);

    res.json({
      recentOrders: orders.map(formatOrderResponse),
      counts: {
        orders: orders.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard" });
  }
});

mongoose.connect("mongodb://127.0.0.1:27017/cafedb")
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.log(err));
