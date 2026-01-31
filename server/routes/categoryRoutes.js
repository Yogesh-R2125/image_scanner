const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM categories", (err, rows) => res.json(rows));
});

module.exports = router;
