const express = require("express");
const apiRouter = express.Router();

const customers = require("./customers");

apiRouter.use("/customers", customers);

module.exports = apiRouter;
