const express = require("express");

const router = express.Router();

const loansController = require("../controllers/loansController");

const authMiddleware = require("../middleware/authMiddleware");

// Protect all loan routes
router.use(authMiddleware);

// -----------------------------
// Loans
// -----------------------------

router.get(
  "/",
  loansController.getLoans
);

router.get(
  "/active",
  loansController.getActiveLoans
);

router.post(
  "/issue",
  loansController.issueBook
);

router.post(
  "/return",
  loansController.returnBook
);

module.exports = router;