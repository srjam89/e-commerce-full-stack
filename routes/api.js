const express = require("express");
const apiRouter = express.Router();

const customers = require("./customers");
const products = require("./products");
const cart = require("./cart");
const test = require("./test");

apiRouter.use("/customers", customers);
apiRouter.use("/products", products);
apiRouter.use("/cart", cart);
apiRouter.use("/test", test);

module.exports = apiRouter;
