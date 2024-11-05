const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");

const PORT = 3000;
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: "student_management",
// });

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database");
});

// Routes
// app.get("/students", (req, res) => {
//   db.query("SELECT * FROM students", (err, results) => {
//     if (err) return res.status(500).json(err);
//     res.json(results);
//   });
// });

// app.post("/students", (req, res) => {
//   const { name, email } = req.body;

//   if (!name || !email) {
//     return res.status(400).json({ eroror: "Please provide" });
//   }

//   db.query(
//     "INSERT INTO students (name,email) VALUES (?,?)",
//     [name, email],
//     (err, results) => {
//       if (err) return res.status(500).json(err);
//       res.json({ id: results.insertId, name, email });
//     }
//   );
// });

app.use("/api/student", require("./routes/student"));
app.use("/api/class", require("./routes/class"));
app.use("/api/course", require("./routes/course"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
