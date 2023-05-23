const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const customers = require("./routes/customers");
const db = require("./db");

const app = express();
app.use(cors());
module.exports = app;
const port = 3000;

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

// app.get("/customers", customers.getCustomers);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
