const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) {
      throw err;
    }
    res.status(200).send(result.rows);
  });
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  db.query("SELECT * FROM products WHERE id = $1", [id], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).send(results.rows);
  });
});

module.exports = router;
