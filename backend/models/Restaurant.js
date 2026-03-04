const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: String,
  image: String,
  rating: Number,
  deliveryTime: String,
  priceRange: String,
  cuisine: [String],
  isOpen: Boolean
});

module.exports = mongoose.model("Restaurant", restaurantSchema);