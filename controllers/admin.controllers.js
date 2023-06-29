const Product = require("../models/product.model");
const Order = require("../models/order.model");

const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.render("admin/products/all-products", { products: products });
};

const getNewProduct = (req, res) => {
  res.render("admin/products/new-product");
};

const createNewProduct = async (req, res) => {
  const { title, price, description, summary } = req.body;
  const productData = {
    title,
    price,
    description,
    summary,
  };

  const product = new Product({
    ...productData,
    image: req.file.filename,
    imagePath: `product-data/images/${req.file.filename}`,
    imageUrl: `/products/assests/images/${req.file.filename}`,
  });

  try {
    await product.save();
  } catch (err) {
    next(err);
    return;
  }

  res.redirect("/admin/products");
};

const getUpdateProduct = async (req, res, next) => {
  let product;
  try {
    product = await Product.findById(req.params.id);
  } catch (error) {
    next(error);
  }
  res.render("admin/products/update-product", { product: product });
};

const updateProduct = async (req, res, next) => {
  const { title, price, description, summary } = req.body;
  const productData = {
    title,
    price,
    description,
    summary,
  };

  let newProduct;
  if (req.file) {
    newProduct = {
      ...productData,
      image: req.file.filename,
      imagePath: `product-data/images/${req.file.filename}`,
      imageUrl: `/products/assests/images/${req.file.filename}`,
    };
  } else {
    newProduct = { ...productData };
  }
  const product = await Product.findByIdAndUpdate(req.params.id, newProduct);
  try {
    await product.save();
  } catch (err) {
    next(err);
    return;
  }
  res.redirect("/admin/products");
};

const viewProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("admin/products/product", { product: product });
};

const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted product!" });
};

async function getOrders(req, res, next) {
  try {
    const orders = await Order.find();
    res.render("admin/orders/admin-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: "Order updated", newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNewProduct,
  getProducts,
  createNewProduct,
  getUpdateProduct,
  updateProduct,
  viewProduct,
  deleteProduct,
  getOrders,
  updateOrder,
};
