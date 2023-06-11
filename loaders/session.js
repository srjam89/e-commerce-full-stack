const session = require("express-session");

app.use(
  session({
    secret: "***",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

module.exports = session;
