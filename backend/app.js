require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/auth");
/* ----------------------------- ROUTES ----------------------------- */

const booksRoutes = require("./routes/books");
const membersRoutes = require("./routes/members");
const loansRoutes = require("./routes/loans");
const dashboardRoutes = require("./routes/dashboard");
const reportsRoutes = require("./routes/reports");

/* --------------------------- MIDDLEWARE --------------------------- */

const errorHandler = require("./middleware/errorHandler");

/* ----------------------------- CORS ------------------------------ */

app.use(
    cors({
         origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    })
);


/* --------------------------- BODY PARSER -------------------------- */

app.use(
    express.json({
        limit: "5mb"
    })
);

app.use(
    express.urlencoded({
        extended: true
    })
);

/* -------------------------- HEALTH CHECK -------------------------- */

app.get("/health", (req, res) => {

    res.status(200).json({

        success: true,

        message: "Library API is running"

    });

});

/* ----------------------------- ROUTES ----------------------------- */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", booksRoutes);

app.use("/api/v1/members", membersRoutes);

app.use("/api/v1/loans", loansRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/api/v1/reports", reportsRoutes);

/* --------------------------- 404 HANDLER -------------------------- */

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found"

    });

});

/* -------------------------- ERROR HANDLER ------------------------- */

app.use(errorHandler);

module.exports = app;