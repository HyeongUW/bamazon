var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  showingOptions();
});

showingOptions = function() {
  inquirer
  .prompt([
      {
          type: 'list',
          name: 'options',
          message: 'What would you like to do?',
          choices: ['1. View Products for Sale', '2. View Low Inventory', '3. Add to Inventory', '4. Add New Product', '5. Placing Order', '6. EXIT\n\n']        
      }

  ])
  .then(function(answers) {
      if(answers.options === '1. View Products for Sale') {
        console.log('1. View Products for Sale');
        viewProducts();

      } else if(answers.options === '2. View Low Inventory') {
        console.log('2. View Low Inventory');
        viewLowInventory();

      } else if(answers.options === '3. Add to Inventory') {
        console.log('3. Add to Inventory');    
        addInventory();

      } else if(answers.options === '4. Add New Product') {
        console.log('4. Add New Product');  
        addProduct();

      } else if(answers.options === '5. Placing Order') {
        console.log('5. Placing Order');  
        placingOrder();
        
      } else {
        console.log('6. EXIT');
        console.log("Good Bye.");
        connection.end();
      }
  });  
}

viewProducts = function() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    console.log('\n');
  });
  
}

//list all items with an inventory count lower than five.
viewLowInventory = function() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
    if (err) throw err;
    console.table(res);
  });
  
}

//display a prompt that will let the manager "add more" of any item currently in the store.
addInventory = function() {
  viewProducts();

  inquirer
    .prompt([
      {
        type: 'number',
        name: 'product_id',
        message: 'What is the ID of the product you would like to add? ',
      },
      {
        type: 'number',
        name: 'numOfProduct',
        message: 'How many units of the product you would like to add? ',
      }

    ])
    .then(function(answers) {
      const {product_id, numOfProduct} = answers;
      
      connection.query("SELECT * FROM products WHERE item_id = ?", [product_id], function(err, res) {
        if (err) throw err;
        updateProduct(product_id, res[0].stock_quantity + numOfProduct);
      });
    });

    
  
}

//allow the manager to add a completely new product to the store.
addProduct = function() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'product',
        message: 'What is the name of the product you would like to add? ',
      },
      {
        type: 'input',
        name: 'department',
        message: 'What is the department of the product you would like to add? ',
      },
      {
        type: 'number',
        name: 'price',
        message: 'How much is the product? ',
      },
      {
        type: 'number',
        name: 'stock',
        message: 'How many products you would like to add in stock? ',
      }

    ])
    .then(function(answers) {
      const {product, department, price, stock} = answers;
      
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: product,
          department_name: department,
          price: price,
          stock_quantity: stock
        },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " product inserted!\n");
        }
      );      
    });  
}





function placingOrder() {
  inquirer
    .prompt([
      {
        type: 'number',
        name: 'product_id',
        message: 'What is the ID of the product you would like to buy?',
      },
      {
        type: 'number',
        name: 'numOfProduct',
        message: 'How many units of the product you would like to buy?',
      }
    ])
    .then(function(answers) {
      const {product_id, numOfProduct} = answers;
      
      // First, need to get access to the product with product_id
      // Second, need to check if the product has enough stock
      // Third, if it is not sufficient -> 'Insufficient quantity!'
      //        if it is sufficient     -> show the customer the total cost of their purchase
      connection.query("SELECT * FROM products WHERE item_id = ?", [product_id], function(err, res) {
        if (err) throw err;
        if(res[0].stock_quantity >= numOfProduct) {
          // if there is enough
          console.log("Enough in stock");
          updateProduct(product_id, res[0].stock_quantity - numOfProduct);
          var totalCost = res[0].price * numOfProduct;
          console.log("TOTAL COST: ", totalCost);
        } else {
          // if there is not enough 
          console.log("Insufficient Quantity");
          connection.end();  
        }
      });
    });
}

updateProduct = function(product_id, diff) {
  console.log('Updating the product initiated...');
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: diff
      },
      {
        item_id: product_id
        
      } 
    ],
    function(err, res) {
      if (err) throw err;
      //console.log(res.affectedRows + " products updated!\n");
      viewProducts();
    }
  );
}
