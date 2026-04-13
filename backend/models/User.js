const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer"
  },
  phone: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  pincode: {
    type: String,
    default: ""
  },
  referralCode: {
    type: String,
    default: function generateReferralCode() {
      const base = (this.name || "CAFE").replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 4) || "CAFE";
      const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
      return `${base}${suffix}`;
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
