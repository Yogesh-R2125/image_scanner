const express = require("express");
const auth = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();

/* Get all images with student name */
router.get("/images", auth("admin"), (req, res) => {
  db.query(
    `
    SELECT images.*, users.username AS studentName
    FROM images
    JOIN users ON images.student_id = users.id
    ORDER BY images.created_at DESC
    `,
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.json(rows);
    }
  );
});

/* Approve */
router.put("/approve/:id", auth("admin"), (req, res) => {
  db.query(
    "UPDATE images SET approved=TRUE, rejected=FALSE WHERE id=?",
    [req.params.id],
    () => res.json({ message: "Approved" })
  );
});

/* Reject */
router.put("/reject/:id", auth("admin"), (req, res) => {
  db.query(
    "UPDATE images SET rejected=TRUE, approved=FALSE WHERE id=?",
    [req.params.id],
    () => res.json({ message: "Rejected" })
  );
});

module.exports = router;
