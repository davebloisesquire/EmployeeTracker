INSERT INTO department (name)
VALUES  ("Management"),
        ("Accounting"),
        ("Saving"),
        ("Custodial"),
        ("Music");

INSERT INTO role (title, salary, department_id)
VALUES  ("Manager", 170000, 1),
        ("Accountant", 70000, 2),
        ("Super-Hero", 70000, 3),
        ("Singer-Songwriter", 5000, 4),
        ("CPA", 80000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Dave", "Blois", 1, null),
        ("Mike", "Smith", 1, null),
        ("Patty", "Sanders", 2, null),
        ("Adele", "Cher", 2, null),
        ("Bruce", "Wayne", 2, null),
        ("Peter", "Parker", 3, null),
        ("Clark", "Kent", 2, null),
        ("David", "Bowie", 2, null),
        ("Joni", "Mitchell", 2, null),
        ("Dwayne", "Johnson", 2, null),
        ("Billy", "Joel", 2, null);
