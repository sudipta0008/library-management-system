const pool = require("../config/db");

exports.getDashboard = async (req, res) => {

    try {

        const [

            [[stats]],

            [genreChart],

            [popularBooks],

            [activeLoans],

            [recentAudit],

            [recentMembers]

        ] = await Promise.all([

            pool.query(
                "SELECT * FROM vw_dashboard_stats"
            ),

            pool.query(
                "SELECT * FROM vw_genre_statistics"
            ),

            pool.query(
                `
                SELECT *
                FROM vw_popular_books
                LIMIT 5
                `
            ),

            pool.query(
                `
                SELECT *
                FROM vw_active_loans
                LIMIT 10
                `
            ),

            pool.query(
                `
                SELECT *
                FROM audit_log
                ORDER BY created_at DESC
                LIMIT 10
                `
            ),

            pool.query(
                `
                SELECT
                    member_id,
                    name,
                    joined_date,
                    status
                FROM members
                ORDER BY joined_date DESC
                LIMIT 5
                `
            )

        ]);

        res.status(200).json({

            success: true,

            data: {

                stats,

                genreChart,

                popularBooks,

                activeLoans,

                recentAudit,

                recentMembers

            }

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "Failed to load dashboard."

        });

    }

};