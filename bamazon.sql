DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(50) NULL,
  price INT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Iphone X', 'Electronics', 700, 123);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Apple Watch Gen 4', 'Electronics', 400, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Galaxy S10', 'Electronics', 850, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Galaxy Fold', 'Electronics', 2100, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Ipad Pro', 'Electronics', 1000, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('XPS15 9570', 'Electronics', 1800, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('PS4 PRO', 'Electronics', 400, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('XBOX ONE X', 'Electronics', 400, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Apple Pencil', 'Electronics', 150, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('MacBook Pro 15', 'Electronics', 1800, 0);



-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);
