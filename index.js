// External Dependencies
const inq = require('inquirer');
const cTable = require('console.table');

// Internal Dependencies
const db = require('./configs/connection.js');

// This brings up the main menu to choose what operation the user would like to perform
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

// - - - These Are All the Operations that can be performed by the apllication - - - //
// Allows the user to view all employees
function viewAllEmployees() {
  // Queries a list of all the employees in the database and joins them to their roles and departments and managers
  db.query('SELECT e.first_name, e.last_name, role.title, role.salary, department.name AS department, m.first_name AS manager FROM employee AS e JOIN role ON e.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS m ON e.manager_id=m.id;', function(err, results) {
    //displays results as a table in the console
    const dataTable = cTable.getTable(results);
    console.log("\n" + dataTable);
  });
  //initializes the start menu once operation is complete
  startMenu();
}

// Allows the user to view all roles within the database
function viewAllRoles() {
  db.query('SELECT role.title, role.id, department.name as department, role.salary FROM role JOIN department ON role.department_id=department.id', function(err, results) {
    const dataTable = cTable.getTable(results);
    console.log("\n" + dataTable);
  });
  startMenu();
}

// Allows the user to view all departments within the database
function viewAllDepartments() {
  db.query('SELECT * FROM department', function(err, results) {
    const dataTable = cTable.getTable(results);
    console.log("\n" + dataTable);
  });
  startMenu();
}

// Allows the user to add a new employee to the database and assign them a role and a manager
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
  console.log(roleOptions);

  db.query('SELECT id, first_name FROM employee WHERE role_id=1', function(err, results) {
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

// Allows the user to change an employees existing role
function updateEmployeeRole() {
  const employeeObj = [];
  var roleObj;
  const roleOptions = [];
  const employeeOptions = [];

  db.query('SELECT id, first_name, last_name FROM employee;', function(err, results) {
    results.forEach(employee => {
      let fullName = employee.first_name + " " + employee.last_name;
      let newEmployeeObj = {};
      newEmployeeObj.id = employee.id;
      newEmployeeObj.fullName = fullName;
      employeeObj.push(newEmployeeObj);
      employeeOptions.push(fullName);
    });

    db.query('SELECT id, title FROM role;', function(err, results) {
      roleObj = results;
      for (var i = 0; i < results.length; i++) {
        roleOptions.push(results[i].title);
      }
    });

    inq.prompt([{
        type: 'list',
        message: 'Employee',
        name: 'employeeManager',
        choices: employeeOptions
      },
      {
        type: 'list',
        message: 'Employee Role',
        name: 'employeeRole',
        choices: roleOptions
      },
    ]).then(response => {
      const roleId = roleObj.find(({title}) => title === response.employeeRole).id;
      const employeeId = employeeObj.find(({fullName}) => fullName === response.employeeManager).id;
      db.query('UPDATE employee SET role_id=? WHERE id=?', [roleId, employeeId], function(err, results) {
        if (err) throw err;
        console.log("Updated  ");
        startMenu();
      });

    });
  });
};

// Allows the user to change an employees current manager
function updateEmployeeManager() {
  const employeeObj = [];
  var managerObj;
  const managerOptions = [];
  const employeeOptions = [];

  db.query('SELECT id, first_name, last_name FROM employee;', function(err, results) {
    results.forEach(employee => {
      let fullName = employee.first_name + " " + employee.last_name;
      let newEmployeeObj = {};
      newEmployeeObj.id = employee.id;
      newEmployeeObj.fullName = fullName;
      employeeObj.push(newEmployeeObj);
      employeeOptions.push(fullName);
    });

    db.query('SELECT id, first_name FROM employee WHERE role_id=1', function(err, results) {
      managerObj = results;
      for (var i = 0; i < results.length; i++) {
        managerOptions.push(results[i].first_name);
      }
    });

    inq.prompt([{
        type: 'list',
        message: 'Employee',
        name: 'employeeUpdate',
        choices: employeeOptions
      },
      {
        type: 'list',
        message: 'Employee Manager',
        name: 'employeeManager',
        choices: managerOptions
      },
    ]).then(response => {
      let managerId = null;
      if (response.employeeManager !== 'None') {
        managerId = managerObj.find(({first_name}) => first_name === response.employeeManager).id;
      }
      const employeeId = employeeObj.find(({fullName}) => fullName === response.employeeUpdate).id;
      db.query('UPDATE employee SET manager_id=? WHERE id=?', [managerId, employeeId], function(err, results) {
        if (err) throw err;
        console.log("Updated  ");
        startMenu();
      });

    });
  });
};

// Allows the user to add a new role and assign it to a department in the database
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

// Allows teh user to create a new department in teh database
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

// Initializes the start menu
startMenu();
