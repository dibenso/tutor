DROP DATABASE IF EXISTS employeeTracker_DB;

CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE department (
department_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
department_name VARCHAR(30) NOT NULL
); 


CREATE TABLE roles (
role_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
title VARCHAR(30) NULL,
salary DECIMAL NULL,
department_id INT(10) NULL, 
FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE
);

CREATE TABLE employee ( 
employee_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL, 
last_name VARCHAR(30) NOT NULL,
role_id INT(10) NULL,
manager_id INT,
FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
FOREIGN KEY(manager_id) REFERENCES employee(employee_id) ON DELETE CASCADE
); 