-- ============================================================
-- LIBRARY MANAGEMENT SYSTEM
-- PART 6
-- TESTING & VERIFICATION
-- MySQL 8.4
-- ============================================================

-- ============================================================
-- 1. TABLE VERIFICATION
-- ============================================================

SHOW TABLES;

DESC members;
DESC books;
DESC loans;
DESC fines;
DESC audit_log;

-- ============================================================
-- 2. COUNT RECORDS
-- ============================================================

SELECT COUNT(*) AS TotalMembers FROM members;

SELECT COUNT(*) AS TotalBooks FROM books;

SELECT COUNT(*) AS TotalLoans FROM loans;

SELECT COUNT(*) AS TotalFines FROM fines;

SELECT COUNT(*) AS TotalAuditLogs FROM audit_log;

-- ============================================================
-- 3. ACTIVE LOANS
-- ============================================================

SELECT *

FROM vw_active_loans

ORDER BY due_date;

-- ============================================================
-- 4. BOOK INVENTORY
-- ============================================================

SELECT *

FROM vw_book_inventory

ORDER BY title;

-- ============================================================
-- 5. MEMBER SUMMARY
-- ============================================================

SELECT *

FROM vw_member_summary

ORDER BY name;

-- ============================================================
-- 6. OVERDUE BOOKS
-- ============================================================

SELECT *

FROM vw_overdue_fines

ORDER BY estimated_fine DESC;

-- ============================================================
-- 7. DASHBOARD
-- ============================================================

SELECT *

FROM vw_dashboard_stats;

-- ============================================================
-- 8. POPULAR BOOKS
-- ============================================================

SELECT *

FROM vw_popular_books

LIMIT 10;

-- ============================================================
-- 9. FINE SUMMARY
-- ============================================================

SELECT *

FROM vw_fine_summary;

-- ============================================================
-- 10. GENRE REPORT
-- ============================================================

SELECT *

FROM vw_genre_statistics;

CALL sp_issue_book(

1,

10,

14,

@loan,

@msg

);

SELECT

@loan,

@msg;

CALL sp_issue_book(

2,

10,

14,

@loan,

@msg

);

SELECT

@loan,

@msg;

CALL sp_issue_book(1,11,14,@loan,@msg);

CALL sp_issue_book(1,12,14,@loan,@msg);

CALL sp_issue_book(1,13,14,@loan,@msg);

SELECT @loan,@msg;
CALL sp_return_book(

1,

@fine,

@msg

);

SELECT

@fine,

@msg;
CALL sp_return_book(

999,

@fine,

@msg

);

SELECT

@fine,

@msg;
SELECT *

FROM audit_log

ORDER BY log_id DESC

LIMIT 5;
INSERT INTO fines
(

loan_id,

member_id,

amount,

reason,

paid

)

VALUES

(

2,

2,

250,

'Trigger Test',

FALSE

);
SELECT status

FROM members

WHERE member_id=2;
UPDATE fines

SET paid=TRUE

WHERE member_id=2;
SELECT status

FROM members

WHERE member_id=2;
SELECT

title,

total_copies,

available_copies

FROM books;
SELECT *

FROM books

WHERE title

LIKE '%code%';
SELECT *

FROM books

WHERE author

LIKE '%Martin%';
SELECT *

FROM books

WHERE genre='Technology';
SELECT *

FROM books

WHERE available_copies>0;
SELECT *

FROM members

WHERE status='suspended';
SELECT *

FROM members

WHERE status='active';
SELECT *

FROM loans

WHERE return_date IS NULL;
SELECT *

FROM loans

WHERE return_date IS NOT NULL;
SELECT *

FROM loans

WHERE

status='overdue';
SELECT

b.title,

COUNT(l.loan_id)

AS TimesBorrowed

FROM books b

LEFT JOIN loans l

ON b.book_id=l.book_id

GROUP BY b.book_id

ORDER BY TimesBorrowed DESC

LIMIT 10;
SELECT

m.name,

COUNT(l.loan_id)

AS BorrowedBooks

FROM members m

LEFT JOIN loans l

ON m.member_id=l.member_id

GROUP BY m.member_id

ORDER BY BorrowedBooks DESC;

SELECT

SUM(amount)

AS TotalFineCollected

FROM fines

WHERE paid=TRUE;
SELECT

SUM(amount)

AS PendingFine

FROM fines

WHERE paid=FALSE;
EXPLAIN

SELECT *

FROM vw_member_summary;
EXPLAIN

SELECT *

FROM vw_book_inventory;
EXPLAIN

SELECT *

FROM vw_active_loans;
SELECT CURRENT_USER();
SHOW GRANTS;
SHOW PROCEDURE STATUS

WHERE Db=DATABASE();
SHOW TRIGGERS;
SHOW FULL TABLES

WHERE Table_type='VIEW';
SELECT COUNT(*) FROM members;
SELECT COUNT(*) FROM books;
SELECT COUNT(*) FROM loans;
SELECT COUNT(*) FROM fines;
SELECT COUNT(*) FROM audit_log;
