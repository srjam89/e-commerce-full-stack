const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const customers = require("./routes/customers");
const db = require("./db");
const app = express();

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

app.use(cors());
module.exports = app;
const port = 3000;
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node, Express, Postgress API" });
});

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
