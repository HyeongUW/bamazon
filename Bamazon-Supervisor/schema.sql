DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  product_sales DECIMAL(10,2) DEFAULT 0,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('God of War', 'Video Games', 45.95, 123);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('SEKIRO: Shadows Die Twice', 'Video Games', 49.95, 78);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Ipad Pro', 'Electronics', 1000.00, 82);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('XPS15 9570', 'Electronics', 1800.00, 93);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Avengers', 'Films', 12.45, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mad Max: Fury Road", "Films", 25.50, 57);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Monopoly", "Board Games", 30.50, 35);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Yahtzee", "Board Games", 19.95, 23);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cool Shades", "Apparel", 75.00, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Worn Denim Jeans", "Apparel", 54.25, 35);

CREATE TABLE departments(
  department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  primary key(department_id)
);

SELECT * FROM departments;

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Video Games", 200),
  ("Electronics", 100),
  ("Films", 50),
  ("Board Games", 0),
  ("Apparel", 125);