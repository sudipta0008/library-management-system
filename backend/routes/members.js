const express = require("express");

const router = express.Router();

const membersController = require("../controllers/membersController");

router.get("/", membersController.getMembers);

router.post("/", membersController.addMember);

router.patch(
    "/:id/reactivate",
    membersController.reactivateMember
);

router.patch(
    "/:id/pay-fines",
    membersController.payFines
);

module.exports = router;