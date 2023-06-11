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
      //   Switch case
      switch (request) {
        case 'Add a Department':
          newDept();
          break;
        case 'Add an Employee':
          newEmp();
          break;
        case 'Add a Role':
          newRole();
          break;
        case 'Update Employees Role':
          updateEmpRole();
          break;
        case 'View All Departments':
          viewDepts();
          break;
        case 'View All Employees':
          viewEmps();
          break;
        case 'View All Roles':
          viewRoles();
          break;

        default:
          break;
      }
    })
}

const newDept = async () => {
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

// add an employee
const newEmp = async () => {
  const [rows] = await db.promise().query('SELECT title, id FROM role', 'SELECT first_name last_name, id FROM employee')
  
  const organizedInfoTitle = rows.map(index => {
    return {
      name: index.title,
      value: index.id
    }
  })
  
  const organizedInfoManager = rows.map(index => {
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
      choices: organizedInfoTitle,
      name: 'newEmpRole'
    },
    {
      message: "Who is new employee's manager?",
      type: 'list',
      choices: organizedInfoManager,
      name: 'newEmpManager'
    }
  ]).then(answers => {
    const sqlQuery = `
    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`

    db.query(sqlQuery, [answers.newFirstName, answers.newLastName, answers.newEmpRole, answers.newEmpManager], (err, data) => {
      if (err) throw err;
      console.log('added a new employee! \n')

      chooseRequest()
    })
  })
}

// Add a role
const newRole = async () => {
  const [rows] = await db.promise().query('SELECT department_name, id FROM department')
  
  const organizedInfo = rows.map(index => {
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
      choices: organizedInfo,
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

// Update an employees role
const updateEmpRole = async () => {
  try {
    const res = await inquirer.prompt([
      {
        type: "list",
        name: "emp_id",
        message: "What is the Employee do you want to update?",
        choices: empArr,
        loop: false,
      },
      {
        type: "list",
        name: 'role_id',
        message: "What is the Employees Role?",
        choices: roleArr,
        loop: false,
      }
    ])

    const name = res;

    await db.query('UPDATE employee_role SET');
    console.log(`Update ${name.name} from the database`);
  } catch (error) {
    console.error(error);
  }
}

// View All Departments
const viewDepts = () => {
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

// View All Roles
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

// View All employees
const viewEmps = () => {
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
