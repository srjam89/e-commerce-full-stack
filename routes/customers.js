const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
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

router.post("/login", (req, res) => {
  const { password, email } = req.body;
  console.log("hello");
  try {
    passport.use(
      new LocalStrategy((email, password, done) => {
        console.log("fgg");
        db.customers.findOne({ email: email }, (err, user) => {
          if (err) {
            done(err);
            console.log("Error has occurred.");
            return res.status(400).send();
          }
          if (!user) {
            done(null, false);
            console.log("No user found.");
            return res.status(401).send();
          }
          const matchedPassword = bcrypt.compare(password, user.password);

          if (!matchedPassword) {
            done(null, false);
            console.log("Passwords did not match!");
            return res.status(401).send();
          }

          done(null, user);
          res.send(user);
        });
      })
    );
    console.log("efrg");
  } catch (err) {
    console.log({ err });
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
