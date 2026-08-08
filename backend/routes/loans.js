const express = require("express");

const router = express.Router();

const loansController = require("../controllers/loansController");

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