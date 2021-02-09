const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
require('dotenv').config();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.SECRET_KEY,
    database: "employeeTracker_DB",
  });
  
  connection.connect(function (err) {
    if (err) throw err;
    runApplication();
  });

  function runApplication () {
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "\n Welcome to Employee Tracker App! \n",
            choices: [
                "add new department",
                "add new role",
                "add new employee",
                "view department",
                "view role",
                "view employee",
                "update employee role",],
            })
       
  }
