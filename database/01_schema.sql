-- ============================================================
-- LIBRARY MANAGEMENT SYSTEM
-- Part 1 : Database Schema
-- MySQL 8.4 Compatible
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS fines;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS members;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- MEMBERS
-- ============================================================

CREATE TABLE members
(
    member_id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(120) NOT NULL UNIQUE,

    phone VARCHAR(20),

    joined_date DATE NOT NULL DEFAULT (CURRENT_DATE),

    status ENUM
    (
        'active',
        'suspended',
        'expired'
    ) DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- BOOKS
-- ============================================================

CREATE TABLE books
(
    book_id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(200) NOT NULL,

    author VARCHAR(120) NOT NULL,

    isbn VARCHAR(20) UNIQUE,

    genre VARCHAR(60),

    total_copies INT NOT NULL DEFAULT 1,

    available_copies INT NOT NULL DEFAULT 1,

    added_date DATE DEFAULT (CURRENT_DATE),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_total_positive
    CHECK(total_copies > 0),

    CONSTRAINT chk_available_copies
    CHECK(available_copies >= 0),

    CONSTRAINT chk_available_less_than_total
    CHECK(available_copies <= total_copies)
) ENGINE=InnoDB;

-- ============================================================
-- LOANS
-- ============================================================

CREATE TABLE loans
(
    loan_id INT AUTO_INCREMENT PRIMARY KEY,

    member_id INT NOT NULL,

    book_id INT NOT NULL,

    loan_date DATE NOT NULL DEFAULT CURRENT_DATE,

    due_date DATE NOT NULL,

    return_date DATE NULL,

    status ENUM
    (
        'active',
        'returned',
        'overdue'
    ) DEFAULT 'active',

    fine_amount DECIMAL(10,2) DEFAULT 0.00,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_loans_member
    FOREIGN KEY(member_id)
    REFERENCES members(member_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

    CONSTRAINT fk_loans_book
    FOREIGN KEY(book_id)
    REFERENCES books(book_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- FINES
-- ============================================================

CREATE TABLE fines
(
    fine_id INT AUTO_INCREMENT PRIMARY KEY,

    loan_id INT NOT NULL,

    member_id INT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    reason VARCHAR(250),

    paid BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fines_loan
    FOREIGN KEY(loan_id)
    REFERENCES loans(loan_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_fines_member
    FOREIGN KEY(member_id)
    REFERENCES members(member_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- AUDIT LOG
-- ============================================================

CREATE TABLE audit_log
(
    log_id INT AUTO_INCREMENT PRIMARY KEY,

    event_type VARCHAR(50),

    description TEXT,

    member_id INT NULL,

    book_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_member
    FOREIGN KEY(member_id)
    REFERENCES members(member_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

    CONSTRAINT fk_audit_book
    FOREIGN KEY(book_id)
    REFERENCES books(book_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- INDEXES
-- ============================================================
-- Note: email (members) and isbn (books) already have a UNIQUE
-- constraint, which MySQL indexes automatically. No separate
-- index is created for them here to avoid duplication.

CREATE INDEX idx_books_title
ON books(title);

CREATE INDEX idx_books_author
ON books(author);

CREATE INDEX idx_books_genre
ON books(genre);

CREATE INDEX idx_member_name
ON members(name);

CREATE INDEX idx_loans_member_status
ON loans(member_id,status);

CREATE INDEX idx_loans_book
ON loans(book_id);

CREATE INDEX idx_loans_status
ON loans(status);

CREATE INDEX idx_loans_due
ON loans(due_date);

CREATE INDEX idx_fines_paid
ON fines(paid);

CREATE INDEX idx_fines_member
ON fines(member_id);

CREATE INDEX idx_audit_time
ON audit_log(created_at);

-- ============================================================
-- END OF PART 1
-- ============================================================
