const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cart.controllers");

router.get("/", cartController.showCart);
router.post("/items", cartController.AddToCart);
router.patch("/items", cartController.updateCartItem);

module.exports = router;
