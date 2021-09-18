INSERT INTO department (name)
VALUES  ("Accounting"),
        ("Management"),
        ("Custodial");

INSERT INTO role (title, salary, department_id)
VALUES  ("Accountant", 70000, 1),
        ("Manager", 100000, 2),
        ("CPA", 80000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Dave", "Blois", 2),
        ("Mike", "Smith", 1, 1);
