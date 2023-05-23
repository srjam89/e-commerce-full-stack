const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();
const db = require("../db");

router.get("/:id", (request, response) => {
  const id = parseInt(request.params.id);

  db.query("SELECT * FROM customers WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
});

router.post("/", async (request, response) => {
  const body = request.body;
  const mustHave = ["first_name", "last_name", "email", "password"];
  const customer = mustHave.reduce((user, key) => {
    if (body.hasOwnProperty(key)) {
      let value = body[key];
      user.push(value);
    }
    return user;
  }, []);
  if (!mustHave.length === customer.length) {
    return response.status(400).send();
  }

  customer[3] = await passwordHash(customer[3], 10);

  const query = {
    text: "INSERT INTO customers (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
    values: customer,
  };
  db.query(query, (err, result) => {
    if (err) {
      return response.status(400).send(err);
    }
    response.send(customer);
  });
});

const passwordHash = async (password, saltRounds) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.log(err);
  }
  return null;
};

router.post("/login", async (req, res) => {
  const { password, email } = req.body;

  try {
    const customer = await db.query(
      "SELECT * FROM customers WHERE email = $1",
      [email]
    );

    if (customer.rows.length === 0) {
      console.log("Customer does not exist!");
      return res.status(400).send();
    }
    const user = customer.rows[0];

    // Compare passwords:
    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      console.log("Passwords did not match!");
      return res.redirect("login");
    }

    res.send(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/profile", (req, res) => {
  res.render("profile", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
