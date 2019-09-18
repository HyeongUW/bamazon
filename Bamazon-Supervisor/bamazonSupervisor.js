var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connection successful!");
    viewProducts();
});

viewProducts = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        showingOptions();
    });
}

showingOptions = function() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: ["1. View Product Sales by Department", "2. Create New Department", "3. Quit"]
            }
        ])
        .then(function(val) {
            if(val.choice === "1. View Product Sales by Department") {
                viewSalesByDepartment();
            } else if (val.choice === "2. Create New Department") {
                addDepartment();
            } else {
                console.log('Goodbye!');
                process.exit(0);
            }
        })
}

viewSalesByDepartment = function() {
    connection.query(
        " SELECT " +
        "   d.department_id, " +
        "   d.department_name, " +
        "   d.over_head_costs, " +
        "   SUM(IFNULL(p.product_sales, 0)) as product_sales, " +
        "   SUM(IFNULL(p.product_sales, 0)) - d.over_head_costs as total_profit " +
        "FROM products p " +
        "   RIGHT JOIN departments d ON p.department_name = d.department_name " +
        "GROUP BY " +
        "   d.department_id, " +
        "   d.department_name, " +
        "   d.over_head_costs",
        function(err, res) {
          console.table(res);
          showingOptions();
        }
      );
}

addDepartment = function() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the department?"
            },
            {
                type: "input",
                name: "overhead",
                message: "What is the overhead cost of the department?",
                validate: function(val) {
                    return val > 0;
                }
            }
        ])
        .then(function(val) {
            connection.query(
                "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)",
                [val.name, val.overhead],
                function(err) {
                    if (err) throw err;
                    console.log("DEPARTMENT ADDED!");
                    viewProducts();
                }
            )
        })
}