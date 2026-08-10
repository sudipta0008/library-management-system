const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

// -----------------------------
// SIGN UP
// -----------------------------

router.post(
  "/signup",
  authController.signup
);

// -----------------------------
// LOGIN
// -----------------------------

router.post(
  "/login",
  authController.login
);

// -----------------------------
// CURRENT ADMIN
// -----------------------------

router.get(
  "/me",
  authMiddleware,
  authController.getMe
);

module.exports = router;