const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM cart_items", (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result.rows);
  });
});

router.post("/", (req, res) => {
  const { product_id, qty, price } = req.body;
  let customer_id;

  db.query(
    "INSERT INTO cart_items (id, product_id, qty, customer_id) VALUES ($1, $2, $3, $4)",
    (err, result) => {}
  );
});

module.exports = router;
