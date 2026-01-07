import express from "express";
import pkg from "pg";
import dotenv, { configDotenv } from "dotenv";
dotenv.config()
const { Pool } = pkg;


const app = express();

app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,              
  host: process.env.DB_HOST,            
  database: process.env.DB_DATABASE,           
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,                     
});

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); 
    res.json(result.rows); 
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



  
