const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const db = require("../config/db");
const { v4: uuidV4 } = require("uuid");

// Create a new class
router.post("/create", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "Please enter class name" });
  }

  const slug = slugify(name).toLowerCase();
  const sqlCheck = "SELECT * FROM classes WHERE slug = ?";
  const sqlInsert = "INSERT INTO classes SET ?";

  db.query(sqlCheck, slug, (err, course) => {
    if (err) {
      return res.status(500).json({ msg: "Database query error", error: err });
    }

    if (course.length > 0) {
      return res.status(400).json({ msg: "Class already exists" });
    }

    const data = {
      class_name: name.toLowerCase(),
      slug,
      uid: uuidV4(),
    };

    db.query(sqlInsert, data, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ msg: "Unable to store the data", error: err });
      }
      return res.status(201).json({ msg: "Class created successfully", data });
    });
  });
});

// Get all classes
router.get("/", (req, res) => {
  const getQuery = "SELECT * FROM classes";

  db.query(getQuery, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ msg: "Unable to retrieve classes", error: err });
    }
    return res.status(200).json(result);
  });
});

// Update a class
router.put("/", (req, res) => {
  const { class_name, slug } = req.body;

  if (!class_name || !slug) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  const newSlug = slugify(class_name).toLowerCase();
  const updateData =
    "UPDATE classes SET class_name = ?, slug = ? WHERE slug = ?";

  db.query(updateData, [class_name.toLowerCase(), newSlug, slug], (error) => {
    if (error) {
      return res.status(500).json({ msg: "Unable to update", error });
    }
    return res.status(200).json({ msg: "Class updated successfully" });
  });
});

// Delete a class
router.delete("/:uid", (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ msg: "Class UID is required" });
  }

  const delQuery = "DELETE FROM classes WHERE uid = ?";
  db.query(delQuery, [uid], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ msg: "Unable to delete class", error: err });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Class deleted successfully" });
  });
});

module.exports = router;
