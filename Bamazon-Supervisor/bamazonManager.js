var mysql = require("mysql");
var inquirer = require('inquirer');
require('console.table')

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
  showingMenu();
});

showingMenu = function() {
  connection.query('SELECT * FROM products', function(err, res) {
    if(err) throw err;
    showingOptions(res);
  })
}

showingOptions = function(products) {
  inquirer
    .prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['1. View Products for Sale', '2. View Low Inventory', '3. Add to Inventory', '4. Add New Product', '5. Quit']        
        }

    ])
    .then(function(val) {
        if(val.options === '1. View Products for Sale') {
          console.table(products);
          showingMenu();

        } else if(val.options === '2. View Low Inventory') {
          viewLowInventory();

        } else if(val.options === '3. Add to Inventory') {
          addInventory(products);

        } else if(val.options === '4. Add New Product') {
          addProduct(products);

        } else {
          console.log("Good Bye.");
          process.exit(0);
        }
    });  
}


//list all items with an inventory count lower than five.
viewLowInventory = function() {
  connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
    if (err) throw err;
    console.table(res);
    showingMenu();
  }); 
}

//display a prompt that will let the manager "add more" of any item currently in the store.
addInventory = function(inventory) {
  console.table(inventory);
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'product_id',
        message: 'What is the ID of the product you would like to add? ',
        validate: function(val) {
          return !isNaN(val);
        }
      }
    ])
    .then(function(val) {
      var selectedID = parseInt(val.product_id);
      var product = checkingInventory(selectedID, inventory);

      if(product) {
        askingQuantity(product);

      } else {
        console.log("\nThat item is not in the inventory.");
        showingMenu();
      }
    });

    
  
}

askingQuantity = function(product) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'quantity',
        message: "How many would you like to add?",
        validate: function(val) {
          return val > 0;
        }
      }
    ])
    .then(function(val) {
      var quantity = parseInt(val.quantity);
      addQuantity(product, quantity);
    })
}

addQuantity = function(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
    [product.stock_quantity + quantity, product.item_id],
    function(err, res) {
      console.log("\nSuccessfully added " + quantity + " " + product.product_name + "'s!\n");
      showingMenu();
    }
  )
}

addProduct = function(products) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'product_name',
        message: 'What is the name of the product you would like to add? ',
      },
      {
        type: 'list',
        name: 'department_name',
        choices: getDepartments(products),
        message: "Which department does this product fall into?"
      },
      {
        type: 'input',
        name: 'price',
        message: 'How much is the product? ',
        validate: function(val) {
          return val > 0;
        }
      },
      {
        type: 'input',
        name: 'quantity',
        message: "How many do we have?",
        validate: function(val) {
          return !isNaN(val);
        }
      }
    ])
    .then(addNewProduct);
}

addNewProduct = function(val) {
  connection.query(
    'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)',
    [val.product_name, val.department_name, val.price, val.quantity],
    function(err, res) {
      if (err) throw err;
      console.log(val.product_name + " ADDED TO BAMAZON!\n");
      showingMenu();
    }
  );
}

getDepartments = function(products) {
  var departments = [];
  for(var i = 0; i < products.length; i++) {
    if(departments.indexOf(products[i].department_name) === -1) {
      departments.push(products[i].department_name);
    }
  }
  return departments;
}

checkingInventory = function(selectedID, inventory) {
  for(var i = 0; i < inventory.length; i++) {
    if(inventory[i].item_id === selectedID) {
      return inventory[i];
    }
  }
  return null;
}