-- ============================================================
-- LIBRARY MANAGEMENT SYSTEM
-- Part 4
-- Triggers
-- MySQL 8.4 Compatible
-- ============================================================

DROP TRIGGER IF EXISTS trg_loan_created;
DROP TRIGGER IF EXISTS trg_loan_returned;
DROP TRIGGER IF EXISTS trg_auto_suspend_member;
DROP TRIGGER IF EXISTS trg_prevent_over_issue;
DROP TRIGGER IF EXISTS trg_restore_member;
DROP TRIGGER IF EXISTS trg_update_overdue_status;

DELIMITER $$

-- ============================================================
-- Trigger 1
-- Loan Created Audit
-- ============================================================

CREATE TRIGGER trg_loan_created

AFTER INSERT ON loans

FOR EACH ROW

BEGIN

    INSERT INTO audit_log
    (

        event_type,

        description,

        member_id,

        book_id

    )

    VALUES
    (

        'LOAN_CREATED',

        CONCAT(

            'Loan #',

            NEW.loan_id,

            ' created. Due Date: ',

            DATE_FORMAT(NEW.due_date,'%Y-%m-%d')

        ),

        NEW.member_id,

        NEW.book_id

    );

END$$

-- ============================================================
-- Trigger 2
-- Loan Returned Audit
-- ============================================================

CREATE TRIGGER trg_loan_returned

AFTER UPDATE ON loans

FOR EACH ROW

BEGIN

    IF OLD.return_date IS NULL

    AND NEW.return_date IS NOT NULL

    THEN

        INSERT INTO audit_log
        (

            event_type,

            description,

            member_id,

            book_id

        )

        VALUES
        (

            'BOOK_RETURNED',

            CONCAT(

                'Loan #',

                NEW.loan_id,

                ' returned. Fine = ₹',

                NEW.fine_amount

            ),

            NEW.member_id,

            NEW.book_id

        );

    END IF;

END$$

-- ============================================================
-- Trigger 3
-- Auto Suspend Member
-- ============================================================

CREATE TRIGGER trg_auto_suspend_member

AFTER INSERT ON fines

FOR EACH ROW

BEGIN

    DECLARE v_total DECIMAL(10,2);

    SELECT

        COALESCE(SUM(amount),0)

    INTO

        v_total

    FROM fines

    WHERE

        member_id=NEW.member_id

    AND paid=FALSE;

    IF v_total>200

    THEN

        UPDATE members

        SET

            status='suspended'

        WHERE

            member_id=NEW.member_id

        AND

            status='active';

        INSERT INTO audit_log
        (

            event_type,

            description,

            member_id

        )

        VALUES
        (

            'MEMBER_SUSPENDED',

            CONCAT(

                'Auto Suspended. Unpaid Fine ₹',

                v_total

            ),

            NEW.member_id

        );

    END IF;

END$$

-- ============================================================
-- Trigger 4
-- Prevent Invalid Inventory
-- ============================================================

CREATE TRIGGER trg_prevent_over_issue

BEFORE UPDATE ON books

FOR EACH ROW

BEGIN

    IF NEW.available_copies<0

    THEN

        SIGNAL SQLSTATE '45000'

        SET MESSAGE_TEXT='No copies available.';

    END IF;

    IF NEW.available_copies>

       NEW.total_copies

    THEN

        SIGNAL SQLSTATE '45000'

        SET MESSAGE_TEXT='Available copies exceed total copies.';

    END IF;

END$$

-- ============================================================
-- Trigger 5
-- Restore Suspended Member Automatically
-- ============================================================

CREATE TRIGGER trg_restore_member

AFTER UPDATE ON fines

FOR EACH ROW

BEGIN

    DECLARE v_remaining DECIMAL(10,2);

    IF OLD.paid=FALSE

    AND NEW.paid=TRUE

    THEN

        SELECT

            COALESCE(

                SUM(amount),

                0

            )

        INTO

            v_remaining

        FROM fines

        WHERE

            member_id=NEW.member_id

        AND

            paid=FALSE;

        IF v_remaining<=200

        THEN

            UPDATE members

            SET

                status='active'

            WHERE

                member_id=NEW.member_id

            AND

                status='suspended';

            INSERT INTO audit_log
            (

                event_type,

                description,

                member_id

            )

            VALUES
            (

                'MEMBER_RESTORED',

                'Member restored automatically after paying fines.',

                NEW.member_id

            );

        END IF;

    END IF;

END$$

-- ============================================================
-- Trigger 6
-- Update Loan Status
-- ============================================================

CREATE TRIGGER trg_update_overdue_status

BEFORE UPDATE ON loans

FOR EACH ROW

BEGIN

    IF NEW.return_date IS NULL

    AND CURDATE()>NEW.due_date

    THEN

        SET NEW.status='overdue';

    END IF;

END$$

DELIMITER ;
