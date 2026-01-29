const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

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

module.exports = router;
