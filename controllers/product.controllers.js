const Product = require("../models/product.model");

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find({});
    res.render("customer/products/all-product", { products: products });
  } catch (err) {
    next(err);
  }
};

const productDetails = async (req, res, next) => {
  let product;
  const id = req.params.id;
  try {
    product = await Product.findById(id);
    res.render("customer/products/product-details", { product: product });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, productDetails };
