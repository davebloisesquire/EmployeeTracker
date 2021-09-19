const inq = require('inquirer');
const db = require('./configs/connection.js');

// Query database
db.query('SELECT * FROM employee', function (err, results) {
  console.log(results);
});
