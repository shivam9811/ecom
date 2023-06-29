const express = require("express");

const productControllers = require("../controllers/product.controllers");

const router = express.Router();

router.get("/products", productControllers.getProducts);

router.get("/products/:id", productControllers.productDetails);

module.exports = router;
