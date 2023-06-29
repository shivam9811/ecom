const mongoose = require("mongoose");
const Cart = require("./cart.model");
const User = require("./user.model");

const Schema = mongoose.Schema;
// const cartSchema = new Schema({
//   items: {
//     type: Array,
//     default: [],
//   },
//   totalQuantity: {
//     type: Number,
//     default: 0,
//   },
//   totalPrice: {
//     type: Number,
//     default: 0,
//   },
// });

// const userSchema = new Schema({
//   email: String,
//   fullname: String,
//   address: String,
//   postal: String,
//   city: String,
// });

const orderSchema = new Schema(
  {
    items: {
      type: Array,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    userData: {
      type: Schema.Types.Array,
      ref: User,
    },
    userId: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
