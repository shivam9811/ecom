const Order = require("../models/order.model");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");

const stripe = require("stripe")(process.env.STRIPE_ENV);

const addOrder = async (req, res, next) => {
  const uid = req.session.uid;

  const cart = req.session.cart;
  if (!cart.items) {
    res.redirect("/products");
    return;
  }

  if (req.body.id) {
    try {
      await Order.findByIdAndUpdate(req.body.id, { status: req.body.status });
    } catch (error) {
      return next(error);
    }
  } else {
    let userData;
    try {
      userData = await User.findById(uid);
    } catch (error) {
      return next(error);
    }
    const userDataForOrder = {
      email: userData.email,
      fullname: userData.fullname,
      address: userData.address,
      postal: userData.postal,
      city: userData.city,
    };

    const order = new Order();

    for (let item of cart.items) {
      const product = {
        title: item.product.title,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
      };
      const cartItem = {
        product: product,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      };
      order.items.push(cartItem);
    }

    order.totalQuantity = cart.totalQuantity;
    order.totalPrice = cart.totalPrice;
    order.userData = userDataForOrder;
    order.userId = String(uid);
    try {
      await order.save();
    } catch (error) {
      next(error);
      return;
    }
  }

  req.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cart.items.map((item) => {
      return {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price.toFixed(2) * 100,
        },
        quantity: item.quantity,
      };
    }),
    mode: "payment",
    success_url: `http://localhost:8080/orders/success`,
    cancel_url: `http://localhost:8080/orders/failure`,
  });

  res.redirect(303, session.url);
};

function getSuccess(req, res) {
  res.render("customer/orders/success");
}

function getFailure(req, res) {
  res.render("customer/orders/failure");
}

const showOrders = async (req, res, next) => {
  const orders = await Order.find({ userId: req.session.uid });
  try {
    res.render("customer/orders/all-orders", { orders: orders });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addOrder,
  showOrders,
  getFailure,
  getSuccess,
};
