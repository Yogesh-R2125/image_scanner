const express = require("express");
const router = express.Router();
const db = require("../db");

/* ---------- get ALL categories ---------- */
router.get("/", (req, res) => {
  db.query(
    "SELECT id, name, parent_id FROM categories",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/* ---------- get main categories ---------- */
router.get("/main", (req, res) => {
  db.query(
    "SELECT * FROM categories WHERE parent_id IS NULL",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/* ---------- get child categories ---------- */
router.get("/:parentId", (req, res) => {
  db.query(
    "SELECT * FROM categories WHERE parent_id=?",
    [req.params.parentId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/* ---------- add category ---------- */
router.post("/", (req, res) => {
  const { name, parent_id } = req.body;

  db.query(
    "INSERT INTO categories(name, parent_id) VALUES (?, ?)",
    [name, parent_id || null],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Category added" });
    }
  );
});

module.exports = router;
