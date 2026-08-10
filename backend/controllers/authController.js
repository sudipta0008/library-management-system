const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");

// =====================================================
// SIGN UP
// =====================================================

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    // -----------------------------
    // Check existing admin
    // -----------------------------

    const [existingAdmins] = await pool.query(
      "SELECT admin_id FROM admins WHERE email = ?",
      [email]
    );

    if (existingAdmins.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "An admin with this email already exists.",
      });
    }

    // -----------------------------
    // Hash password
    // -----------------------------

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    // -----------------------------
    // Create admin
    // -----------------------------

    const [result] = await pool.query(
      `
        INSERT INTO admins
        (
          name,
          email,
          password_hash,
          role
        )
        VALUES (?, ?, ?, 'admin')
      `,
      [
        name.trim(),
        email.trim().toLowerCase(),
        passwordHash,
      ]
    );

    // -----------------------------
    // Response
    // -----------------------------

    res.status(201).json({
      success: true,
      message: "Admin account created successfully.",
      data: {
        admin_id: result.insertId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "admin",
      },
    });

  } catch (err) {
    console.error("Signup Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to create admin account.",
    });
  }
};


// =====================================================
// LOGIN
// =====================================================

exports.login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // -----------------------------
    // Find admin
    // -----------------------------

    const [admins] = await pool.query(
      `
        SELECT
          admin_id,
          name,
          email,
          password_hash,
          role
        FROM admins
        WHERE email = ?
      `,
      [email.trim().toLowerCase()]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const admin = admins[0];

    // -----------------------------
    // Compare password
    // -----------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        admin.password_hash
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // -----------------------------
    // Create JWT
    // -----------------------------

    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // -----------------------------
    // Response
    // -----------------------------

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,

        admin: {
          admin_id: admin.admin_id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });

  } catch (err) {
    console.error("Login Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to login.",
    });
  }
};


// =====================================================
// GET CURRENT ADMIN
// =====================================================

exports.getMe = async (req, res) => {
  try {
    console.log("GET ME req.admin:", req.admin);

    const [admins] = await pool.query(
      `
        SELECT
          admin_id,
          name,
          email,
          role,
          created_at
        FROM admins
        WHERE admin_id = ?
      `,
      [req.admin.admin_id]
    );
    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: admins[0],
    });

  } catch (err) {
    console.error("Get Me Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to get admin profile.",
    });
  }
};