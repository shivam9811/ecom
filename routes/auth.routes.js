const express = require("express");

const router = express.Router();

const {
  getSignup,
  getLogin,
  signUp,
  logIn,
  logout,
} = require("../controllers/auth.controllers");

router.get("/signup", getSignup);
router.post("/signup", signUp);

router.get("/login", getLogin);

router.post("/login", logIn);

router.post("/logout", logout);

module.exports = router;
