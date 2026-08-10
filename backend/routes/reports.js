const express = require("express");

const router = express.Router();

const reportsController = require("../controllers/reportsController");

const authMiddleware = require("../middleware/authMiddleware");

// Protect all report routes
router.use(authMiddleware);

// -----------------------------
// Reports
// -----------------------------

router.get(
  "/popular-books",
  reportsController.getPopularBooks
);

router.get(
  "/overdue",
  reportsController.getOverdueBooks
);

router.get(
  "/fine-summary",
  reportsController.getFineSummary
);

router.get(
  "/genre-report",
  reportsController.getGenreReport
);

router.get(
  "/audit",
  reportsController.getAuditLog
);

module.exports = router;