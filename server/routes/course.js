const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const db = require("../config/db");

// Create a new course
router.post("/create", (req, res) => {
  const { name } = req.body;

  // Simple validation
  if (!name) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // SQL query for checking if course exists
  const sqlCheck = `SELECT * FROM courses WHERE slug = ?`;
  const sqlInsert = "INSERT INTO courses SET ?";
  const slug = slugify(name).toLowerCase();

  db.query(sqlCheck, slug, (err, course) => {
    if (err) {
      return res.status(500).json({ msg: "Database query error", error: err });
    }
    if (course.length > 0) {
      return res.status(400).json({ msg: "Course exists" });
    }

    const data = {
      course_name: name.toLowerCase(),
      slug,
    };

    db.query(sqlInsert, data, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ msg: "Unable to store data", error: err });
      }
      return res.status(201).json({ data });
    });
  });
});

// Get all courses
router.get("/", (req, res) => {
  const getQuery = `SELECT * FROM courses`;

  db.query(getQuery, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ msg: "Unable to retrieve courses", error: err });
    }
    return res.status(200).json(result);
  });
});

// Update a course
router.put("/", (req, res) => {
  const { course_name, students, slug } = req.body;

  if (!course_name || !students || !slug) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }
  if (students.length === 0) {
    return res.status(400).json({ msg: "Please add students to this course" });
  }

  const newSlug = slugify(course_name).toLowerCase();
  const updateData = `
    UPDATE courses 
    SET course_name = ?, course_students = ?, slug = ? 
    WHERE slug = ?
  `;

  db.query(
    updateData,
    [
      course_name.toLowerCase(),
      students.toString().toLowerCase(),
      newSlug,
      slug,
    ],
    (error) => {
      if (error) {
        return res.status(500).json({ msg: "Unable to update", error });
      }
      res.status(200).json({ msg: "Course updated successfully" });
    }
  );
});

// Delete a course
router.delete("/", (req, res) => {
  const { course_id } = req.body;

  if (!course_id) {
    return res.status(400).json({ msg: "Course ID is required" });
  }

  const delQuery = "DELETE FROM courses WHERE course_id = ?";
  db.query(delQuery, [course_id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ msg: "Unable to delete course", error: err });
    }
    res.status(200).json({ success: true, msg: "Course deleted successfully" });
  });
});

module.exports = router;
