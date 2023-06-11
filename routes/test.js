var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var bcrypt = require("bcrypt");
const router = express.Router();
var db = require("../db");

/* Configure password authentication strategy.
 *
 * The `LocalStrategy` authenticates users by verifying a email and password.
 * The strategy parses the email and password from the request and calls the
 * `verify` function.
 *
 * The `verify` function queries the database for the user record and verifies
 * the password by hashing the password supplied by the user and comparing it to
 * the hashed password stored in the database.  If the comparison succeeds, the
 * user is authenticated; otherwise, not.
 */
passport.use(
  new LocalStrategy(
    {
      // or whatever you want to use
      usernameField: "email", // define the parameter in req.body that passport can use as username and password
      passwordField: "password",
    },
    function verify(email, password, cb) {
      db.query(
        "SELECT * FROM customers WHERE email = $1",
        [email],
        function (err, result) {
          if (err) {
            return cb(err);
          }
          if (!result) {
            return cb(null, false, { message: "Incorrect email or password." });
          }
          const user = result.rows[0];
          bcrypt.compare(password, user.password, function (err, res) {
            if (err) {
              return cb(err);
            }

            return cb(null, user);
          });
        }
      );
    }
  )
);

// passport.use(
//   new LocalStrategy(function verify(email, password, cb) {
//     const customer = db.query("SELECT * FROM customers WHERE email = $1", [
//       email,
//     ]);

//     if (customer.rows.length === 0) {
//       console.log("Customer does not exist!");
//       return res.status(400).send();
//     }
//     const user = customer.rows[0];

//     // Compare passwords:
//     const matchedPassword = bcrypt.compare(password, user.password);

//     if (!matchedPassword) {
//       console.log("Passwords did not match!");
//       return res.redirect("login");
//     }

//     res.send(user);
//   })
// );

/* Configure session management.
 *
 * When a login session is established, information about the user will be
 * stored in the session.  This information is supplied by the `serializeUser`
 * function, which is yielding the user ID and email.
 *
 * As the user interacts with the app, subsequent requests will be authenticated
 * by verifying the session.  The same user information that was serialized at
 * session establishment will be restored when the session is authenticated by
 * the `deserializeUser` function.
 *
 * Since every request to the app needs the user ID and email, in order to
 * fetch todo records and render the user element in the navigation bar, that
 * information is stored in the session.
 */
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, email: user.email });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

/** POST /login/password
 *
 * This route authenticates the user by verifying a email and password.
 *
 * A email and password are submitted to this route via an HTML form, which
 * was rendered by the `GET /login` route.  The email and password is
 * authenticated using the `local` strategy.  The strategy will parse the
 * email and password from the request and call the `verify` function.
 *
 * Upon successful authentication, a login session will be established.  As the
 * user interacts with the app, by clicking links and submitting forms, the
 * subsequent requests will be authenticated by verifying the session.
 *
 * When authentication fails, the user will be re-prompted to login and shown
 * a message informing them of what went wrong.
 *
 * @openapi
 * /login/password:
 *   post:
 *     summary: Log in using a email and password
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: number
 *     responses:
 *       "302":
 *         description: Redirect.
 */
// router.post("/login", function (req, res, next) {
//   passport.authenticate("local", function (req, res) {
//     return res.status(200).send();
//   });
//   next();
// });
//,
// router.post("/login", passport.authenticate("local"), (req, res) => {
//   try {
//     console.log([req, res]);
//     res.status(200).send({ req });
//   } catch (err) {
//     console.log(err);
//   }
// });

router.post("/login", function (req, res, next) {
  passport.authenticate("local", {}, function (err, user, info) {
    if (err) {
      return next(err);
    }
    console.log({ user, info });
    if (!user) {
      return res.status(404).json({ body: "Not Found" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.status(200).send({ user });
    });
  })(req, res, next);
});

//     successReturnToOrRedirect: "/",
//     failureRedirect: "/login",
//     failureMessage: true,
//   }),

module.exports = router;
