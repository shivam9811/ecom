const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = Schema({
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
});

const Cart = mongoose.model("cartProduct", cartSchema);

module.exports = Cart;
