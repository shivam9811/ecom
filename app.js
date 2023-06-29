const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();

const csrf = require("csurf");

const expressSession = require("express-session");
const createSessionConfig = require("./config/session");

app.set("view engine", "ejs"); // method to set some option to this express app our view engine is ejs
app.set("views", path.join(__dirname, "views")); // path of the views,__dirname is the path of this project folder 'views' is the folder name of our views this create a path to the views directory
app.use(express.static("public"));
app.use("/products/assests", express.static("product-data"));
app.use(express.urlencoded({ extended: false })); // to parse req body
app.use(express.json());

const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handlers");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const cartMiddleware = require("./middlewares/cart");
const updateCartPrices = require("./middlewares/update-cart-prices");
const protectRoutes = require("./middlewares/protect-route");
const notFound = require("./middlewares/not-found");

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(addCsrfTokenMiddleware);

app.use(checkAuthStatusMiddleware);

app.use(cartMiddleware);

app.use(updateCartPrices);

const authRoutes = require("./routes/auth.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const productRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

app.use(authRoutes); //method that allow us to add a middleware that will be trigger for every   request
app.use(baseRoutes);
app.use(productRoutes);
app.use("/cart", cartRoutes);
// app.use(protectRoutes);
app.use("/orders", protectRoutes, orderRoutes);
app.use("/admin", protectRoutes, adminRoutes);

app.use(notFound);
app.use(errorHandlerMiddleware);

const db_url = process.env.MONGO_URI || "mongodb://localhost:27017/ecomApp";
mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection open!");
  })
  .catch((err) => {
    console.log("oh no error");
    console.log(err);
  });

app.listen(8080, (req, res) => {
  console.log("the port is running on port 8080");
});
