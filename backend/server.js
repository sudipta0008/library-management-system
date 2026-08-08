require('dotenv').config();


const pool = require('./config/db');
const path = require('path');
const app = require('./app');



// ── Serve Frontend ────────────────────────────────────────────
// Put library_management.html in the SAME folder as server.js
// Then open: http://localhost:3000  (NOT file://)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n✅ LibraryOS API connected to MySQL ${process.env.DB_NAME}`);
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log("⚠️  Do NOT open the HTML file directly. Use the server URL.\n");
});