const pool = require("../config/db");

// Get all members
exports.getMembers = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM vw_member_summary"
        );

        res.json(rows);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new member
exports.addMember = async (req, res) => {
    try {

        const { name, email, phone } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                error: "Name and email are required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO members
            (name,email,phone)
            VALUES(?,?,?)`,
            [name, email, phone || ""]
        );

        res.status(201).json({
            id: result.insertId,
            message: "Member added successfully"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Reactivate member
exports.reactivateMember = async (req, res) => {
    try {

        await pool.query(
            "UPDATE members SET status='active' WHERE member_id=?",
            [req.params.id]
        );

        res.json({
            message: "Member reactivated"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Pay fines
exports.payFines = async (req, res) => {
    try {

        await pool.query(
            "UPDATE fines SET paid=1 WHERE member_id=? AND paid=0",
            [req.params.id]
        );

        res.json({
            message: "Fines cleared"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};