const inquirer = require("inquirer");
const db = require('./db/connect');

const chooseRequest = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'request',
      message: 'What would you like to do?',
      choices: ['Add a Department',
        'Add an Employee',
        'Add a Role',
        'Delete an Employee', // Bonus
        'Update Employees Role',
        'Update Employees Manager', // Bonus 
        'View All Departments',
        'View All Employees',
        'View All Roles',
        'View Department Budget', // Bonus
        'View Employees by Department', // Bonus
        'View Employees by Manager' // Bonus
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
        case 'Delete an Employee':
          delEmp();
          break;
        case 'Update Employees Role':
          updateEmpRole();
          break;
        case 'Update Employees Manager':
          updateEmpManager();
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
        case 'View Department Budget':
          viewBudgets();
          break;
        case 'View Employees by Department':
          viewEmpByDept();
          break;
        case 'View Employees by Manager':
          viewEmpByMgr();
          break;

        default:
          break;
      }
    })
}

const newDept = async () => {
  try {
    const res = await inquirer.prompt([
      {
        name: "name",
        message: "What is the name of the department?",
        validate: (name) => {
          if (name) {
            return true;
          } else {
            console.log("Please Enter a Department Name")
            return false;
          }
        },
      },
    ]);

    const name = res;

    await db.query("INSERT INTO department SET ?");
    console.log(`Added ${name.name} to the database`);

    await chooseRequest();
  } catch (error) {
    console.error(error);
  }
}

// add an employee
const newEmp = async () => {
  try {
    const res = await inquirer.prompt([
      {
        type: "input",
        name: "first",
        message: "What is First Name of new Employee?",
        validate: (first) => {
          if (first && isNaN(first)) {
            return true;
          } else {
            console.log("Please Enter a First Name")
            return false;
          }
        },
      },
      {
        type: "input",
        name: "last",
        message: "What is Last Name of new Employee?",
        validate: (last) => {
          if (last && isNaN(last)) {
            return true;
          } else {
            console.log("Please Enter a Last Name")
            return false;
          }
        },
      },
      {
        type: "list",
        name: 'role_id',
        message: "What is the Employees Role?",
        choices: roleArr,
        loop: false,
      },
      {
        type: "list",
        name: 'manager_id',
        message: "Who is the Employees Manager?",
        choices: mgmtArr,
        loop: false,
      }
    ])

    const name = res;

    await db.query('INSERT INTO employee SET?');
    console.log(`Added ${name.name} to the database`);

    await chooseRequest();
  } catch (error) {
    console.error(error);
  }
}

// Add a role
const newRole = async () => {
  try {
    const res = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of new Role?",
        validate: (title) => {
          if (title) {
            return true;
          } else {
            console.log("Please Enter Role Name")
            return false;
          }
        },
      },
      {
        type: "input",
        name: 'salary',
        message: "What is the Salary of Role?",
        validate: (salary) => {
          if (salary && !isNaN(salary)) {
            return true;
          } else {
            console.log("Please Enter Role Salary");
          }
        }
      },
      {
        type: "list",
        name: 'department_id',
        message: "What Department is the Role associated with?",
        choices: choicesArr,
        loop: false,
      }
    ])

    const name = res;

    await db.query('INSERT INTO role SET?');
    console.log(`Added ${name.name} to the database`);

    await chooseRequest();
  } catch (error) {
    console.error(error);
  }
}

// Delete and Employee
// Bonus Objective
const delEmp = async () => {
  try {
    const res = await inquirer.prompt([
      {
        type: "list",
        name: "emp_id",
        message: "What Employee do you want to Delete?",
        choices: empArr,
        loop: false,
      }
    ])

    const name = res;

    await db.query('DELETE FROM employee SET');
    console.log(`Deleted ${name.name} from the database`);
  } catch (error) {
    console.error(error);
  }
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

// Update an employees Manager
// Bonus Objective
const updateEmpManager = async () => {
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
        name: 'manager_id',
        message: "Who is the Employees Manager?",
        choices: mgmtArr,
        loop: false,
      }
    ])

    const name = res;

    await db.query('UPDATE employee_manager SET');
    console.log(`Update ${name.name} from the database`);
  } catch (error) {
    console.error(error);
  }
}

// View All Departments
const viewDepts = () => {
  sql.getDepts()

    .then(([rows]) => {
      console.log('\n');
      console.log(cTable.getTable(rows));
    })

    .then(() => {
      chooseRequest();
    })
}

// View All Roles
const viewRoles = () => {
  sql.getRoles()

    .then(([rows]) => {
      console.log('\n');
      console.log(cTable.getTable(rows));
    })

    .then(() => {
      chooseRequest();
    })
}
// View All employees
const viewEmps = () => {
  sql.getEmps()

    .then(([rows]) => {
      console.log('\n');
      console.log(cTable.getTable(rows));
    })

    .then(() => {
      chooseRequest();
    })
}

// View All Departments and their Budget 
// Bonus Objective
const viewBudgets = async () => {

  sql.getBudgetByDept()

    .then(([rows]) => {
      console.log('\n');
      console.log(cTable.getTable(rows));
    })

    .then(() => {
      chooseRequest();
    })
}

// View All Employees in a specific Department
// Bonus Objective
const viewEmpByDept = async () => {

  const deptArr = await cHelper.deptChoices();

  inquirer.prompt([
    {
      type: "list",
      name: "dept_id",
      message: "What is the Department do you want to view Employees for?",
      choices: deptArr,
      loop: false
    }
  ])

    .then((data) => {
      sql.getEmpByDeptId(data)
        .then(([rows]) => {
          console.log('\n');
          console.log(cTable.getTable(rows))
          chooseRequest();
        })
    })

}

// View All Employees who report to a specific Manager
// Bonus Objective
const viewEmpByMgr = async () => {

  const mgmtArr = await cHelper.mgmtChoices();

  inquirer.prompt([
    {
      type: "list",
      name: "manager_id",
      message: "Which Manager do you want to view Employees for?",
      choices: mgmtArr,
      loop: false
    }
  ])

    .then((data) => {
      sql.getEmpByMgrId(data)
        .then(([rows]) => {
          console.log('\n');
          console.log(cTable.getTable(rows))
          chooseRequest();
        })
    })

}



chooseRequest();
