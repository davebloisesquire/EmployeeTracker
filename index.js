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
  let managerObj;
  let roleObj;
  let roleOptions = [];
  let managerOptions = ["None"];

  db.query('SELECT id, title FROM role', function(err, results) {
    roleObj = results;
    for (var i = 0; i < results.length; i++) {
      roleOptions.push(results[i].title);
    }
  });

  db.query('SELECT id, first_name FROM employee WHERE role_id=2', function(err, results) {
    managerObj = results;
    for (var i = 0; i < results.length; i++) {
      managerOptions.push(results[i].first_name);
    }
  });

  inq.prompt([{
      type: 'input',
      message: 'Employee First Name',
      name: 'employeeFirstName'
    },
    {
      type: 'input',
      message: 'Employee Last Name',
      name: 'employeeLastName'
    },
    {
      type: 'list',
      message: 'Employee Role',
      name: 'employeeRole',
      choices: roleOptions
    },
    {
      type: 'list',
      message: 'Employee Manager',
      name: 'employeeManager',
      choices: managerOptions
    },
  ]).then(response => {
    let managerId = null;
    const roleId = roleObj.find(({
      title
    }) => title === response.employeeRole).id;
    if (response.employeeManager !== 'None') {
      managerId = managerObj.find(({
        first_name
      }) => first_name === response.employeeManager).id;
    }
    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.employeeFirstName, response.employeeLastName, roleId, managerId], function(err, results) {
      if (err) throw err;
      console.log("New employee added");
    });
    startMenu();
  })
};

function updateEmployeeRole() {

};

function updateEmployeeManager() {

};

function addRole() {
  let deptObj;
  let deptOptions = [];

  db.query('SELECT id, name FROM department', function(err, results) {
    deptObj = results;
    for (var i = 0; i < results.length; i++) {
      deptOptions.push(results[i].name);
    }
  });

  inq.prompt([{
      type: 'input',
      message: 'What\'s the new role?',
      name: 'newRole'
    },
    {
      type: 'input',
      message: 'What\'s the salary for this new role?',
      name: 'newSalary'
    },
    {
      type: 'list',
      message: 'What department is this new role in?',
      name: 'newRoleDepartment',
      choices: deptOptions
    }
  ]).then(response => {
    const deptId = deptObj.find(({
      name
    }) => name === response.newRoleDepartment).id;
    db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [response.newRole, response.newSalary, deptId], function(err, results) {
      if (err) throw err;
      console.log("New role added");
    });
    startMenu();
  })
};

function addDepartment() {
  inq.prompt([{
    type: 'input',
    message: 'What\'s the new department?',
    name: 'newDept'
  }, ]).then(response => {
    db.query('INSERT INTO department (name) VALUES (?)', [response.newDept], function(err, results) {
      if (err) throw err;
      console.log("New department added");
    });
    startMenu();
  })
};

startMenu();
