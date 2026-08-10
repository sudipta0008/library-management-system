const pool = require("../config/db");

/* ===========================================================
   GET MEMBERS
   Supports:
   ?page=1
   ?limit=10
   ?search=arjun
   ?status=active
=========================================================== */

exports.getMembers = async (req, res) => {

    try {

        let {
            page = 1,
            limit = 10,
            search = "",
            status = ""
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        let sql = `
            SELECT *
            FROM vw_member_summary
            WHERE
                (
                    name LIKE ?
                    OR email LIKE ?
                )
        `;

        const params = [
            `%${search}%`,
            `%${search}%`
        ];

        if (status) {
            sql += " AND status=?";
            params.push(status);
        }

        sql += `
            ORDER BY joined_date DESC
            LIMIT ?
            OFFSET ?
        `;

        params.push(limit, offset);

        const [rows] = await pool.query(sql, params);

        let countSql = `
            SELECT COUNT(*) AS total
            FROM vw_member_summary
            WHERE
                (
                    name LIKE ?
                    OR email LIKE ?
                )
        `;

        const countParams = [
            `%${search}%`,
            `%${search}%`
        ];

        if (status) {
            countSql += " AND status=?";
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
   ADD MEMBER
=========================================================== */

exports.addMember = async (req, res) => {

    try {

        const {
            name,
            email,
            phone
        } = req.body;

        if (!name || !email) {

            return res.status(400).json({

                success: false,

                message: "Name and Email are required."

            });

        }

        const [[exists]] = await pool.query(

            "SELECT member_id FROM members WHERE email=?",

            [email]

        );

        if (exists) {

            return res.status(409).json({

                success: false,

                message: "Email already exists."

            });

        }

        const [result] = await pool.query(

            `
            INSERT INTO members
            (
                name,
                email,
                phone
            )
            VALUES
            (?,?,?)
            `,

            [

                name.trim(),

                email.trim(),

                phone || null

            ]

        );

        res.status(201).json({

            success: true,

            message: "Member added successfully.",

            data: {

                member_id: result.insertId

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
   UPDATE MEMBER
=========================================================== */

exports.updateMember = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            name,

            email,

            phone,

            status

        } = req.body;

        await pool.query(

            `
            UPDATE members
            SET
                name=?,
                email=?,
                phone=?,
                status=?
            WHERE member_id=?
            `,

            [

                name,

                email,

                phone,

                status,

                id

            ]

        );

        res.json({

            success: true,

            message: "Member updated successfully."

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* ===========================================================
   DELETE MEMBER
=========================================================== */

exports.deleteMember = async (req, res) => {

    try {

        const { id } = req.params;

        const [[loan]] = await pool.query(

            `
            SELECT COUNT(*) AS total
            FROM loans
            WHERE
                member_id=?
                AND return_date IS NULL
            `,

            [id]

        );

        if (loan.total > 0) {

            return res.status(400).json({

                success: false,

                message: "Member has active loans."

            });

        }

        await pool.query(

            "DELETE FROM members WHERE member_id=?",

            [id]

        );

        res.json({

            success: true,

            message: "Member deleted successfully."

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* ===========================================================
   REACTIVATE MEMBER
=========================================================== */

exports.reactivateMember = async (req, res) => {

    try {

        await pool.query(

            "UPDATE members SET status='active' WHERE member_id=?",

            [req.params.id]

        );

        res.json({

            success: true,

            message: "Member reactivated."

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* ===========================================================
   PAY FINES
=========================================================== */

exports.payFines = async (req, res) => {

    try {

        await pool.query(

            `
            UPDATE fines
            SET paid=1
            WHERE
                member_id=?
                AND paid=0
            `,

            [req.params.id]

        );

        res.json({

            success: true,

            message: "All pending fines cleared."

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};