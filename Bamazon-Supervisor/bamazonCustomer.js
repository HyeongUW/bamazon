var mysql = require("mysql");
var inquirer = require('inquirer');
require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  console.log("connected as id " + connection.threadId + "\n");
  viewProducts();
});

viewProducts = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        askingProductID(res);
    });
}

// First, need to get access to the product with product_id
// Second, need to check if the product has enough stock
// Third, if it is not sufficient -> 'Insufficient quantity!'
//        if it is sufficient     -> show the customer the total cost of their purchase
askingProductID = function(inventory) {
    inquirer
        .prompt([
            {
            type: 'input',
            name: 'product_id',
            message: 'What is the ID of the product you would like to buy? [Quit with Q]',
            validate: function(val) {
                return !isNaN(val) || val.toLowerCase() === "q";
            }
            }
        ])
        .then(function(val) {
            checkIfShouldExit(val.product_id);
            var selectedID = parseInt(val.product_id);
            var product = checkingInventory(selectedID, inventory);

            if(product) {
                askingQuantity(product);
            } else {
                console.log("\nThat item is not in the inventory.");
                viewProducts();

            }
        });
}

askingQuantity = function(product) {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'quantity',
                message: 'How many units of the product you would like to buy? [Quit with Q]',
                validate: function(val) {
                    return val > 0 || val.toLowerCase() === 'q';
                }
            }            
        ])
        .then(function(val) {
            checkIfShouldExit(val.quantity);
            var quantity = parseInt(val.quantity);

            if(quantity > product.stock_quantity) {
                console.log("\nInsufficient quantity!");
                viewProducts();
            } else {
                makePurchase(product, quantity);
            }
        });
}

makePurchase = function(product, quantity) {
    connection.query(
      "UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? WHERE item_id = ?",
      [quantity, product.price * quantity, product.item_id],
      function(err, res) {
        console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
        viewProducts();
      }
    );
}


checkingInventory = function(selectedID, inventory) {
    for(var i = 0; i < inventory.length; i++) {
        if(inventory[i].item_id === selectedID) {
            return inventory[i];
        }
    }
    return null;
}


function checkIfShouldExit(choice) {
    if (choice.toLowerCase() === "q") {
        console.log("Goodbye!");
        process.exit(0);
    }
}

  