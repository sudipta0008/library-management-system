const express = require("express");

const router = express.Router();

const books = require("../controllers/booksController");

const authMiddleware = require("../middleware/authMiddleware");

// Protect all book routes
router.use(authMiddleware);

// -----------------------------
// Books
// -----------------------------

router.get("/", books.getBooks);

router.post("/", books.addBook);

router.put("/:id", books.updateBook);

router.delete("/:id", books.deleteBook);

module.exports = router;