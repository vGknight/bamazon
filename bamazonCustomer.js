
var inquirer = require("inquirer");
var mysql = require("mysql");

var cnx = mysql.createConnection({

    host: "localhost",
    port: 3306,
    user: "homework",
    password: "Coding2017!",
    database: "class_workDB"
});

cnx.connect(function(err) {

    if (err) throw err;
    console.log("connected as id:" + cnx.threadId);
    // myQuery("metal");
    // myInsert();
    // myInsertFinal("aa", "bd", "cd");
    // updateTable();
    // myQuery2();
    cnx.end();

});


