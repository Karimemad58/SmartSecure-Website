const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smartsecure"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("MySQL connected");
});

module.exports = db;