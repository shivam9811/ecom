const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = Schema({
  title: String,
  price: Number,
  description: String,
  summary: String,
  image: String,
  imagePath: String,
  imageUrl: String,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
