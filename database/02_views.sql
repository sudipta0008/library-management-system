-- ============================================================
-- LIBRARY MANAGEMENT SYSTEM
-- Part 2A : Core Views
-- MySQL 8.4 Compatible
-- ============================================================

-- ============================================================
-- VIEW 1 : ACTIVE LOANS
-- ============================================================

DROP VIEW IF EXISTS vw_active_loans;

CREATE VIEW vw_active_loans AS

SELECT

    l.loan_id,

    l.member_id,

    m.name AS member_name,

    m.email,

    l.book_id,

    b.title,

    b.author,

    b.genre,

    l.loan_date,

    l.due_date,

    GREATEST(
        DATEDIFF(CURRENT_DATE, l.due_date),
        0
    ) AS days_overdue,

    CASE
        WHEN CURRENT_DATE > l.due_date
            THEN 'Overdue'
        ELSE 'Active'
    END AS loan_status,

    l.fine_amount

FROM loans l

INNER JOIN members m
ON l.member_id = m.member_id

INNER JOIN books b
ON l.book_id = b.book_id

WHERE l.return_date IS NULL;
-- ============================================================
-- VIEW 2 : MEMBER SUMMARY
-- ============================================================

DROP VIEW IF EXISTS vw_member_summary;

CREATE VIEW vw_member_summary AS

SELECT

    m.member_id,

    m.name,

    m.email,

    m.phone,

    m.status,

    m.joined_date,

    COALESCE(l.total_loans,0)      AS total_loans,

    COALESCE(l.active_loans,0)     AS active_loans,

    COALESCE(l.returned_books,0)   AS returned_books,

    COALESCE(f.total_fines,0)      AS total_fines,

    COALESCE(f.unpaid_fines,0)     AS unpaid_fines

FROM members m

LEFT JOIN
(
    SELECT

        member_id,

        COUNT(*) AS total_loans,

        SUM(return_date IS NULL) AS active_loans,

        SUM(return_date IS NOT NULL) AS returned_books

    FROM loans

    GROUP BY member_id

) l

ON m.member_id=l.member_id

LEFT JOIN
(
    SELECT

        member_id,

        SUM(amount) AS total_fines,

        SUM(
            CASE
                WHEN paid=FALSE
                THEN amount
                ELSE 0
            END
        ) AS unpaid_fines

    FROM fines

    GROUP BY member_id

) f

ON m.member_id=f.member_id;
-- ============================================================
-- VIEW 3 : BOOK INVENTORY
-- ============================================================

DROP VIEW IF EXISTS vw_book_inventory;

CREATE VIEW vw_book_inventory AS

SELECT

    b.book_id,

    b.title,

    b.author,

    b.genre,

    b.isbn,

    b.total_copies,

    b.available_copies,

    (b.total_copies-b.available_copies)

        AS checked_out,

    ROUND(

        (b.available_copies*100.0)

        /

        NULLIF(b.total_copies,0),

        2

    )

    AS availability_percentage,

    CASE

        WHEN b.available_copies=0

            THEN 'Out of Stock'

        WHEN b.available_copies<=2

            THEN 'Low Stock'

        ELSE

            'Available'

    END

    AS inventory_status

FROM books b;
-- ============================================================
-- LIBRARY MANAGEMENT SYSTEM
-- Part 2B : Reporting Views
-- MySQL 8.4 Compatible
-- ============================================================

-- ============================================================
-- VIEW 4 : OVERDUE FINES
-- ============================================================

DROP VIEW IF EXISTS vw_overdue_fines;

CREATE VIEW vw_overdue_fines AS

SELECT

    l.loan_id,

    m.member_id,

    m.name AS member_name,

    b.book_id,

    b.title AS book_title,

    l.loan_date,

    l.due_date,

    GREATEST(
        DATEDIFF(CURRENT_DATE,l.due_date),
        0
    ) AS days_overdue,

    GREATEST(
        DATEDIFF(CURRENT_DATE,l.due_date),
        0
    ) * 5.00 AS estimated_fine

FROM loans l

INNER JOIN members m
ON l.member_id=m.member_id

INNER JOIN books b
ON l.book_id=b.book_id

WHERE

    l.return_date IS NULL

AND CURRENT_DATE>l.due_date;

-- ============================================================
-- VIEW 5 : DASHBOARD
-- ============================================================

DROP VIEW IF EXISTS vw_dashboard_stats;

CREATE VIEW vw_dashboard_stats AS

SELECT

    COALESCE(
        (SELECT COUNT(*) FROM books),
        0
    ) AS total_books,

    COALESCE(
        (SELECT SUM(total_copies) FROM books),
        0
    ) AS total_copies,

    COALESCE(
        (SELECT SUM(available_copies) FROM books),
        0
    ) AS available_books,

    COALESCE(
        (SELECT COUNT(*) FROM members),
        0
    ) AS total_members,

    COALESCE(
        (
            SELECT COUNT(*)
            FROM loans
            WHERE return_date IS NULL
        ),
        0
    ) AS active_loans,

    COALESCE(
        (
            SELECT COUNT(*)
            FROM loans
            WHERE return_date IS NULL
            AND CURRENT_DATE>due_date
        ),
        0
    ) AS overdue_loans,

    COALESCE(
        (
            SELECT SUM(amount)
            FROM fines
            WHERE paid=FALSE
        ),
        0
    ) AS unpaid_fines;
    -- ============================================================
-- VIEW 6 : GENRE STATISTICS
-- ============================================================

DROP VIEW IF EXISTS vw_genre_statistics;

CREATE VIEW vw_genre_statistics AS

SELECT

    b.genre,

    COUNT(l.loan_id) AS total_loans,

    COUNT(DISTINCT l.member_id)
        AS unique_borrowers,

    COALESCE(

        SUM(

            CASE

                WHEN l.return_date IS NULL

                THEN 1

                ELSE 0

            END

        ),

        0

    ) AS currently_out,

    COALESCE(

        ROUND(

            AVG(

                DATEDIFF(

                    COALESCE(

                        l.return_date,

                        CURRENT_DATE

                    ),

                    l.loan_date

                )

            ),

            2

        ),

        0

    ) AS average_loan_days,

    COALESCE(

        SUM(l.fine_amount),

        0

    ) AS total_fines

FROM books b

LEFT JOIN loans l

ON b.book_id=l.book_id

GROUP BY b.genre

ORDER BY total_loans DESC;
-- ============================================================
-- VIEW 7 : POPULAR BOOKS
-- ============================================================

DROP VIEW IF EXISTS vw_popular_books;

CREATE VIEW vw_popular_books AS

SELECT

    b.book_id,

    b.title,

    b.author,

    b.genre,

    COUNT(l.loan_id)

        AS total_issues,

    COALESCE(

        SUM(

            CASE

                WHEN l.return_date IS NULL

                THEN 1

                ELSE 0

            END

        ),

        0

    )

    AS currently_issued

FROM books b

LEFT JOIN loans l

ON b.book_id=l.book_id

GROUP BY

    b.book_id,

    b.title,

    b.author,

    b.genre

ORDER BY

    total_issues DESC,

    b.title;
    -- ============================================================
-- VIEW 8 : FINE SUMMARY
-- ============================================================

DROP VIEW IF EXISTS vw_fine_summary;

CREATE VIEW vw_fine_summary AS

SELECT

    m.member_id,

    m.name,

    COALESCE(

        COUNT(f.fine_id),

        0

    )

    AS total_fines,

    COALESCE(

        SUM(f.amount),

        0

    )

    AS total_amount,

    COALESCE(

        SUM(

            CASE

                WHEN f.paid=FALSE

                THEN f.amount

                ELSE 0

            END

        ),

        0

    )

    AS unpaid_amount

FROM members m

LEFT JOIN fines f

ON m.member_id=f.member_id

GROUP BY

    m.member_id,

    m.name

ORDER BY

    unpaid_amount DESC,

    m.name;
    