var express    = require("express");
var mysql      = require('mysql');
var bcrypt     = require('bcrypt');
var bodyParser = require('body-parser');
require('events').EventEmitter.prototype._maxListeners = 100;
var app = express();

var pool = mysql.createPool({
  connectionLimit : 100,
  acquireTimeout: 30000,
  host      : process.env.MYSQL_PORT_3306_TCP_ADDR || '192.168.30.11',
  port      : process.env.MYSQL_PORT_3306_TCP_PORT || 4004,
  user      : 'root',
  password  : 'test',
  database  : 'benchmark',
  debug     : false
})

console.log("Benchmarker!");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
function handleDatabase(req, res){
  var post = undefined;
  pool.getConnection(function(err, connection){
    if(err){
      console.log(err,'err connection')
      connection.release();
      res.json({"code":100, "status":"Error in database connection"});
      return;
    }
    console.log("connected as id " + connection.threadId);
    
    switch(req.url){
      case '/list':
        queryStr = 'SELECT * FROM user LIMIT 1000';
        break;
      case '/create':
        queryStr = 'INSERT INTO user SET ?';
        break;
      default:
        queryStr = 'SELECT * FROM user LIMIT 1';
    }

    // async hashing
    if(req.method == 'POST'){
      post = req.body;
      if(post.password){
        bcrypt.hash(post.password, 12, function(err, hash) {
          post.password = hash
          console.log(post,'post')
          query = connection.query(queryStr, post, function(err,rows){
            connection.release();
            if(!err){
              res.json(rows);
            }
          });
          // console.log(query.sql,'query')
        });
      }
    }else if(req.method == 'GET'){
      console.log('list')
      connection.query(queryStr, function(err,rows){
        connection.release();
        if(!err){
          res.json(rows);
        }
      });
    }

    connection.on("error", function(err){
      res.json({"code":100, "status": "Error in database connection"});
      return;
    });
  });
}

app.get("/list",function(req,res){
  handleDatabase(req,res);
});

app.post("/create",function(req,res){
  handleDatabase(req,res);
});


app.listen(3003);