const pool = require("../config/db");

/* ===========================================================
   GET BOOKS
   Supports:
   ?page=1
   ?limit=10
   ?search=atomic
   ?genre=Technology
   ?sort=title
=========================================================== */

exports.getBooks = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      genre = "",
      status = "",
      sort = "title",
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const allowedSort = [
      "title",
      "author",
      "genre",
      "available_copies",
    ];

    if (!allowedSort.includes(sort)) {
      sort = "title";
    }

    let sql = `
      SELECT *
      FROM vw_book_inventory
      WHERE (
        title LIKE ?
        OR author LIKE ?
        OR isbn LIKE ?
      )
    `;

    const searchValue = `%${search}%`;

    const params = [
      searchValue,
      searchValue,
      searchValue,
    ];

    // Genre filter
    if (genre) {
      sql += ` AND genre = ?`;
      params.push(genre);
    }

    // Status filter
    if (status) {
      sql += ` AND inventory_status = ?`;
      params.push(status);
    }

    sql += `
      ORDER BY ${sort}
      LIMIT ?
      OFFSET ?
    `;

    params.push(limit, offset);

    const [books] = await pool.query(
      sql,
      params
    );

    // Count query
    let countSql = `
      SELECT COUNT(*) AS total
      FROM vw_book_inventory
      WHERE (
        title LIKE ?
        OR author LIKE ?
        OR isbn LIKE ?
      )
    `;

    const countParams = [
      searchValue,
      searchValue,
      searchValue,
    ];

    if (genre) {
      countSql += ` AND genre = ?`;
      countParams.push(genre);
    }

    if (status) {
      countSql += ` AND inventory_status = ?`;
      countParams.push(status);
    }

    const [[count]] = await pool.query(
      countSql,
      countParams
    );

    res.status(200).json({
      success: true,

      data: books,

      pagination: {
        page,
        limit,
        total: count.total,
        totalPages: Math.ceil(
          count.total / limit
        ),
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===========================================================
   ADD BOOK
=========================================================== */

exports.addBook = async (req, res) => {

    try {

        const {
            title,
            author,
            isbn,
            genre,
            copies
        } = req.body;

        if (!title || !author) {

            return res.status(400).json({

                success: false,

                message: "Title and Author are required."

            });

        }

        if (isbn) {

            const [[exists]] = await pool.query(

                "SELECT book_id FROM books WHERE isbn=?",

                [isbn]

            );

            if (exists) {

                return res.status(409).json({

                    success: false,

                    message: "ISBN already exists."

                });

            }

        }

        const [result] = await pool.query(

            `
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
            (?,?,?,?,?,?)
            `,

            [

                title.trim(),

                author.trim(),

                isbn || null,

                genre || "General",

                copies || 1,

                copies || 1

            ]

        );

        res.status(201).json({

            success: true,

            message: "Book added successfully.",

            data: {

                book_id: result.insertId

            }

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* ===========================================================
   UPDATE BOOK
=========================================================== */

exports.updateBook = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            title,

            author,

            genre,

            total_copies,

            available_copies

        } = req.body;

        await pool.query(

            `
            UPDATE books
            SET
                title=?,
                author=?,
                genre=?,
                total_copies=?,
                available_copies=?
            WHERE book_id=?
            `,

            [

                title,

                author,

                genre,

                total_copies,

                available_copies,

                id

            ]

        );

        res.json({

            success: true,

            message: "Book updated successfully."

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/* ===========================================================
   DELETE BOOK
=========================================================== */

exports.deleteBook = async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(

            "DELETE FROM books WHERE book_id=?",

            [id]

        );

        res.json({

            success: true,

            message: "Book deleted successfully."

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};