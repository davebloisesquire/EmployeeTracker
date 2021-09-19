require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    // host: 'localhost',
    // user: 'root',
    // password: 'FunnyPeople2008!',
    // database: 'employee_tracker_db'
  },
  console.log("Connected to the employee_tracker_db database.")
);

db.query('SELECT * FROM employee', function (err, results) {
  console.log(JSON.stringify(results));
});

module.exports = db;
