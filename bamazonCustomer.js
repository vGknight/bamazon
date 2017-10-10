var inquirer = require("inquirer");
var mysql = require("mysql");

idArr = []; //track id's in DB
var cnx = mysql.createConnection({

    host: "localhost",
    port: 3306,
    user: "homework",
    password: "Coding2017!",
    database: "bamazon"
});

cnx.connect(function(err) {

    if (err) throw err;

});

//fire it up!
initApp();

function initApp() {
    inquirer
        .prompt({

            name: "choice",
            type: "list",
            choices: ["1: Browse our Inventory", "2: End Session"],
            message: "Welcome to Bamazon!\n  Your one stop shop for purchasing via the CLI!\n  \n"

        })
        .then(function(answer) {

            if (answer.choice === "1: Browse our Inventory") {
                cnx.query('SELECT item_id,product_name,department_name,price,stock_quantity FROM `products`', function(error, results, fields) {
                    if (error) throw error;

                    for (var i = 0; i < results.length; i++) {

                        idArr.push(results[i].item_id); // add id's to control variable array for validation later
                        console.log(" ");
                        console.log("Product ID: " + results[i].item_id + " Product Name: " + results[i].product_name + " | Price: $" + parseFloat(results[i].price).toFixed(2) + " | Qty Availble: " + results[i].stock_quantity);
                        console.log(" ");
                    }
                    showAllOptions();
                });

            } else {
                console.log("Oops I loaded this node.js CLI shopping app by mistake and want to get out of here");
                cnx.end();
            }
        })
}
// Screen to show after customer viewed inventory
function showAllOptions() {
    inquirer
        .prompt({

            name: "choice",
            type: "list",
            choices: ["1: Browse our Inventory", "2: Make a purchase", "3: End Session"],
            message: "Choose an option below\n",
            default: "Make a purchase"

        })
        .then(function(answer) {

            if (answer.choice === "1: Browse our Inventory") {

                cnx.query('SELECT item_id,product_name,department_name,price,stock_quantity FROM `products`', function(error, results, fields) {
                    if (error) throw error;
                    console.log("Here are some sweet things");
                    for (var i = 0; i < results.length; i++) {
                        console.log(" ");
                        console.log("Product ID: " + results[i].item_id + " Product Name: " + results[i].product_name + "| Price: " + results[i].price + "| Qty Availble: " + results[i].stock_quantity);
                        console.log(" ");

                    }

                    showAllOptions();

                });

            } else if (answer.choice === "2: Make a purchase") {

                buyItem();

            } else {
                console.log("Thanks for visiting!");

                cnx.end();

            }

        })
}

function buyItem() {
    inquirer
        .prompt([

            {
                name: "ID",
                message: "What is the ID of the product you want to buy?",
                validate: function(value) {
                    // validate legit id
                    if (isNaN(value) === false && idArr.indexOf(parseInt(value)) != -1) {
                        return true;
                    }
                    console.log(" Please choose a valid Product ID");
                    return false;
                }

            },

            {
                name: "qty",
                message: "How many would you like to purchase?",
                validate: function(value) {
                    if (isNaN(value) === false && parseInt(value) > 0) {
                        return true;
                    }
                    console.log(" please select a number greater than 0");
                    return false;
                }

            }
        ])
        .then(function(answer) {

            cnx.query("SELECT stock_quantity, price FROM products WHERE item_id = ?", [answer.ID],
                function(error, results) {
                    if (error) throw error;
                    for (var i = 0; i < results.length; i++) {

                        var currentQty = results[i].stock_quantity;
                        var price = results[i].price;
  
                    }

                    //check to see if enough is instock

                    if (currentQty >= answer.qty && currentQty > 0) {
                        var updatedStock = currentQty - answer.qty;
                        var cost = answer.qty * price;
                        confirmPurch(answer.ID, updatedStock, cost); // update 

                    } else if(currentQty <= 0) {
                        console.log("We apologize bue that item is currently out of stock!");
                        showAllOptions();
                    }

                    else{

                        console.log("We only have " + currentQty + " available at this time");
                        showAllOptions();
                    }

                });

        });

}



updateProducts = function(item_id, units_purchased) {

    cnx.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: units_purchased, },
            //WHERE Clause
            { item_id: item_id }
        ],

        function(error, results) {
            if (error) throw error;
            console.log(results);
            console.log(results.affectedRows)
        });


};

getQuantity = function(item_id) {

    cnx.query("SELECT stock_quantity FROM products WHERE item_id = ?", [item_id],
        function(error, results) {
            if (error) throw error;
            for (var i = 0; i < results.length; i++) {
                var quantity = results[i].stock_quantity;
            }
            return quantity;
        });
};
// 
updateQuantity = function(item_id, units_purchased) {

    var currentQuantity = getQuantity(item_id);
    var newQuantity = currentQuantity - units_purchased;
    updateProducts(item_id, newQuantity);
};

confirmPurch = function(item_id, updatedQty, price) {

    inquirer
        .prompt({
            type: "confirm",
            message: "Purchase this item?:",
            name: "confirm",
            default: true
        })
        .then(function(inquirerResponse) {

            if (inquirerResponse.confirm) {
                
                console.log("You have been charged $"+ price );
                console.log("Thank you for your business!");


                cnx.query("UPDATE products SET ? WHERE ?", 
                    [
                        { stock_quantity: updatedQty},
                        { item_id: item_id }
                    ],

                    function(error, results) {
                        if (error) throw error;
                        showAllOptions();
                    });


            } else {
                showAllOptions();
            }
        });
}