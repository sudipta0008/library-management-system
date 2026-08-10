-- ============================================================
-- LIBRARY MANAGEMENT SYSTEM
-- Part 3A
-- Stored Procedure : sp_issue_book
-- MySQL 8.4 Compatible
-- ============================================================

DROP PROCEDURE IF EXISTS sp_issue_book;

DELIMITER $$

CREATE PROCEDURE sp_issue_book
(
    IN  p_member_id INT,
    IN  p_book_id INT,
    IN  p_days INT,

    OUT p_loan_id INT,
    OUT p_message VARCHAR(255)
)

BEGIN

    

    DECLARE v_available INT DEFAULT 0;

    DECLARE v_status VARCHAR(20);

    DECLARE v_active_loans INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN

        ROLLBACK;

        SET p_loan_id = -1;

        SET p_message = 'Unexpected database error.';

    END;

    

    START TRANSACTION;

   

    IF NOT EXISTS
    (
        SELECT 1

        FROM members

        WHERE member_id = p_member_id
    )
    THEN

        SET p_loan_id = -1;

        SET p_message='Member does not exist.';

        ROLLBACK;

    ELSE

    

    SELECT status

    INTO v_status

    FROM members

    WHERE member_id=p_member_id

    FOR UPDATE;

    

    IF v_status<>'active'
    THEN

        SET p_loan_id=-1;

        SET p_message='Member account is not active.';

        ROLLBACK;

    ELSE

  

    IF NOT EXISTS
    (
        SELECT 1

        FROM books

        WHERE book_id=p_book_id
    )
    THEN

        SET p_loan_id=-1;

        SET p_message='Book does not exist.';

        ROLLBACK;

    ELSE

   

    SELECT available_copies

    INTO v_available

    FROM books

    WHERE book_id=p_book_id

    FOR UPDATE;

  

    IF v_available<=0
    THEN

        SET p_loan_id=-1;

        SET p_message='Book is not available.';

        ROLLBACK;

    ELSE

    

    SELECT COUNT(*)

    INTO v_active_loans

    FROM loans

    WHERE member_id=p_member_id

    AND return_date IS NULL;

   

    IF v_active_loans>=3
    THEN

        SET p_loan_id=-1;

        SET p_message='Maximum loan limit reached (3).';

        ROLLBACK;

    ELSE

    
    INSERT INTO loans
    (

        member_id,

        book_id,

        loan_date,

        due_date,

        status

    )

    VALUES
    (

        p_member_id,

        p_book_id,

        CURDATE(),

        DATE_ADD(CURDATE(),INTERVAL p_days DAY),

        'active'

    );

    

    SET p_loan_id=LAST_INSERT_ID();

   

    UPDATE books

    SET available_copies=available_copies-1

    WHERE book_id=p_book_id;

    

    SET p_message=

    CONCAT(

        'Loan Created Successfully. Loan ID = ',

        p_loan_id,

        '. Due Date = ',

        DATE_ADD(CURDATE(),INTERVAL p_days DAY)

    );

    

    COMMIT;

    END IF;

    END IF;

    END IF;

    END IF;
    END IF;

END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_return_book;

DELIMITER $$

CREATE PROCEDURE sp_return_book
(
    IN p_loan_id INT,

    OUT p_fine DECIMAL(10,2),

    OUT p_message VARCHAR(255)
)

BEGIN

    DECLARE v_due_date DATE;

    DECLARE v_book_id INT;

    DECLARE v_member_id INT;

    DECLARE v_days_late INT DEFAULT 0;

    DECLARE v_fine_per_day DECIMAL(10,2) DEFAULT 5.00;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN

        ROLLBACK;

        SET p_fine=0;

        SET p_message='Unexpected database error.';

    END;

    START TRANSACTION;

   

    SELECT

        due_date,

        book_id,

        member_id

    INTO

        v_due_date,

        v_book_id,

        v_member_id

    FROM loans

    WHERE loan_id=p_loan_id

    AND return_date IS NULL

    FOR UPDATE;

    IF v_book_id IS NULL THEN

        SET p_fine=0;

        SET p_message='Loan not found or already returned.';

        ROLLBACK;

    ELSE

      

        SET v_days_late=

            GREATEST(

                DATEDIFF(CURDATE(),v_due_date),

                0

            );

        SET p_fine=v_days_late*v_fine_per_day;

       

        UPDATE loans

        SET

            return_date=CURDATE(),

            status='returned',

            fine_amount=p_fine

        WHERE loan_id=p_loan_id;

      

        UPDATE books

        SET

            available_copies=available_copies+1

        WHERE

            book_id=v_book_id;

     

        IF p_fine>0 THEN

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

                p_loan_id,

                v_member_id,

                p_fine,

                CONCAT(

                    'Late return (',

                    v_days_late,

                    ' day(s))'

                ),

                FALSE

            );

            SET p_message=

                CONCAT(

                    'Book Returned. Fine = ₹',

                    p_fine

                );

        ELSE

            SET p_message='Book Returned Successfully.';

        END IF;

        COMMIT;

    END IF;

END$$

DELIMITER ;
DROP PROCEDURE IF EXISTS sp_genre_report;

DELIMITER $$

CREATE PROCEDURE sp_genre_report()

BEGIN

SELECT

    b.genre,

    COUNT(l.loan_id)

    AS total_loans,

    COUNT(DISTINCT l.member_id)

    AS unique_members,

    SUM(

        CASE

            WHEN l.return_date IS NULL

            THEN 1

            ELSE 0

        END

    )

    AS books_out,

    ROUND(

        AVG(

            DATEDIFF(

                COALESCE(

                    l.return_date,

                    CURDATE()

                ),

                l.loan_date

            )

        ),

        2

    )

    AS average_days,

    COALESCE(

        SUM(

            l.fine_amount

        ),

        0

    )

    AS total_fines

FROM books b

LEFT JOIN loans l

ON b.book_id=l.book_id

GROUP BY

    b.genre

ORDER BY

    total_loans DESC;

END$$

DELIMITER ;
