const pool = require("../config/db");

// Popular Books
exports.getPopularBooks = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM vw_popular_books"
        );

        res.json(rows);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Overdue Books
exports.getOverdueBooks = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM vw_overdue_fines"
        );

        res.json(rows);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Fine Summary
exports.getFineSummary = async (req, res) => {
    try {

        const [rows] = await pool.query(
            "SELECT * FROM vw_fine_summary"
        );

        res.json(rows);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

// Genre Report
exports.getGenreReport = async (req, res) => {
    try {

        const [rows] = await pool.query(
            "CALL sp_genre_report()"
        );

        res.json(rows[0]);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};
exports.getAuditLog = async (req, res) => {
    try {

        const [rows] = await pool.query(`
            SELECT *
            FROM audit_log
            ORDER BY created_at DESC
            LIMIT 100
        `);

        res.json(rows);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};