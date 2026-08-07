# 📚 LibraryOS — Library Management System

A full-stack **Library Management System** built with a MySQL database backend, Node.js/Express REST API, and a responsive dark-themed frontend dashboard.

> Built as a complete SQL project demonstrating **Stored Procedures**, **Triggers**, **Views**, and a live connected frontend.

---

## 🌐 Live Demo

🔗 [View Live on Vercel](https://your-app.vercel.app) ← *(update after deploying)*

---

## 🖼️ Screenshots

| Dashboard | Issue Book | Audit Log |
|-----------|------------|-----------|
| Live stats from MySQL views | Calls stored procedure | Trigger-written events |

---

## ✨ Features

- 📊 **Dashboard** — live stats pulled from MySQL views
- 📚 **Book Inventory** — add books, track availability with visual progress bars
- ⇄ **Issue & Return** — calls stored procedures with fine calculation
- 👥 **Members** — add members, view loan history and unpaid fines
- ⚡ **Audit Log** — every action auto-logged by MySQL triggers
- 🔴 **Auto-suspend** — members suspended automatically when fines exceed ₹200

---

## 🗄️ Database Design

### Tables
| Table | Purpose |
|-------|---------|
| `members` | Library member records |
| `books` | Book inventory |
| `loans` | Borrowing records |
| `fines` | Fine records |
| `audit_log` | Trigger-written event log |

### Views
| View | Purpose |
|------|---------|
| `vw_active_loans` | Joined loan details with overdue status |
| `vw_member_summary` | Per-member loan count and fine totals |
| `vw_book_inventory` | Availability percentage per book |
| `vw_overdue_fines` | Calculated fine estimates for late returns |

### Stored Procedures
| Procedure | Purpose |
|-----------|---------|
| `sp_issue_book` | Validates member, checks availability, creates loan |
| `sp_return_book` | Calculates fine (₹5/day), updates loan, restores copy |
| `sp_genre_report` | Aggregated stats per genre |

### Triggers
| Trigger | Event | Purpose |
|---------|-------|---------|
| `trg_loan_created` | AFTER INSERT on loans | Logs loan to audit_log |
| `trg_loan_returned` | AFTER UPDATE on loans | Logs return with fine |
| `trg_auto_suspend_member` | AFTER INSERT on fines | Suspends member if fines > ₹200 |
| `trg_prevent_over_issue` | BEFORE UPDATE on books | Prevents negative available copies |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL 8.0 |
| ORM/Driver | mysql2 |
| Deployment | Vercel (frontend) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://dev.mysql.com/downloads/) 8.0+
- [MySQL Workbench](https://www.mysql.com/products/workbench/) (optional, for GUI)

### 1. Clone the repository

```bash
git clone https://github.com/sudipta0008/library-management-system.git
cd library-management-system
```

### 2. Set up the database

Open MySQL Workbench or your MySQL terminal:

```sql
CREATE DATABASE library_db;
USE library_db;
```

Then run the schema file:

```bash
# In MySQL Workbench: File → Open SQL Script → select library_schema.sql → Run
# Or via terminal:
mysql -u root -p library_db < library_schema.sql
```

### 3. Set up the API server

```bash
cd library-api
npm install
```

Edit `server.js` and update your MySQL password:

```js
const pool = mysql.createPool({
  host:     'localhost',
  user:     'root',
  password: 'YOUR_MYSQL_PASSWORD',  // ← change this
  database: 'library_db'
});
```

Start the server:

```bash
node server.js
# Server running at http://localhost:3000
```

### 4. Open the frontend

Simply open `library_management.html` in your browser.

> The frontend talks to `http://localhost:3000` by default. Change the `API` variable at the top of the HTML if your server runs on a different port.

---

## 📁 Project Structure

```
library-management-system/
│
├── library_management.html   # Frontend dashboard (single file)
├── library_schema.sql        # Full MySQL schema (tables, views, procedures, triggers)
├── README.md
│
└── library-api/              # Node.js backend
    ├── server.js             # Express API server
    ├── package.json
    └── node_modules/
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | All books (uses vw_book_inventory) |
| GET | `/api/members` | All members (uses vw_member_summary) |
| GET | `/api/loans/active` | Active loans (uses vw_active_loans) |
| GET | `/api/audit` | Audit log entries |
| POST | `/api/books` | Add a new book |
| POST | `/api/members` | Add a new member |
| POST | `/api/loans/issue` | Issue a book (calls sp_issue_book) |
| POST | `/api/loans/return` | Return a book (calls sp_return_book) |

---

## ☁️ Deploying to Vercel

The **frontend** (`library_management.html`) is deployed to Vercel as a static site.

> ⚠️ **Important:** The Node.js API (`server.js`) connects to your local MySQL — you need to either:
> - Run the API locally and open the frontend from Vercel
> - Or deploy the API separately to a service like [Railway](https://railway.app), [Render](https://render.com), or [PlanetScale](https://planetscale.com) for the database

### Deploy frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# From project root
vercel
```

Or connect your GitHub repo directly at [vercel.com](https://vercel.com) → Import Project → select this repo.

---

## 📝 SQL Concepts Demonstrated

This project was built to demonstrate core SQL concepts in a real application:

- **Views** — abstract complex joins into reusable virtual tables
- **Stored Procedures** — encapsulate business logic (loan limits, fine calculation) inside MySQL
- **Triggers** — automate audit logging and member suspension without application code
- **Transactions** — atomic operations for issuing and returning books
- **Foreign Keys** — relational integrity across members, books, loans, and fines

---

## 👨‍💻 Author

**Sudipta** — [@sudipta0008](https://github.com/sudipta0008)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
