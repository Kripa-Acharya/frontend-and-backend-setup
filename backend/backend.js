const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config({ path: "../.env" });

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

const PORT = process.env.APP_PORT || 3000;

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.post("/submit", async (req, res) => {
    const { name, email, phone, address } = req.body;

    try {
        await pool.query(
            "INSERT INTO form_users (name, email, phone, address) VALUES ($1, $2, $3, $4)",
            [name, email, phone, address]
        );
        res.json({ message: "Data saved successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



