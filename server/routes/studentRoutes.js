const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

router.get("/images", auth("student"), (req, res) => {
  db.query(
    "SELECT * FROM images WHERE student_id = ? ORDER BY created_at DESC",
    [req.user.id],
    (err, rows) => {
      if (err) return res.sendStatus(500);
      res.json(rows);
    }
  );
});



const upload = multer({ storage });

router.post(
  "/upload",
  auth("student"),
  upload.single("image"),
  (req, res) => {
    const { category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!category) {
      return res.status(400).json({ message: "Category required" });
    }

    db.query(
      "INSERT INTO images (student_id, filename, category) VALUES (?, ?, ?)",
      [req.user.id, req.file.filename, category],
      (err) => {
        if (err) {
          console.error("DB error:", err);
          return res.sendStatus(500);
        }

        res.json({ message: "Image uploaded" });
      }
    );
  }
);

module.exports = router;