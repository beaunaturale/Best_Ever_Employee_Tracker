const inquirer = require("inquirer");
const db = require('./db/connect');

const chooseRequest = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'request',
      message: 'What would you like to do?',
      choices: [
        'Add a Department',
        'Add an Employee',
        'Add a Role',
        'Update Employees Role',
        'View All Departments',
        'View All Employees',
        'View All Roles',
      ],
      loop: false,
    },
  ])

    .then((data) => {
      const { request } = data;
      console.log(request);
      switch (request) {
        case 'Add a Department':
          newDepartment();
          break;
        case 'Add an Employee':
          newEmployee();
          break;
        case 'Add a Role':
          newRole();
          break;
        case 'Update Employees Role':
          updateEmployeeRole();
          break;
        case 'View All Departments':
          viewDepartments();
          break;
        case 'View All Employees':
          viewEmployees();
          break;
        case 'View All Roles':
          viewRoles();
          break;

        default:
          break;
      }
    })
}

const newDepartment = async () => {
  inquirer.prompt([
    {
      message: "What is the name of the new Department?",
      type: 'input',
      name: 'newDept'
    }
  ]).then(answers => {
    const sqlQuery = `
    INSERT INTO department (department_name)
    VALUES (?)`

    db.query(sqlQuery, [answers.newDept], (err, data) => {
      if (err) throw err;
      console.log('added a new department! \n')

      chooseRequest()
    })
  })
}

const newEmployee = async () => {
  const [titleRows] = await db.promise().query('SELECT title, id FROM role')

  const organizedTitleInfo = titleRows.map(index => {
    return {
      name: index.title,
      value: index.id
    }
  })
  const [managerRows] = await db.promise().query('SELECT CONCAT_WS(" ", first_name, last_name) AS manager, id FROM employee')

  const organizedManagerInfo = managerRows.map(index => {
    return {
      name: index.manager,
      value: index.id
    }
  })

  inquirer.prompt([
    {
      message: "What is new employee's first name?",
      type: 'input',
      name: 'newFirstName'
    },
    {
      message: "What is new employee's last name?",
      type: 'input',
      name: 'newLastName'
    },
    {
      message: "What is new employee's role?",
      type: 'list',
      choices: organizedTitleInfo,
      name: 'newEmpRole'
    },
    {
      message: "Who is new employee's manager?",
      type: 'list',
      choices: organizedManagerInfo,
      name: 'newEmpManager'
    }
  ]).then(answers => {
    const sqlQuery = `
    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`

    db.query(sqlQuery, [answers.newFirstName, answers.newLastName, answers.newEmpRole, answers.newEmpManager], (err, data) => {
      if (err) throw err;
      console.log(data, 'added a new employee! \n')

      chooseRequest()
    })
  })
}

const newRole = async () => {
  const [titleRows] = await db.promise().query('SELECT department_name, id FROM department')

  const organizedTitleInfo = titleRows.map(index => {
    return {
      name: index.department_name,
      value: index.id
    }
  })
  inquirer.prompt([
    {
      message: "What is new role title?",
      type: 'input',
      name: 'newRole'
    },
    {
      message: "What is new role salary?",
      type: 'input',
      name: 'newSalary'
    },
    {
      message: 'department_id?',
      type: 'list',
      choices: organizedTitleInfo,
      name: 'newDeptId'
    }
  ]).then(answers => {
    const sqlQuery = `
    INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`

    db.query(sqlQuery, [answers.newRole, answers.newSalary, answers.newDeptId], (err, data) => {
      if (err) throw err;
      console.log('added a new role! \n')

      chooseRequest()
    })
  })
}

const updateEmployeeRole = async () => {
  const [employeeRows] = await db.promise().query('SELECT CONCAT_WS(" ", first_name, last_name) AS employee, id FROM employee')

  const organizedEmployeeInfo = employeeRows.map(index => {
    return {
      name: index.employee,
      value: index.id
    }
  })
  const [titleRows] = await db.promise().query('SELECT title, id FROM role')

  const organizedRoleInfo = titleRows.map(index => {
    return {
      name: index.title,
      value: index.id
    }
  })

  inquirer.prompt([
    {
      message: "What is the Employee do you want to update?",
      type: "list",
      choices: organizedEmployeeInfo,
      name: "emp_id",
      loop: false,
    },
    {
      message: "What is the Employees Role?",
      type: "list",
      choices: organizedRoleInfo,
      name: 'role_id',
      loop: false,
    }
  ]).then(answers => {
    const sqlQuery = `
        UPDATE employee 
        Set role_id = ?
        WHERE id = ?`

    db.query(sqlQuery, [answers.role_id, answers.emp_id], (err, data) => {
      if (err) throw err;
      console.log('Updated employee role! \n')

      chooseRequest()
    })
  })
}

const viewDepartments = () => {
  const sqlQuery = `
  SELECT *
  FROM department`

  db.query(sqlQuery, (err, data) => {
    if (err) throw err;
    console.table(data);
    console.log("\n");

    chooseRequest()
  })
}

const viewRoles = () => {
  const sqlQuery = `
  SELECT role.id, title, salary, department_name
  FROM role
  JOIN department
  ON department_id = department.id`

  db.query(sqlQuery, (err, data) => {
    if (err) throw err;
    console.table(data);
    console.log("\n");

    chooseRequest()
  })
}

const viewEmployees = () => {
  const sqlQuery = `
  SELECT employee.id, first_name, last_name, title, salary, manager_id
  FROM employee
  JOIN role
  ON role_id = role.id`

  db.query(sqlQuery, (err, data) => {
    if (err) throw err;
    console.table(data);
    console.log("\n");

    chooseRequest()
  })
}

chooseRequest();
