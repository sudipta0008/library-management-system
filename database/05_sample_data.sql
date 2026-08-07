-- ============================================================
-- LIBRARY MANAGEMENT SYSTEM
-- Part 5A
-- Sample Data
-- Members + Books
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE audit_log;
TRUNCATE TABLE fines;
TRUNCATE TABLE loans;
TRUNCATE TABLE books;
TRUNCATE TABLE members;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- MEMBERS
-- ============================================================

INSERT INTO members(name,email,phone,status)
VALUES

('Arjun Mehta','arjun.mehta@email.com','9876543210','active'),

('Priya Sharma','priya.sharma@email.com','9123456780','active'),

('Rahul Singh','rahul.singh@email.com','9988776655','active'),

('Sneha Patil','sneha.patil@email.com','9011223344','active'),

('Dev Kulkarni','dev.k@email.com','9901234567','active'),

('Amit Roy','amit.roy@email.com','9831122334','active'),

('Riya Das','riya.das@email.com','9877001122','active'),

('Ananya Bose','ananya@email.com','9834567812','active'),

('Rohan Gupta','rohan@email.com','9845123678','active'),

('Neha Verma','neha@email.com','9876123450','active'),

('Vikram Joshi','vikram@email.com','9123000001','active'),

('Meera Nair','meera@email.com','9999111100','active'),

('Kunal Shah','kunal@email.com','9000112233','active'),

('Aisha Khan','aisha@email.com','9011998877','active'),

('Sourav Dutta','sourav@email.com','9830001122','active'),

('Pooja Rao','pooja@email.com','9811223344','active'),

('Harsh Jain','harsh@email.com','9822334455','active'),

('Simran Kaur','simran@email.com','9898989898','active'),

('Nikhil Iyer','nikhil@email.com','9000001234','active'),

('Tanvi Mishra','tanvi@email.com','9812345678','active');

-- ============================================================
-- BOOKS
-- ============================================================

INSERT INTO books
(
title,
author,
isbn,
genre,
total_copies,
available_copies
)

VALUES

('The Alchemist',
'Paulo Coelho',
'9780062315007',
'Fiction',
5,
5),

('Atomic Habits',
'James Clear',
'9780735211292',
'Self Help',
4,
4),

('Clean Code',
'Robert C. Martin',
'9780132350884',
'Technology',
4,
4),

('Design Patterns',
'Gang of Four',
'9780201633610',
'Technology',
3,
3),

('The Pragmatic Programmer',
'Andrew Hunt',
'9780201616224',
'Technology',
5,
5),

('Sapiens',
'Yuval Noah Harari',
'9780062316110',
'History',
5,
5),

('Deep Work',
'Cal Newport',
'9781455586691',
'Productivity',
4,
4),

('Think and Grow Rich',
'Napoleon Hill',
'9781585424337',
'Finance',
3,
3),

('Rich Dad Poor Dad',
'Robert Kiyosaki',
'9781612680194',
'Finance',
4,
4),

('The Psychology of Money',
'Morgan Housel',
'9780857197689',
'Finance',
5,
5),

('Harry Potter and the Philosopher''s Stone',
'J. K. Rowling',
'9780747532743',
'Fantasy',
8,
8),

('Harry Potter and the Chamber of Secrets',
'J. K. Rowling',
'9780747538486',
'Fantasy',
6,
6),

('The Hobbit',
'J. R. R. Tolkien',
'9780261103344',
'Fantasy',
5,
5),

('The Lord of the Rings',
'J. R. R. Tolkien',
'9780618640157',
'Fantasy',
5,
5),

('To Kill a Mockingbird',
'Harper Lee',
'9780061120084',
'Classic',
5,
5),

('1984',
'George Orwell',
'9780451524935',
'Classic',
5,
5),

('The Great Gatsby',
'F. Scott Fitzgerald',
'9780743273565',
'Classic',
4,
4),

('The Silent Patient',
'Alex Michaelides',
'9781250301697',
'Thriller',
4,
4),

('Gone Girl',
'Gillian Flynn',
'9780307588371',
'Thriller',
4,
4),

('The Da Vinci Code',
'Dan Brown',
'9780307474278',
'Thriller',
5,
5),

('Introduction to Algorithms',
'Cormen',
'9780262033848',
'Technology',
3,
3),

('Artificial Intelligence',
'Stuart Russell',
'9780136042594',
'Technology',
3,
3),

('Database System Concepts',
'Silberschatz',
'9780078022159',
'Technology',
4,
4),

('Operating System Concepts',
'Silberschatz',
'9781118063330',
'Technology',
4,
4),

('Computer Networks',
'Andrew Tanenbaum',
'9780132126953',
'Technology',
4,
4),

('Python Crash Course',
'Eric Matthes',
'9781593279288',
'Programming',
5,
5),

('Effective Java',
'Joshua Bloch',
'9780134685991',
'Programming',
4,
4),

('C++ Primer',
'Lippman',
'9780321714114',
'Programming',
4,
4),

('Head First Design Patterns',
'Eric Freeman',
'9780596007126',
'Programming',
3,
3),

('Cracking the Coding Interview',
'Gayle McDowell',
'9780984782857',
'Programming',
5,
5);
-- ============================================================
-- LIBRARY MANAGEMENT SYSTEM
-- Part 5B-1
-- Sample Loan Data
-- ============================================================

INSERT INTO loans
(
    member_id,
    book_id,
    loan_date,
    due_date,
    return_date,
    status,
    fine_amount
)
VALUES

-- ============================================================
-- ACTIVE LOANS
-- ============================================================

(1,1,CURDATE()-INTERVAL 5 DAY,CURDATE()+INTERVAL 9 DAY,NULL,'active',0),

(2,2,CURDATE()-INTERVAL 3 DAY,CURDATE()+INTERVAL 11 DAY,NULL,'active',0),

(3,3,CURDATE()-INTERVAL 7 DAY,CURDATE()+INTERVAL 7 DAY,NULL,'active',0),

(4,4,CURDATE()-INTERVAL 2 DAY,CURDATE()+INTERVAL 12 DAY,NULL,'active',0),

(5,5,CURDATE()-INTERVAL 10 DAY,CURDATE()+INTERVAL 4 DAY,NULL,'active',0),

(6,6,CURDATE()-INTERVAL 1 DAY,CURDATE()+INTERVAL 13 DAY,NULL,'active',0),

(7,7,CURDATE()-INTERVAL 6 DAY,CURDATE()+INTERVAL 8 DAY,NULL,'active',0),

(8,8,CURDATE()-INTERVAL 9 DAY,CURDATE()+INTERVAL 5 DAY,NULL,'active',0),

-- ============================================================
-- RETURNED BOOKS
-- ============================================================

(9,9,
CURDATE()-INTERVAL 20 DAY,
CURDATE()-INTERVAL 6 DAY,
CURDATE()-INTERVAL 7 DAY,
'returned',
0),

(10,10,
CURDATE()-INTERVAL 25 DAY,
CURDATE()-INTERVAL 11 DAY,
CURDATE()-INTERVAL 12 DAY,
'returned',
0),

(11,11,
CURDATE()-INTERVAL 30 DAY,
CURDATE()-INTERVAL 16 DAY,
CURDATE()-INTERVAL 17 DAY,
'returned',
0),

(12,12,
CURDATE()-INTERVAL 28 DAY,
CURDATE()-INTERVAL 14 DAY,
CURDATE()-INTERVAL 15 DAY,
'returned',
0),

(13,13,
CURDATE()-INTERVAL 22 DAY,
CURDATE()-INTERVAL 8 DAY,
CURDATE()-INTERVAL 9 DAY,
'returned',
0),

(14,14,
CURDATE()-INTERVAL 26 DAY,
CURDATE()-INTERVAL 12 DAY,
CURDATE()-INTERVAL 13 DAY,
'returned',
0),

(15,15,
CURDATE()-INTERVAL 18 DAY,
CURDATE()-INTERVAL 4 DAY,
CURDATE()-INTERVAL 5 DAY,
'returned',
0),

-- ============================================================
-- OVERDUE LOANS
-- ============================================================

(16,16,
CURDATE()-INTERVAL 25 DAY,
CURDATE()-INTERVAL 11 DAY,
NULL,
'overdue',
55),

(17,17,
CURDATE()-INTERVAL 30 DAY,
CURDATE()-INTERVAL 16 DAY,
NULL,
'overdue',
80),

(18,18,
CURDATE()-INTERVAL 21 DAY,
CURDATE()-INTERVAL 7 DAY,
NULL,
'overdue',
35),

(19,19,
CURDATE()-INTERVAL 35 DAY,
CURDATE()-INTERVAL 21 DAY,
NULL,
'overdue',
105),

(20,20,
CURDATE()-INTERVAL 24 DAY,
CURDATE()-INTERVAL 10 DAY,
NULL,
'overdue',
50);
UPDATE books b

SET available_copies =

total_copies -

(

SELECT COUNT(*)

FROM loans l

WHERE

l.book_id=b.book_id

AND l.return_date IS NULL

);
-- ============================================================
-- LIBRARY MANAGEMENT SYSTEM
-- Part 5B-2
-- Fine Records & Member Status
-- ============================================================

-- ============================================================
-- FINE RECORDS
-- ============================================================

INSERT INTO fines
(
    loan_id,
    member_id,
    amount,
    reason,
    paid
)
VALUES

(16,16,55.00,'Returned 11 days late',FALSE),

(17,17,80.00,'Returned 16 days late',FALSE),

(18,18,35.00,'Returned 7 days late',FALSE),

(19,19,105.00,'Returned 21 days late',FALSE),

(20,20,50.00,'Returned 10 days late',FALSE),

(9,9,15.00,'Minor delay',TRUE),

(10,10,20.00,'Late return',TRUE),

(11,11,10.00,'Late return',TRUE),

(12,12,25.00,'Late return',TRUE),

(13,13,30.00,'Late return',TRUE);
INSERT INTO fines
(
    loan_id,
    member_id,
    amount,
    reason,
    paid
)
VALUES

(17,17,140.00,'Repeated overdue books',FALSE);
-- ============================================================
-- LIBRARY MANAGEMENT SYSTEM
-- Part 5C
-- Audit Log + Verification Queries
-- ============================================================

-- ============================================================
-- SAMPLE AUDIT LOG
-- ============================================================

INSERT INTO audit_log
(
    event_type,
    description,
    member_id,
    book_id
)
VALUES

('BOOK_ADDED',
 'Added "The Alchemist" to library.',
 NULL,
 1),

('BOOK_ADDED',
 'Added "Atomic Habits" to library.',
 NULL,
 2),

('BOOK_ADDED',
 'Added "Clean Code" to library.',
 NULL,
 3),

('MEMBER_REGISTERED',
 'New member registered.',
 1,
 NULL),

('MEMBER_REGISTERED',
 'New member registered.',
 2,
 NULL),

('MEMBER_REGISTERED',
 'New member registered.',
 3,
 NULL),

('LOAN_CREATED',
 'Book issued successfully.',
 1,
 1),

('LOAN_CREATED',
 'Book issued successfully.',
 2,
 2),

('BOOK_RETURNED',
 'Book returned without fine.',
 9,
 9),

('BOOK_RETURNED',
 'Book returned with fine.',
 16,
 16),

('MEMBER_SUSPENDED',
 'Automatic suspension due to unpaid fines.',
 17,
 NULL),

('MEMBER_RESTORED',
 'Member restored after paying fines.',
 17,
 NULL);
 