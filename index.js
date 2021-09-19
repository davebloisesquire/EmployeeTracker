// External Dependencies
const inq = require('inquirer');
const cTable = require('console.table');

// Internal Dependencies
const db = require('./configs/connection.js');

function startMenu() {
  inq.prompt([{
    type: 'list',
    name: 'startMenu',
    message: 'What would you like to do?',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
  }]).then(response => {
    switch (response.startMenu) {
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Update Employee Manager':
        updateEmployeeManager();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Quit':
        process.exit();
    }
  })
};

function viewAllEmployees() {
  db.query('SELECT e.first_name, e.last_name, role.title, role.salary, department.name AS department, m.first_name AS manager FROM employee AS e JOIN role ON e.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS m ON e.manager_id=m.id;', function(err, results) {
    const dataTable = cTable.getTable(results);
    console.log("\n" + dataTable);
  });
  startMenu();
}

function viewAllRoles() {
  db.query('SELECT role.title, role.id, department.name as department, role.salary FROM role JOIN department ON role.department_id=department.id', function(err, results) {
    const dataTable = cTable.getTable(results);
    console.log("\n" + dataTable);
  });
  startMenu();
}

function viewAllDepartments() {
  db.query('SELECT * FROM department', function(err, results) {
    const dataTable = cTable.getTable(results);
    console.log("\n" + dataTable);
  });
  startMenu();
}

function addEmployee() {

};

function updateEmployeeRole() {

};

function updateEmployeeManager() {

};

function addRole() {

};

function viewAllDepartments() {

};

function addDepartment() {

};

startMenu();
