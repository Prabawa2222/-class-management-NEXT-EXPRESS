const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config(); // Load .env variables

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "student_management",
});

module.exports = db;
