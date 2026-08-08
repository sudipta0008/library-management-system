const pool = require("../config/db");

exports.getBooks = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM vw_book_inventory"
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

exports.addBook = async (req, res) => {
    try {
        const {
            title,
            author,
            isbn,
            genre,
            copies,
        } = req.body;

        if (!title || !author) {
            return res.status(400).json({
                error: "Title and author are required",
            });
        }

        const [result] = await pool.query(
            `INSERT INTO books
            (
                title,
                author,
                isbn,
                genre,
                total_copies,
                available_copies
            )
            VALUES
            (?, ?, ?, ?, ?, ?)`,
            [
                title,
                author,
                isbn || "",
                genre || "Fiction",
                copies || 1,
                copies || 1,
            ]
        );

        res.status(201).json({
            id: result.insertId,
            message: `"${title}" added successfully`,
        });

    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};