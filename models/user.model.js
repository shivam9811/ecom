const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullname: String,
  address: String,
  postal: String,
  city: String,
  isAdmin: Boolean,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
