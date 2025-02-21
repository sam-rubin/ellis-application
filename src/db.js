const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost", // Change this to your MySQL host
  user: "root", // Change this to your MySQL username
  password: "password", // Change this to your MySQL password
  database: "learn", // Change this to your database name
  waitForConnections: true,
  connectionLimit: 5, // Max connections
  queueLimit: 0,
});

module.exports = pool;
