const inquirer = require("inquirer");
const mysql = require("mysql");
require("dotenv").config();
let deptArr = [];
let roleArr = [];
let emplArr = [];
let managerArr = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.SECRET_KEY,
    database: "employeeTracker_DB",
  });
  
  const mainMenu = [
    {
        type: "list",
        name: "firstOptions",
        message: "Welcome to Employee Tracker App!",
        choices: [
            "add new employee",
            "add new role",
            "add new department",
            "view employees",
            "view departments",
            "view roles",
            "update employee roles",
        ],
    },
  ];

  connection.connect(function (err) {
    if (err) throw err;
    console.log("Employee Tracker connected");
    runApplication();
  });

  function runApplication() {
    inquirer.prompt(mainMenu).then((response) => {
        switch (response.firstChoice) {
            case "add new employee":
                employee();
                break;
            case "add new role":
                role();
                break;
            case "add new department":
                department();
                break;
            case "view employees":
                viewEmployees();
                break;
            case "view employees by role":
                viewByRole();
                break;
            case "view employees by department":
                viewByDepartment();
                break;
            case "view all roles":
                viewRoles();
                break;
            case "view all departments":
                viewDepartments();
                break;
            case "update employee role":
                updateEmployee();
                break;
        }
});

getDepts();
getRoles();
getManagers();
  }

function getDepts() {
    connection.query("SELECT department_name FROM department", function (
        err,
        departments
    ) {
        if (err) throw err;
        deptArr = [];
        for (i = 0; i < departments.length; i++){
            deptArr.push(departments[i].department_name);
        }
    });
}

function getRoles() {
    connection.query("SELECT title FROM roles", function (err, roles) {
        if (err) throw err;
        roleArr = [];
        for (i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }
    });
}

function getManagers() {
    connection.query("SELECT employee.last_name FROM employee", function ( 
        err, managers) {
        if (err) throw err;
        emplArr = [];
        for (i = 0; i < managers.length; i++) {
            managerArr.push(managers[i].last_name);
        }
    });
}

//add new employee from menu selection! 

function employee () {
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
    connection.query ("SELECT * FROM employee", function (err, res2) {
        if (err) throw err;
        inquirer.prompt([
            {
            name: "first_name",
            type: "input",
            message: "employee's first name:",
            },
            {
            name: "last_name",
            type: "input",
            message: "employee's last name:",
            },
            {
            name: "roleName",
            type: "list",
            message: "employee's role:",
            choices: roleArr,
            },
            {
                name: "managerName",
                type: "list",
                message: "name of employee's manager:",
                choices: managerArr,
            },
        ])
        .then(function (answer) {
            let roleID;
            for (let r = 0; r < res.length; r++) {
                if (res[r].title == answer.roleName) { roleID = res[r].role_id;}
            }
            let managerID;
            for (let m = 0; m < res2.length; m++) {
                if (res2[m].last_name == answer.managerName) {
                    managerID = res2[m].employee_id;

                }
            }

            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: roleID,
                    manager_id: managerID,
                }, 
                function (err) {
                    if (err) throw err;
                }
            );
            runApplication();
        });
    });
});

//add a new role 

function role () {
connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    inquirer   
        .prompt([
            {
                name: "title",
                type: "input",
                message: "what is the role title?",
            },
            {
                name: "salary",
                type: "input",
                message: "what is the salary for this role?",
            },
            {
                name: "departmentName",
                type: "list",
                choices: deptArr,
            },
        ])
        .then(function (answer) {
            let deptID;
            for (let d = 0; d < res.length; d++) {
                if (res[d].department_name == answer.departmentName) {
                deptID = res[d].department_id;
                }
            }
        connection.query(
            "INSERT INTO roles SET ?",
            {
                title: answer.title,
                salary: answer.salary,
                department_id: deptID,
            },
            function (err) {
                if (err) throw err;
            }
        );
        runApplication()
        });
    });
}

//add a new department 

function department() {
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "department name:",
            },
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                   department_name: answer.department 
                },
                function (err) {
                    if (err) throw err;
                }
            );
        runApplication();
    });
}

//employees by department 

function viewByDepartment() {
    connection.query(
        'SELECT employee.employee_id, employee.first_name, employee.last_name department.department_name FROM employee 
        LEFT JOIN role ON employee.role_id = roles.role_id
        LEFT JOIN department ON role.department_id = department.department_id 
        ORDER BY department.department_name',
            function (err, data) {
                if (err) throw err;
                console.table(data);
                runApplication();
            }
        );
    }


//employees by role 

function viewByRole() {
    connection.query(
        'SELECT employee.employee_id, employee.employee_id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name FROM employee
        LEFT JOIN role ON employee.role_id = role.role_id
        LEFT JOIN department ON role.department_id = department.department_id 
        ORDER BY role.title',
        function (err, data) {
            if (err, data) throw err;
            console.table(data);
            runApplication();
        }
    );
}

//all roles 

function viewRoles() {
    connection.query("SELECT * FROM roles", function(err,data) {
        if (err) throw err;
        console.table(data);
        runApplication();
    });
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        if (err) throw err;
        console.table(data);
        runApplication();
    });
}

function viewEmployees() {
    connection.query(
        'SELECT employee.employee_id, employee.first_name, employee.last_name, role.title,
        department.department_name AS department,role.salary,CONCAT(a.first_name, " ", a.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.role_id
        LEFT JOIN department ON role.department_id = department.department_id
        LEFT JOIN employee a ON a.employee_id = employee.manager_id',
        function (err, data) {
            if (err) throw err;
            console.table(data);
            runApplication();
        }
    );
}

function updateEmployee () {
    connection.query( 
        `SELECT concat(employee.first_name, ' ' ,  employee.last_name) AS Name FROM employee`,
        function (err, employees) {
            if (err) throw err;
            emplArr = [];
            for (i = 0; i <employees.length; i++) {
                emplArr.push(employees[i].Name);
            }
            connection.query("SELECT * FROM roles", function (err, res2) {
                if (err) throw err;
                inquirer
                    .prompt([
                        {
                            name: "employeeChoice",
                            type: "list",
                            message: "which employee to update?",
                            choices: emplArr,
                        },
                        {
                            name: "roleChoice",
                            type: "list",
                            message: "what is employees updated role?",
                            choices: roleArr,
                        },
                    ])
                    .then(function(answer) {
                        let roleID;
                        for(let r = 0; r < res2.length; r++) { if (res2[r].title == answer.roleChoice) { roleID = res2[r].role_id;
                        }
                    }
                    connection.query(
                        "UPDATE employee SET role_id = ?WHERE employee_id = (SELECT employee_id FROM(SELECT employee_id FROM employee WHERE CONCAT(first_name," ",last_name) = ?)AS NAME)",
                        [roleID, answer.employeeChoice],
                        function (err) {
                            if (err) throw err;
                        }
                    );
                runApplication();
                });
            });
        }
    );
}






