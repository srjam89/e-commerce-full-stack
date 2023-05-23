const Pool = require("pg").Pool;
const pool = new Pool({
  host: "localhost",
  database: "e_commerce",
  port: 5432,
});

module.exports = pool;
