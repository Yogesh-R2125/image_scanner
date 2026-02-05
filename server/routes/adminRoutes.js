const express = require("express");
const db = require("../db");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

/* ================= IMAGES LIST ================= */
router.get("/images", verifyAdmin, (req, res) => {
  const sql = `
    SELECT 
      images.id,
      images.filename,
      images.category,
      images.status,
      images.uploaded_at,
      images.approved_at,
      images.rejected_at,
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

/* ================= APPROVE IMAGE ================= */
router.put("/approve/:id", verifyAdmin, (req, res) => {
  db.query(
    `
    UPDATE images 
    SET status='approved',
        approved_at = NOW(),
        rejected_at = NULL
    WHERE id = ?
    `,
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

/* ================= REJECT IMAGE ================= */
router.put("/reject/:id", verifyAdmin, (req, res) => {
  db.query(
    `
    UPDATE images 
    SET status='rejected',
        rejected_at = NOW(),
        approved_at = NULL
    WHERE id = ?
    `,
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

/* ================= ADD CATEGORY ================= */
router.post("/category", verifyAdmin, (req, res) => {
  const { name, parent_id } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name required" });
  }

  db.query(
    "INSERT INTO categories (name, parent_id) VALUES (?, ?)",
    [name, parent_id || null],
    (err) => {
      if (err) {
        console.error("CATEGORY ERROR:", err);
        return res.status(500).json({ error: "Category add failed" });
      }
      res.json({ message: "Category added" });
    }
  );
});

/* ================= UPDATE CATEGORY ================= */
router.put("/category/:id", verifyAdmin, (req, res) => {
  const { name, parent_id } = req.body;

  db.query(
    "UPDATE categories SET name=?, parent_id=? WHERE id=?",
    [name, parent_id || null, req.params.id],
    (err) => {
      if (err) {
        console.error("CATEGORY UPDATE ERROR:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Category updated" });
    }
  );
});

/* ================= CATEGORY LIST ================= */
router.get("/categories", verifyAdmin, (req, res) => {
  db.query(
    "SELECT id, name, parent_id FROM categories",
    (err, rows) => {
      if (err) {
        console.error("CATEGORIES ERROR:", err);
        return res.status(500).json(err);
      }
      res.json(rows);
    }
  );
});

module.exports = router;
