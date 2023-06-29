const express = require("express");

const imageUploadMiddleware = require("../middlewares/image-upload");

const adminController = require("../controllers/admin.controllers");

const router = express.Router();

router.get("/products", adminController.getProducts);

router.get("/products/new", adminController.getNewProduct);

router.post(
  "/products",
  imageUploadMiddleware,
  adminController.createNewProduct
);
router.get("/products/:id", adminController.getUpdateProduct);
router.get(
  "/products/view/:id",
  imageUploadMiddleware,
  adminController.viewProduct
);
router.post(
  "/products/:id",
  imageUploadMiddleware,
  adminController.updateProduct
);
router.delete("/products/:id", adminController.deleteProduct);

router.get("/orders", adminController.getOrders);
router.patch("/orders/:id", adminController.updateOrder);

module.exports = router;
