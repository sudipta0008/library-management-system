require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {

        // Test database connection
        const connection = await pool.getConnection();
        connection.release();

        app.listen(PORT, () => {
            console.clear();

            console.log("=========================================");
            console.log("📚 LibraryOS Backend");
            console.log("=========================================");

            console.log(`✅ Database : ${process.env.DB_NAME}`);
            console.log(`🌐 Host     : ${process.env.DB_HOST}`);
            console.log(`🚀 Server   : http://localhost:${PORT}`);
            console.log(`❤️ Health   : http://localhost:${PORT}/health`);

            console.log("=========================================\n");
        });

    } catch (err) {

        console.error("\n❌ Failed to connect to MySQL\n");

        console.error(err.message);

        process.exit(1);

    }
}

startServer();