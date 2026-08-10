const express = require("express");

const router = express.Router();

const membersController = require("../controllers/membersController");

const authMiddleware = require("../middleware/authMiddleware");

// Protect all member routes
router.use(authMiddleware);

// -----------------------------
// Members
// -----------------------------

router.get(
  "/",
  membersController.getMembers
);

router.post(
  "/",
  membersController.addMember
);

router.patch(
  "/:id/reactivate",
  membersController.reactivateMember
);

router.patch(
  "/:id/pay-fines",
  membersController.payFines
);

router.put(
  "/:id",
  membersController.updateMember
);

router.delete(
  "/:id",
  membersController.deleteMember
);

module.exports = router;