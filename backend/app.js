require('dotenv').config();

const express = require('express');
const cors = require('cors');
const booksRoutes = require("./routes/books");
const membersRoutes = require("./routes/members");
const loansRoutes = require("./routes/loans");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/loans", loansRoutes);

module.exports = app;