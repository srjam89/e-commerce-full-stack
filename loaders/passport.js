const passport = require("passport");
// const LocalStrategy = require("local-passport").Strategy;
const db = require("../db");

app.use(passport.initialize());
app.use(passport.session());

// Set method to serialize data to store in cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Set method to deserialize data stored in cookie and attach to req.user
passport.deserializeUser((id, done) => {
  db.customers(
    findById(id, function (err, user) {
      if (err) return done(err);
      done(null, user);
    })
  );
});

// Configure local strategy to be use for local login
// passport.use(
//   new LocalStrategy(function (username, password, done) {
//     db.customers.findByUsername({ email: username }, (err, user) => {
//       if (err) return done(err);

//       if (!user) return done(null, false);

//       if (user.password != password) return done(null, false);

//       return done(null, user);
//     });
//   })
// );
