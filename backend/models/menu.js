const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: String,

  restaurantId: {
    type: String,   // 🔥 KEEP THIS STRING
    required: true
  },

  available: {
    type: Boolean,
    default: true
  },

  rating: {
    type: Number,
    default: 4.2
  },

  isVeg: {
    type: Boolean,
    default: true
  },

  isPopular: {
    type: Boolean,
    default: false
  },

  isBestseller: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Menu", menuSchema);