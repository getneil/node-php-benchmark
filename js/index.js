var express    = require("express");
var mysql      = require('mysql');
var bcrypt     = require('bcrypt');
var bodyParser = require('body-parser');
var app = express();

var pool = mysql.createPool({
  connectionLimit : 100,
  acquireTimeout: 30000,
  host      : '192.168.9.5',
  port      : 4003,
  user      : 'root',
  password  : 'test',
  database  : 'benchmark',
  debig     : false
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
    // console.log(req.url,req.route.path,req.route.methods,'req'); 
    
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
    console.log(req.body,'req.body')
    if(req.body){
      post = req.body;
      if(post.password){
        post.password = bcrypt.hashSync(post.password, 12);
        // console.log(post,'post pass')
      }
    }

    connection.query(queryStr, post, function(err,rows){
      connection.release();
      if(!err){
        // console.log(rows,'rows');
        res.json(rows);
      }
    });

    connection.on("error", function(err){
      res.json({"code":100, "status": "Error in database connection"});
      return;
    });
  });
}

app.get("/list",function(req,res){
  // console.log('list')
  handleDatabase(req,res);
  // connection.query('SELECT * FROM user', function(err, rows, fields){
  //   // connection.end();
  //   if(!err){
  //     console.log("Result: ", rows);
  //   }else{
  //     console.log("Error while performing Query");
  //   }
  // })
});

app.post("/create",function(req,res){
  // console.log('create')
  handleDatabase(req,res);
  // console.log(req.body,'body');
  // if(req.body){
  //   post = req.body;
  //   bcrypt.hash(post.password, 12, function(err, hash){
  //     post.password = hash;
  //     connection.query('INSERT INTO user SET ?', post, function(err, rows, fields){
  //       // connection.end();
  //       if(!err){
  //         console.log("Result: ", rows);
  //       }else{
  //         console.log("Error while performing Query",err);
  //       }
  //     })
  //   })
  // }
});


app.listen(3003);