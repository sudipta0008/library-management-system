const pool = require("../config/db");

/* ===========================================================
   GET ACTIVE LOANS
=========================================================== */

exports.getActiveLoans = async (req, res) => {

    try {

        const [rows] = await pool.query(
            "SELECT * FROM vw_active_loans ORDER BY due_date ASC"
        );

        res.status(200).json({
            success: true,
            data: rows
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

/* ===========================================================
   GET LOAN HISTORY
   Supports:
   ?page=1
   ?limit=10
   ?status=active
   ?search=atomic
=========================================================== */

exports.getLoans = async (req, res) => {

    try {

        let {
            page = 1,
            limit = 10,
            status = "",
            search = ""
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        let sql = `
            SELECT
                l.loan_id,
                m.member_id,
                m.name AS member_name,
                b.book_id,
                b.title AS book_title,
                l.loan_date,
                l.due_date,
                l.return_date,
                l.status,
                COALESCE(l.fine_amount,0) AS fine
            FROM loans l
            JOIN members m
                ON l.member_id = m.member_id
            JOIN books b
                ON l.book_id = b.book_id
            WHERE
                (
                    m.name LIKE ?
                    OR b.title LIKE ?
                )
        `;

        const params = [
            `%${search}%`,
            `%${search}%`
        ];

        if (status) {
            sql += " AND l.status = ?";
            params.push(status);
        }

        sql += `
            ORDER BY l.loan_id DESC
            LIMIT ?
            OFFSET ?
        `;

        params.push(limit, offset);

        const [rows] = await pool.query(sql, params);

        let countSql = `
            SELECT COUNT(*) AS total
            FROM loans l
            JOIN members m
                ON l.member_id=m.member_id
            JOIN books b
                ON l.book_id=b.book_id
            WHERE
                (
                    m.name LIKE ?
                    OR b.title LIKE ?
                )
        `;

        const countParams = [
            `%${search}%`,
            `%${search}%`
        ];

        if (status) {
            countSql += " AND l.status=?";
            countParams.push(status);
        }

        const [[count]] = await pool.query(
            countSql,
            countParams
        );

        res.status(200).json({

            success: true,

            data: rows,

            pagination: {

                page,

                limit,

                total: count.total,

                totalPages: Math.ceil(count.total / limit)

            }

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* ===========================================================
   ISSUE BOOK
=========================================================== */

exports.issueBook = async (req, res) => {

    try {

        const {
            member_id,
            book_id,
            days = 14
        } = req.body;

        if (!member_id || !book_id) {

            return res.status(400).json({

                success: false,

                message: "Member ID and Book ID are required."

            });

        }

        await pool.query(
            "CALL sp_issue_book(?,?,?,@loan_id,@msg)",
            [
                member_id,
                book_id,
                days
            ]
        );

        const [[result]] = await pool.query(
            "SELECT @loan_id AS loan_id,@msg AS message"
        );

        if (!result.loan_id || result.loan_id === -1) {

            return res.status(400).json({

                success: false,

                message: result.message

            });

        }

        res.status(201).json({

            success: true,

            message: result.message,

            data: {

                loan_id: result.loan_id

            }

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* ===========================================================
   RETURN BOOK
=========================================================== */

exports.returnBook = async (req, res) => {

    try {

        const { loan_id } = req.body;

        if (!loan_id) {

            return res.status(400).json({

                success: false,

                message: "Loan ID is required."

            });

        }

        await pool.query(
            "CALL sp_return_book(?,@fine,@msg)",
            [loan_id]
        );

        const [[result]] = await pool.query(
            "SELECT @fine AS fine,@msg AS message"
        );

        res.status(200).json({

            success: true,

            message: result.message,

            data: {

                fine: result.fine

            }

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};