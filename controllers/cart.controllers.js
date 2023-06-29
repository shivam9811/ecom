const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

function addItem(product, cart) {
  const cartItem = {
    product: product,
    quantity: Number(1),
    totalPrice: product.price,
  };

  const items = cart.items;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (String(item.product._id) === String(product._id)) {
      item.quantity += cartItem.quantity;
      item.totalPrice += cartItem.totalPrice;
      items[i] = item;
      cart.totalQuantity = Number(cart.totalQuantity) + 1;
      cart.totalPrice += product.price;
      return;
    }
  }
  items.push(cartItem);
  cart.totalQuantity++;
  cart.totalPrice += product.price;
}

const AddToCart = async (req, res, next) => {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    next(error);
    return;
  }

  const cart = res.locals.cart;
  addItem(product, cart);
  req.session.cart = cart;

  res.status(201).json({
    message: "Cart updated",
    newTotalItems: Number(cart.totalQuantity),
  });
};

const showCart = (req, res) => {
  res.render("customer/cart/cart");
};

const updateItem = (productId, newQuantity, cart) => {
  const items = cart.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (String(item.product._id) === String(productId)) {
      if (newQuantity > 0) {
        const cartItem = { ...item };
        const quantityChange = newQuantity - item.quantity;
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;
        items[i] = cartItem;
        cart.totalQuantity += quantityChange;
        cart.totalPrice += quantityChange * item.product.price;
        return { updatedItemPrice: cartItem.totalPrice };
      } else {
        items.splice(i, 1);
        cart.totalQuantity -= item.quantity;
        cart.totalPrice -= item.totalPrice;
        return { updatedItemPrice: 0 };
      }
    }
  }
};

function updateCartItem(req, res) {
  const cart = res.locals.cart;
  const updatedItemData = updateItem(req.body.id, req.body.quantity, cart);
  req.session.cart = cart;
  res.json({
    message: "Item updated",
    updatedCartData: {
      newTotalQuantity: Number(cart.totalQuantity),
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
    },
  });
}

module.exports = {
  AddToCart,
  showCart,
  updateCartItem,
};
