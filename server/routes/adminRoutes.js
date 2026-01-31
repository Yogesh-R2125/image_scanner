const express = require("express");
const db = require("../db");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

router.get("/images", verifyAdmin, (req, res) => {
  const sql = `
    SELECT 
      images.id,
      images.filename,
      images.category,
      images.status,
      users.username AS studentName
    FROM images
    INNER JOIN users ON images.student_id = users.id
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("ADMIN /images ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

/**
 * APPROVE IMAGE
 */
router.put("/approve/:id", verifyAdmin, (req, res) => {
  db.query(
    "UPDATE images SET status = 'approved' WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("APPROVE ERROR:", err);
        return res.status(500).json({ error: "Approve failed" });
      }
      res.json({ message: "Approved" });
    }
  );
});

/**
 * REJECT IMAGE
 */
router.put("/reject/:id", verifyAdmin, (req, res) => {
  db.query(
    "UPDATE images SET status = 'rejected' WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("REJECT ERROR:", err);
        return res.status(500).json({ error: "Reject failed" });
      }
      res.json({ message: "Rejected" });
    }
  );
});

/**
 * ADD CATEGORY
 */
router.post("/category", verifyAdmin, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name required" });
  }

  db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name],
    (err) => {
      if (err) {
        console.error("CATEGORY ERROR:", err);
        return res.status(500).json({ error: "Category add failed" });
      }
      res.json({ message: "Category added" });
    }
  );
});

router.get("/categories", verifyAdmin, (req, res) => {
  db.query("SELECT name FROM categories", (err, rows) => {
    if (err) {
      console.error("CATEGORIES ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});


module.exports = router;
