const pool = require("../config/db");

// Active loans
exports.getActiveLoans = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM vw_active_loans"
        );

        res.json(rows);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Loan history
exports.getLoans = async (req, res) => {
    try {

        const [rows] = await pool.query(`
            SELECT
                l.loan_id,
                m.name AS member_name,
                b.title AS book_title,
                l.loan_date,
                l.due_date,
                l.return_date,
                COALESCE(l.fine_amount,0) AS fine,
                l.status
            FROM loans l
            JOIN members m
                ON l.member_id = m.member_id
            JOIN books b
                ON l.book_id = b.book_id
            ORDER BY l.loan_id DESC
        `);

        res.json(rows);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Issue book
exports.issueBook = async (req, res) => {

    try {

        const { member_id, book_id, days } = req.body;

        if (!member_id || !book_id) {

            return res.status(400).json({
                error: "member_id and book_id are required"
            });

        }

        await pool.query(
            "CALL sp_issue_book(?, ?, ?, @loan_id, @msg)",
            [
                member_id,
                book_id,
                days || 14
            ]
        );

        const [[result]] = await pool.query(
            "SELECT @loan_id AS loan_id, @msg AS message"
        );

        if (!result.loan_id) {

            return res.status(400).json({
                error: result.message
            });

        }

        res.status(201).json(result);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};

// Return book
exports.returnBook = async (req, res) => {

    try {

        const { loan_id } = req.body;

        if (!loan_id) {

            return res.status(400).json({
                error: "loan_id is required"
            });

        }

        await pool.query(
            "CALL sp_return_book(?, @fine, @msg)",
            [loan_id]
        );

        const [[result]] = await pool.query(
            "SELECT @fine AS fine, @msg AS message"
        );

        res.json(result);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};