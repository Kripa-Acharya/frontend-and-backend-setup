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

app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM form_users ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});

app.post("/users", async (req, res) => {
    const { name, email, phone, address } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO form_users (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, phone, address]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === "23505") {
            return res.status(400).json({ message: "Duplicate value detected" });
        }
        res.status(500).json({ message: "Database error" });
    }
});

app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    try {
        const result = await pool.query(
            "UPDATE form_users SET name=$1, email=$2, phone=$3, address=$4 WHERE id=$5 RETURNING *",
            [name, email, phone, address, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === "23505") {
            return res.status(400).json({ message: "Duplicate value detected" });
        }
        res.status(500).json({ message: "Database error" });
    }
});

app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM form_users WHERE id=$1 RETURNING *",
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
