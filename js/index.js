var express    = require("express");
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'benchmark'
});
var app = express();

connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... \n\n");  
  } else {
      console.log("Error connecting database ... \n\n");  
  }
});

app.get("/",function(req,res){
  console.log('Benchmarker!');
});

app.get("/list",function(req,res){
  connection.query('SELECT * from user', function(err, rows, fields) {
    // connection.end();
      if (!err)
        console.log('The solution is: ', rows);
      else
        console.log('Error while performing Query.');
      });
});

app.post("/create",function(req,res){
  var post = req.body;
  console.log(post,'post');
  connection.query('INSERT INTO user SET ?',post, function(err, rows, fields) {
    // connection.end();
      if (!err)
        console.log('The solution is: ', rows);
      else
        console.log(err,'Error while performing Query.');
      });
});

app.listen(3003);