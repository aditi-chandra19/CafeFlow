const mongoose = require("mongoose");

const tableBookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  guests: Number,
  date: String,
  time: String,
  restaurantId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("TableBooking", tableBookingSchema);