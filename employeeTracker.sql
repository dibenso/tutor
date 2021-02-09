DROP DATABASE IF EXISTS employeeTracker_DB;

CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE department (
id INT(1) AUTO_INCREMENT NOT NULL,
department_name VARCHAR(30) NULL,
PRIMARY KEY (id)
); 


CREATE TABLE roles (
id INT(1) AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NULL,
salary DECIMAL(10, 2) NULL,
department_id INT(10) NULL, 
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee ( 
id INT(1) AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NULL, 
last_name VARCHAR(30) NULL,
role_id INT(10) NOT NULL,
manager_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES roles(id)
); 