USE employeeTracker_DB;

INSERT INTO department (department_name) VALUES

("Software Engineering"),
("Financial Modeling"),
("Customer Support"),
("Sales"),
("Marketing");

INSERT INTO roles (title, salary, department_id) VALUES 

("Python Engineer", 100000, 1),
("C++ Engineer", 150000, 1),
("Utilities Analyst", 95000, 2),
("Energy Analyst", 95000, 2),
("Help Desk Representative", 80000, 3),
("Customer Experience", 50000, 3),
("Outside Sales Representative", 100000, 4),
("Inside Sales Representative", 100000, 4),
("Social Media Coordinator", 60000, 5),
("Print Media Marketing", 60000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES

("Caroline", "Lynch", 1, null),
("Joe", "Jonas", 1, null),
("Nick", "Jonas", 2, null),
("Kevin", "Jonas", 2, null),
("Frankie", "Jonas", 3, null),
("Kathy", "Persaud", 3, 1),
("Demi", "Lovato", 4, 2), 
("Katy", "Perry", 4, 3),
("Justin", "Bieber", 5, 4),
("Gwen", "Stefani", 5, 5); 

