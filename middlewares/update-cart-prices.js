const Product = require("../models/product.model");

const updatePrices = async (cart) => {
  const productIds = cart.items.map((item) => {
    return item.product._id;
  });

  let products = [];
  for (let id of productIds) {
    const product = await Product.findById(id);
    products.push(product);
  }

  const deletableCartItemProductIds = [];

  for (const cartItem of cart.items) {
    const product = products.find((prod) => {
      return prod && String(prod._id) === String(cartItem.product._id);
    });

    if (!product) {
      deletableCartItemProductIds.push(cartItem.product._id);
      continue;
    }

    cartItem.product = product;
    cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
  }

  if (deletableCartItemProductIds.length > 0) {
    cart.items = cart.items.filter((item) => {
      return deletableCartItemProductIds.indexOf(item.product._id) < 0;
    });
  }

  cart.totalQuantity = 0;
  cart.totalPrice = 0;
  for (let item of cart.items) {
    cart.totalQuantity += item.quantity;
    cart.totalPrice = cart.totalPrice + item.totalPrice;
  }
};

async function updateCartPrices(req, res, next) {
  const cart = res.locals.cart;

  await updatePrices(cart);
  next();
}

module.exports = updateCartPrices;
