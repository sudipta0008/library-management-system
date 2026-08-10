const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

// Protect dashboard
router.use(authMiddleware);

// -----------------------------
// Dashboard
// -----------------------------

router.get(
  "/",
  dashboardController.getDashboard
);

module.exports = router;