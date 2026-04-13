const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  batchId: String,
  restaurantId: String,
  restaurantName: String,
  items: [
    {
      itemId: String,
      name: String,
      price: Number,
      qty: {
        type: Number,
        default: 1
      },
      category: String,
      image: String
    }
  ],
  subtotal: Number,
  couponDiscountShare: {
    type: Number,
    default: 0
  },
  multiRestaurantDiscountShare: {
    type: Number,
    default: 0
  },
  deliveryFeeShare: {
    type: Number,
    default: 0
  },
  platformFeeShare: {
    type: Number,
    default: 0
  },
  total: Number,
  paymentMethod: String,
  bank: String,
  orderMode: {
    type: String,
    default: "Delivery"
  },
  preOrderTime: {
    type: String,
    default: ""
  },
  delivery: {
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String,
    lat: Number,
    lng: Number
  },
  deliveryPartner: {
    name: String,
    phone: String,
    vehicle: String,
    rating: Number
  },
  status: {
    type: String,
    default: "Preparing"
  },
  estimatedMinutes: {
    type: Number,
    default: 30
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
