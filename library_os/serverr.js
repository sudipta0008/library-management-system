const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');
const path    = require('path');
const app     = express();

app.use(cors());
app.use(express.json());

// ── MySQL Pool ────────────────────────────────────────────────
const pool = mysql.createPool({
  host:     'localhost',
  user:     'root',
  password: 'Bama3820@',
  database: 'library_db',
  waitForConnections: true,
  connectionLimit: 10,
});

// ── Serve Frontend ────────────────────────────────────────────
// Put library_management.html in the SAME folder as server.js
// Then open: http://localhost:3000  (NOT file://)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'library_managementt.html'));
});

// ── BOOKS ─────────────────────────────────────────────────────
app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_book_inventory');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/books', async (req, res) => {
  try {
    const { title, author, isbn, genre, copies } = req.body;
    if (!title || !author) return res.status(400).json({ error: 'Title and author are required' });
    const [result] = await pool.query(
      'INSERT INTO books (title, author, isbn, genre, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, isbn || '', genre || 'Fiction', copies || 1, copies || 1]
    );
    res.status(201).json({ id: result.insertId, message: `"${title}" added to inventory` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── MEMBERS ───────────────────────────────────────────────────
app.get('/api/members', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_member_summary');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/members', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
    const [result] = await pool.query(
      'INSERT INTO members (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone || '']
    );
    res.status(201).json({ id: result.insertId, message: `Member "${name}" added` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/members/:id/reactivate', async (req, res) => {
  try {
    await pool.query("UPDATE members SET status = 'active' WHERE member_id = ?", [req.params.id]);
    res.json({ message: 'Member reactivated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/members/:id/pay-fines', async (req, res) => {
  try {
    await pool.query('UPDATE fines SET paid = 1 WHERE member_id = ? AND paid = 0', [req.params.id]);
    res.json({ message: 'Fines cleared' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── LOANS ─────────────────────────────────────────────────────
app.get('/api/loans/active', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_active_loans');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/loans', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.loan_id,
             m.name            AS member_name,
             b.title           AS book_title,
             l.loan_date,
             l.due_date,
             l.return_date,
             COALESCE(l.fine_amount, 0) AS fine,
             l.status
      FROM   loans l
      JOIN   members m ON l.member_id = m.member_id
      JOIN   books   b ON l.book_id   = b.book_id
      ORDER  BY l.loan_id DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Issue book — calls your stored procedure sp_issue_book
// ── POST issue book ─────────────────────────────────────────
app.post('/api/loans/issue', async (req, res) => {
  try {
    const { member_id, book_id, days } = req.body;
    if (!member_id || !book_id) return res.status(400).json({ error: 'member_id and book_id are required' });
    
    // Step 1: Call the procedure
    await pool.query('CALL sp_issue_book(?, ?, ?, @loan_id, @msg)', [member_id, book_id, days || 14]);
    
    // Step 2: Fetch the output variables separately
    const [[result]] = await pool.query('SELECT @loan_id AS loan_id, @msg AS message');
    
    if (!result.loan_id) return res.status(400).json({ error: result.message || 'Could not issue book' });
    res.status(201).json({ loan_id: result.loan_id, message: result.message });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Return book — calls your stored procedure sp_return_book (triggers fire automatically in MySQL)
app.post('/api/loans/return', async (req, res) => {
  try {
    const { loan_id } = req.body;
    if (!loan_id) return res.status(400).json({ error: 'loan_id is required' });

    // Step 1: Call the procedure
    await pool.query('CALL sp_return_book(?, @fine, @msg)', [loan_id]);

    // Step 2: Fetch output variables separately
    const [[result]] = await pool.query('SELECT @fine AS fine, @msg AS message');

    res.json({ fine: result.fine || 0, message: result.message });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── AUDIT LOG ─────────────────────────────────────────────────
app.get('/api/audit', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 100');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── DASHBOARD STATS ───────────────────────────────────────────
app.get('/api/dashboard', async (req, res) => {
  try {
    const [[b]] = await pool.query('SELECT SUM(total_copies) AS total_books, SUM(available_copies) AS available_books FROM books');
    const [[l]] = await pool.query("SELECT COUNT(*) AS active_loans, SUM(status='overdue') AS overdue_loans FROM loans WHERE return_date IS NULL");
    const [[f]] = await pool.query('SELECT COALESCE(SUM(amount),0) AS unpaid_fines FROM fines WHERE paid = 0');
    const [[m]] = await pool.query("SELECT COUNT(*) AS total_members, SUM(status='suspended') AS suspended_members FROM members");
    res.json({
      total_books:        Number(b.total_books)        || 0,
      available_books:    Number(b.available_books)    || 0,
      active_loans:       Number(l.active_loans)       || 0,
      overdue_loans:      Number(l.overdue_loans)      || 0,
      unpaid_fines:       Number(f.unpaid_fines)       || 0,
      total_members:      Number(m.total_members)      || 0,
      suspended_members:  Number(m.suspended_members)  || 0,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GENRE REPORT ──────────────────────────────────────────────
app.get('/api/views/genre-report', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.genre,
             COUNT(l.loan_id)              AS total_loans,
             COUNT(DISTINCT l.member_id)   AS unique_borrowers,
             SUM(l.return_date IS NULL)    AS currently_out
      FROM   books b
      LEFT JOIN loans l ON b.book_id = l.book_id
      GROUP  BY b.genre
      ORDER  BY total_loans DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── OVERDUE ───────────────────────────────────────────────────
app.get('/api/views/overdue-fines', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM vw_overdue_fines");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── START ─────────────────────────────────────────────────────
app.listen(3000, () => {
  console.log('\n✅  LibraryOS API connected to MySQL library_db');
  console.log('\n👉  Open in browser → http://localhost:3000\n');
  console.log('    ⚠️  Do NOT open the .html file directly\n');
});
