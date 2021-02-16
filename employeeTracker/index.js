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
            "view all employees",
            "view employees by manager",
            "view all departments",
            "view department budget",
            "view all roles",
            "update employee roles",
            "update employee managers",
            "delete department",
            "delete role",
            "delete employee"
        ],
    },
  ];

  connection.connect(function (err) {
    if (err) throw err;
    console.log("Employee Tracker connected");
    runApplication();
  });

  function viewEmployees() {
    connection.query(
        'SELECT employee.employee_id, employee.first_name, employee.last_name, title, department.department_name AS department,salary,CONCAT(a.first_name, " ", a.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.role_id LEFT JOIN department ON roles.department_id = department.department_id LEFT JOIN employee a ON a.employee_id = employee.manager_id',
        function (err, data) {
            if (err) throw err;
            console.table(data);
            runApplication();
        }
    );
}

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
                            for(let r = 0; r < res2.length; r++) {
                                if (res2[r].title == answer.roleChoice) {
                                    roleID = res2[r].role_id;
                                }
                            }

                            connection.query(
                                "UPDATE employee SET role_id = ? WHERE employee_id = (SELECT employee_id FROM(SELECT employee_id FROM employee WHERE CONCAT(first_name,' ',last_name) = ?)AS NAME)",
                                [roleID, answer.employeeChoice],
                                function (err) {
                                    if (err) throw err;
                                }
                            );
                            runApplication();
                        });
                });
            })
        }

  function runApplication() {
    inquirer.prompt(mainMenu).then((response) => {
        switch (response.firstOptions) {
            case "add new employee":
                employee();
                break;
            case "add new role":
                role();
                break;
            case "add new department":
                department();
                break;
            case "view all employees":
                viewEmployees();
                break;
            case "view employees by manager":
                viewEmployeesByManager();
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
            case "view department budget":
                viewDepartmentBudget();
                break;
            case "update employee roles":
                updateEmployee();
                break;
            case "update employee managers":
                updateEmployeeManager();
                break;
            case "delete department":
                deleteDepartment();
                break;
            case "delete role":
                deleteRole();
                break;
            case "delete employee":
                deleteEmployee();
                break;
        }
    });

    getDepts();
    getRoles();
    getManagers();
}

function viewDepartmentBudget() {
    connection.query("SELECT * FROM department", function(err, departments) {
        if(err) throw err;
        let deptArr = [];
        for(let i = 0; i < departments.length; i++) {
            deptArr.push(departments[i].department_name)
        }

        inquirer.prompt([
            {
                name: "departmentChoice",
                type: "list",
                message: "which department would you like to delete?",
                choices: deptArr
            }
        ]).then(function(answer) {
            let department;
                for(let i = 0; i < departments.length; i++) {
                    if(departments[i].department_name == answer.departmentChoice) {
                        department = departments[i]
                    }
                }

                connection.query("SELECT SUM(roles.salary) AS salary FROM roles WHERE roles.department_id = ?", [department.department_id], function(err, combined) {
                    if(err) throw err;
                    console.log(`budget for ${department.department_name} department is ${combined[0].salary}`);
                    runApplication();
                })
        })
    })
}

function deleteDepartment() {
    connection.query("SELECT * FROM department", function(err, departments) {
        if(err) throw err;
        let deptArr = [];
        for(let i = 0; i < departments.length; i++) {
            deptArr.push(departments[i].department_name)
        }

        inquirer.prompt([
            {
                name: "departmentChoice",
                type: "list",
                message: "which department would you like to delete?",
                choices: deptArr
            }
        ]).then(function(answer) {
            let department;
                for(let i = 0; i < departments.length; i++) {
                    if(departments[i].department_name == answer.departmentChoice) {
                        department = departments[i]
                    }
                }

                connection.query("DELETE FROM department WHERE department_id = ?", [department.department_id], function(err) {
                    if(err) throw err;
                    console.log("department (and roles that depend on it) deleted");
                    runApplication();
                })
        })
    })
}

function deleteRole() {
    connection.query("SELECT * FROM roles", function(err, roles) {
        if(err) throw err;
        let roleArr = [];
        for(let i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title)
        }

        inquirer.prompt([
            {
                name: "roleChoice",
                type: "list",
                message: "which role would you like to delete?",
                choices: roleArr
            }
        ]).then(function(answer) {
            let role;
                for(let i = 0; i < roles.length; i++) {
                    if(roles[i].title == answer.roleChoice) {
                        role = roles[i]
                    }
                }

                connection.query("DELETE FROM roles WHERE role_id = ?", [role.role_id], function(err) {
                    if(err) throw err;
                    console.log("role (and employees that depend on it) deleted");
                    runApplication();
                })
        })
    })
}

function deleteEmployee() {
    connection.query("SELECT employee_id, concat(employee.first_name, ' ' ,  employee.last_name) AS Name FROM employee", function(err, employees) {
        if(err) throw err;
        let emplArr = [];
        for(let i = 0; i < employees.length; i++) {
            emplArr.push(employees[i].Name)
        }

        inquirer.prompt([
            {
                name: "employeeChoice",
                type: "list",
                message: "which employee would you like to delete?",
                choices: emplArr
            }
        ]).then(function(answer) {
            let employee;
                for(let i = 0; i < employees.length; i++) {
                    if(employees[i].Name == answer.employeeChoice) {
                        employee = employees[i]
                    }
                }

                connection.query("DELETE FROM employee WHERE employee_id = ?", [employee.employee_id], function(err) {
                    if(err) throw err;
                    console.log("employee deleted");
                    runApplication();
                })
        })
    })
}

function viewEmployeesByManager() {
    connection.query(
        "SELECT employee_id, concat(employee.first_name, ' ', employee.last_name) AS Name FROM employee",
        function(err, managers) {
            if(err) throw err;
            empArr = [];
            for(let i = 0; i < managers.length; i++) {
                emplArr.push(managers[i].Name);
            }
            inquirer.prompt([
                {
                    name: "managerChoice",
                    type: "list",
                    message: "which manager would you like to see the employees of?",
                    choices: emplArr
                }
            ]).then(function(answer) {
                let manager;
                for(let i = 0; i < managers.length; i++) {
                    if(managers[i].Name == answer.managerChoice) {
                        manager = managers[i]
                    }
                }

                connection.query("SELECT * FROM employee WHERE manager_id = ?", [manager.employee_id], function(err, employees) {
                    if(err) throw err;
                    console.table(employees);
                    runApplication();
                })
            })
        }
    )
}

function updateEmployeeManager() {
    connection.query( 
        `SELECT employee_id, concat(employee.first_name, ' ' ,  employee.last_name) AS Name FROM employee`,
        function(err, employees) {
            emplArr = [];
            for (let i = 0; i <employees.length; i++) {
                emplArr.push(employees[i].Name);
            }
            inquirer.prompt([
                {
                    name: "employeeChoice",
                    type: "list",
                    message: "which employee to update?",
                    choices: emplArr,
                },
                {
                    name: "managerChoice",
                    type: "list",
                    message: "who is employees manager?",
                    choices: emplArr,
                }
            ]).then(function(answer) {
                let employee;
                let manager;
                for(let i = 0; i < employees.length; i++) {
                    if (employees[i].Name == answer.employeeChoice) {
                        employee = employees[i];
                    }
                    if(employees[i].Name == answer.managerChoice) {
                        manager = employees[i];
                    }
                }

                connection.query(
                    "UPDATE employee SET manager_id = ? WHERE employee_id = ?",
                    [manager.employee_id, employee.employee_id],
                    function (err) {
                        if (err) throw err;
                        console.log('employee updated');
                    }
                );
                
                runApplication()
            })
        }
    );
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
}

//employees by department 

function viewByDepartment() {
    connection.query(
        'SELECT employee.employee_id, employee.first_name, employee.last_name department.department_name FROM employee LEFT JOIN role ON employee.role_id = roles.role_id LEFT JOIN department ON role.department_id = department.department_id ORDER BY department.department_name',
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
        'SELECT employee.employee_id, employee.employee_id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN department ON role.department_id = department.department_id ORDER BY role.title',
        function (err, data) {
            if (err, data) throw err;
            console.table(data);
            runApplication();
        }
    );
}