const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
require('dotenv').config();
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
    runApp();
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
            for (let r = 0; r < res.length, r++) {
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
                }

