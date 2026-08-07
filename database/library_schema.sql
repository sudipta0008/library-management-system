-- ============================================================
--  LIBRARY MANAGEMENT SYSTEM — Full SQL Schema
--  Includes: Tables, Views, Stored Procedures, Triggers
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. TABLES
-- ──────────────────────────────────────────────────────────────

CREATE TABLE members (
    member_id     INT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(120) UNIQUE NOT NULL,
    phone         VARCHAR(20),
    joined_date   DATE DEFAULT (CURRENT_DATE),
    status        ENUM('active','suspended','expired') DEFAULT 'active'
);

CREATE TABLE books (
    book_id       INT PRIMARY KEY AUTO_INCREMENT,
    title         VARCHAR(200) NOT NULL,
    author        VARCHAR(100) NOT NULL,
    isbn          VARCHAR(20) UNIQUE,
    genre         VARCHAR(50),
    total_copies  INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    added_date    DATE DEFAULT (CURRENT_DATE)
);

CREATE TABLE loans (
    loan_id       INT PRIMARY KEY AUTO_INCREMENT,
    member_id     INT NOT NULL REFERENCES members(member_id),
    book_id       INT NOT NULL REFERENCES books(book_id),
    loan_date     DATE DEFAULT (CURRENT_DATE),
    due_date      DATE NOT NULL,
    return_date   DATE,
    status        ENUM('active','returned','overdue') DEFAULT 'active',
    fine_amount   DECIMAL(8,2) DEFAULT 0.00
);

CREATE TABLE fines (
    fine_id       INT PRIMARY KEY AUTO_INCREMENT,
    loan_id       INT NOT NULL REFERENCES loans(loan_id),
    member_id     INT NOT NULL REFERENCES members(member_id),
    amount        DECIMAL(8,2) NOT NULL,
    reason        VARCHAR(200),
    paid          BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_log (
    log_id        INT PRIMARY KEY AUTO_INCREMENT,
    event_type    VARCHAR(50),
    description   TEXT,
    member_id     INT,
    book_id       INT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ──────────────────────────────────────────────────────────────
-- 2. VIEWS
-- ──────────────────────────────────────────────────────────────

-- View 1: Active loans with member and book details
CREATE OR REPLACE VIEW vw_active_loans AS
SELECT
    l.loan_id,
    m.name          AS member_name,
    m.email         AS member_email,
    b.title         AS book_title,
    b.author,
    l.loan_date,
    l.due_date,
    DATEDIFF(CURRENT_DATE, l.due_date) AS days_overdue,
    CASE
        WHEN l.return_date IS NOT NULL THEN 'Returned'
        WHEN CURRENT_DATE > l.due_date THEN 'Overdue'
        ELSE 'Active'
    END AS loan_status
FROM loans l
JOIN members m ON l.member_id = m.member_id
JOIN books   b ON l.book_id   = b.book_id
WHERE l.return_date IS NULL;


-- View 2: Member summary (loans, fines, status)
CREATE OR REPLACE VIEW vw_member_summary AS
SELECT
    m.member_id,
    m.name,
    m.email,
    m.status,
    COUNT(DISTINCT l.loan_id)                                 AS total_loans,
    SUM(CASE WHEN l.return_date IS NULL THEN 1 ELSE 0 END)   AS active_loans,
    COALESCE(SUM(f.amount), 0)                                AS total_fines,
    COALESCE(SUM(CASE WHEN f.paid = FALSE THEN f.amount END), 0) AS unpaid_fines
FROM members m
LEFT JOIN loans l  ON l.member_id = m.member_id
LEFT JOIN fines f  ON f.member_id = m.member_id
GROUP BY m.member_id, m.name, m.email, m.status;


-- View 3: Book inventory status
CREATE OR REPLACE VIEW vw_book_inventory AS
SELECT
    b.book_id,
    b.title,
    b.author,
    b.genre,
    b.total_copies,
    b.available_copies,
    b.total_copies - b.available_copies AS checked_out,
    ROUND((b.available_copies / b.total_copies) * 100, 1) AS availability_pct
FROM books b;


-- View 4: Overdue loans with fine calculation
CREATE OR REPLACE VIEW vw_overdue_fines AS
SELECT
    l.loan_id,
    m.name          AS member_name,
    b.title         AS book_title,
    l.due_date,
    DATEDIFF(CURRENT_DATE, l.due_date) AS days_overdue,
    DATEDIFF(CURRENT_DATE, l.due_date) * 5.00 AS estimated_fine
FROM loans l
JOIN members m ON l.member_id = m.member_id
JOIN books   b ON l.book_id   = b.book_id
WHERE l.return_date IS NULL
  AND CURRENT_DATE > l.due_date;


-- ──────────────────────────────────────────────────────────────
-- 3. STORED PROCEDURES
-- ──────────────────────────────────────────────────────────────

DELIMITER $$

-- Procedure 1: Issue a book to a member
CREATE PROCEDURE sp_issue_book(
    IN  p_member_id INT,
    IN  p_book_id   INT,
    IN  p_days      INT,       -- loan duration in days
    OUT p_loan_id   INT,
    OUT p_message   VARCHAR(200)
)
BEGIN
    DECLARE v_available INT;
    DECLARE v_member_status VARCHAR(20);
    DECLARE v_active_loans INT;

    -- Check member status
    SELECT status INTO v_member_status
    FROM members WHERE member_id = p_member_id;

    IF v_member_status != 'active' THEN
        SET p_loan_id = -1;
        SET p_message = 'Member account is not active.';
    ELSE
        -- Check book availability
        SELECT available_copies INTO v_available
        FROM books WHERE book_id = p_book_id;

        IF v_available <= 0 THEN
            SET p_loan_id = -1;
            SET p_message = 'No copies available for this book.';
        ELSE
            -- Check member has ≤ 3 active loans
            SELECT COUNT(*) INTO v_active_loans
            FROM loans
            WHERE member_id = p_member_id AND return_date IS NULL;

            IF v_active_loans >= 3 THEN
                SET p_loan_id = -1;
                SET p_message = 'Member has reached the maximum loan limit (3).';
            ELSE
                -- Create loan
                INSERT INTO loans (member_id, book_id, loan_date, due_date, status)
                VALUES (p_member_id, p_book_id, CURRENT_DATE,
                        DATE_ADD(CURRENT_DATE, INTERVAL p_days DAY), 'active');

                SET p_loan_id = LAST_INSERT_ID();

                -- Decrement available copies
                UPDATE books SET available_copies = available_copies - 1
                WHERE book_id = p_book_id;

                SET p_message = CONCAT('Loan #', p_loan_id, ' created successfully. Due: ',
                                       DATE_ADD(CURRENT_DATE, INTERVAL p_days DAY));
            END IF;
        END IF;
    END IF;
END$$


-- Procedure 2: Return a book and calculate fine
CREATE PROCEDURE sp_return_book(
    IN  p_loan_id  INT,
    OUT p_fine     DECIMAL(8,2),
    OUT p_message  VARCHAR(200)
)
BEGIN
    DECLARE v_due_date    DATE;
    DECLARE v_book_id     INT;
    DECLARE v_member_id   INT;
    DECLARE v_days_late   INT;
    DECLARE FINE_PER_DAY  DECIMAL(5,2) DEFAULT 5.00;

    SELECT due_date, book_id, member_id
    INTO   v_due_date, v_book_id, v_member_id
    FROM   loans WHERE loan_id = p_loan_id AND return_date IS NULL;

    IF v_book_id IS NULL THEN
        SET p_fine    = 0;
        SET p_message = 'Loan not found or already returned.';
    ELSE
        SET v_days_late = GREATEST(DATEDIFF(CURRENT_DATE, v_due_date), 0);
        SET p_fine      = v_days_late * FINE_PER_DAY;

        -- Mark loan returned
        UPDATE loans
        SET return_date  = CURRENT_DATE,
            status       = 'returned',
            fine_amount  = p_fine
        WHERE loan_id = p_loan_id;

        -- Restore available copy
        UPDATE books SET available_copies = available_copies + 1
        WHERE book_id = v_book_id;

        -- Insert fine record if overdue
        IF p_fine > 0 THEN
            INSERT INTO fines (loan_id, member_id, amount, reason)
            VALUES (p_loan_id, v_member_id, p_fine,
                    CONCAT('Late return — ', v_days_late, ' day(s) overdue'));

            SET p_message = CONCAT('Book returned. Fine: ₹', p_fine,
                                   ' (', v_days_late, ' days late).');
        ELSE
            SET p_message = 'Book returned on time. No fine.';
        END IF;
    END IF;
END$$


-- Procedure 3: Generate genre-wise loan statistics report
CREATE PROCEDURE sp_genre_report()
BEGIN
    SELECT
        b.genre,
        COUNT(l.loan_id)                                       AS total_loans,
        COUNT(DISTINCT l.member_id)                            AS unique_borrowers,
        SUM(CASE WHEN l.return_date IS NULL THEN 1 ELSE 0 END) AS currently_out,
        ROUND(AVG(DATEDIFF(
            COALESCE(l.return_date, CURRENT_DATE), l.loan_date
        )), 1)                                                 AS avg_loan_days,
        COALESCE(SUM(l.fine_amount), 0)                        AS total_fines_collected
    FROM books b
    LEFT JOIN loans l ON l.book_id = b.book_id
    GROUP BY b.genre
    ORDER BY total_loans DESC;
END$$

DELIMITER ;


-- ──────────────────────────────────────────────────────────────
-- 4. TRIGGERS
-- ──────────────────────────────────────────────────────────────

DELIMITER $$

-- Trigger 1: Auto-audit when a new loan is created
CREATE TRIGGER trg_loan_created
AFTER INSERT ON loans
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (event_type, description, member_id, book_id)
    VALUES ('LOAN_CREATED',
            CONCAT('Loan #', NEW.loan_id, ' created. Due: ', NEW.due_date),
            NEW.member_id, NEW.book_id);
END$$


-- Trigger 2: Auto-audit when a book is returned
CREATE TRIGGER trg_loan_returned
AFTER UPDATE ON loans
FOR EACH ROW
BEGIN
    IF OLD.return_date IS NULL AND NEW.return_date IS NOT NULL THEN
        INSERT INTO audit_log (event_type, description, member_id, book_id)
        VALUES ('BOOK_RETURNED',
                CONCAT('Loan #', NEW.loan_id, ' returned on ', NEW.return_date,
                       '. Fine: ₹', NEW.fine_amount),
                NEW.member_id, NEW.book_id);
    END IF;
END$$


-- Trigger 3: Suspend member if unpaid fines exceed ₹200
CREATE TRIGGER trg_auto_suspend_member
AFTER INSERT ON fines
FOR EACH ROW
BEGIN
    DECLARE v_total_unpaid DECIMAL(10,2);

    SELECT COALESCE(SUM(amount), 0) INTO v_total_unpaid
    FROM fines
    WHERE member_id = NEW.member_id AND paid = FALSE;

    IF v_total_unpaid > 200 THEN
        UPDATE members SET status = 'suspended'
        WHERE member_id = NEW.member_id AND status = 'active';

        INSERT INTO audit_log (event_type, description, member_id)
        VALUES ('MEMBER_SUSPENDED',
                CONCAT('Auto-suspended. Unpaid fines: ₹', v_total_unpaid),
                NEW.member_id);
    END IF;
END$$


-- Trigger 4: Prevent issuing more copies than exist
CREATE TRIGGER trg_prevent_over_issue
BEFORE UPDATE ON books
FOR EACH ROW
BEGIN
    IF NEW.available_copies < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot issue book: no available copies.';
    END IF;

    IF NEW.available_copies > NEW.total_copies THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Available copies cannot exceed total copies.';
    END IF;
END$$

DELIMITER ;


-- ──────────────────────────────────────────────────────────────
-- 5. SAMPLE DATA
-- ──────────────────────────────────────────────────────────────

INSERT INTO members (name, email, phone) VALUES
('Arjun Mehta',    'arjun.mehta@email.com',   '9876543210'),
('Priya Sharma',   'priya.sharma@email.com',  '9123456780'),
('Rahul Singh',    'rahul.singh@email.com',   '9988776655'),
('Sneha Patil',    'sneha.patil@email.com',   '9011223344'),
('Dev Kulkarni',   'dev.kulkarni@email.com',  '9901234567');

INSERT INTO books (title, author, isbn, genre, total_copies, available_copies) VALUES
('The Alchemist',                'Paulo Coelho',    '978-0062315007', 'Fiction',    3, 3),
('Atomic Habits',                'James Clear',     '978-0735211292', 'Self-Help',  2, 2),
('Clean Code',                   'Robert Martin',   '978-0132350884', 'Technology', 2, 2),
('Sapiens',                      'Yuval N. Harari', '978-0062316097', 'History',    2, 2),
('The Psychology of Money',      'Morgan Housel',   '978-0857197689', 'Finance',    3, 3),
('Design Patterns',              'Gang of Four',    '978-0201633610', 'Technology', 1, 1),
('The Hitchhiker\'s Guide',      'Douglas Adams',   '978-0345391803', 'Sci-Fi',     2, 2),
('Ikigai',                       'H. Garcia',       '978-0143130727', 'Self-Help',  2, 2);
