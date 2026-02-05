const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

/* ---------------- LOGIN ---------------- */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT id, role FROM users WHERE username=? AND password=?",
    [username, password],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = rows[0];

      const token = jwt.sign(
        { id: user.id, role: user.role },
        "secret",
        { expiresIn: "1d" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          role: user.role
        }
      });
    }
  );
});

/* ---------------- REGISTER STUDENT ---------------- */
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if user already exists
  db.query(
    "SELECT id FROM users WHERE username = ?",
    [username],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      if (rows.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      }

      // insert new student
      db.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, 'student')",
        [username, password],
        (err) => {
          if (err) {
            console.error(err);
            return res.sendStatus(500);
          }

          res.json({ message: "Student registered successfully" });
        }
      );
    }
  );
});

module.exports = router;