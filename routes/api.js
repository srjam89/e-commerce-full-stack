const express = require("express");
const apiRouter = express.Router();

const customers = require("./customers");
const products = require("./products");

apiRouter.use("/customers", customers);
apiRouter.use("/products", products);

module.exports = apiRouter;
