const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Create a new student
router.post("/create", (req, res) => {
  const { name, age, courses, className } = req.body;

  if (!name || !age || !courses || !className) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  const sqlCheck = "SELECT * FROM students WHERE slug = ?";
  const sqlInsert = "INSERT INTO students SET ?";
  const slug = slugify(name).toLowerCase();

  db.query(sqlCheck, slug, (err, existingStudent) => {
    if (err) {
      return res.status(500).json({ msg: "Database query error", error: err });
    }

    if (existingStudent && existingStudent.length > 0) {
      return res.status(400).json({ msg: "Student exists" });
    }

    const data = {
      student_name: name.toLowerCase(),
      uid: uuidv4(),
      slug,
      student_age: age.toString(),
      student_course: courses.toString().toLowerCase(),
      student_class: className.toLowerCase(),
    };

    db.query(sqlInsert, data, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ msg: "Unable to store data", error: err });
      }

      return res.status(201).json({ data });
    });
  });
});

// Retrieve all students
router.get("/", (req, res) => {
  const getQuery = "SELECT * FROM students";

  db.query(getQuery, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ msg: "Unable to retrieve students", error: err });
    }
    return res.status(200).json(result);
  });
});

// Retrieve students by class ID
router.get("/by-class/:class_id", (req, res) => {
  const { class_id } = req.params;

  const sql = "SELECT * FROM students WHERE class_id = ?";
  db.query(sql, [class_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ msg: "Unable to retrieve students", error: err });
    }
    return res.status(200).json(results);
  });
});

// Update student information
router.put("/", (req, res) => {
  const { name, age, courses, className, slug } = req.body;

  if (!name || !age || !courses || !className || !slug) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  const newSlug = slugify(name).toLowerCase();

  const updateQuery = `
    UPDATE students 
    SET student_name = ?, student_age = ?, student_course = ?, student_class = ?, slug = ? 
    WHERE slug = ?
  `;

  db.query(
    updateQuery,
    [
      name.toLowerCase(),
      age,
      courses.toString(),
      className.toLowerCase(),
      newSlug,
      slug,
    ],
    (error) => {
      if (error) {
        return res.status(400).json({ msg: "Unable to update", error });
      }

      res
        .status(200)
        .json({
          msg: "Student updated successfully",
          updatedData: { name, age, courses, className, slug: newSlug },
        });
    }
  );
});

// Delete student
router.delete("/:uid", (req, res) => {
  const { uid } = req.params;
  const delQuery = "DELETE FROM students WHERE uid = ?";

  db.query(delQuery, [uid], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ msg: "Unable to delete student", error: err });
    }
    res
      .status(200)
      .json({ success: true, msg: "Student deleted successfully" });
  });
});

module.exports = router;
