var express    = require("express");
var mysql      = require('mysql');
var bcrypt     = require('bcrypt');
var bodyParser = require('body-parser');
require('events').EventEmitter.prototype._maxListeners = 100;
var app = express();

var pool = mysql.createPool({
  connectionLimit : 100,
  acquireTimeout: 999999,
  // host      : process.env.MYSQL_PORT_3306_TCP_ADDR || '192.168.30.11',
  // port      : process.env.MYSQL_PORT_3306_TCP_PORT || 4004,
  host      : '192.168.9.2',
  port      : 3306,
  user      : 'root',
  password  : '',
  database  : 'benchmark',
  debug     : false
})

console.log("Benchmarker!");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// function handleDatabase(req, res){
//   var post = undefined;
//   pool.getConnection(function(err, connection){
//     if(err){
//       console.log(err,'err connection')
//       connection.release();
//       res.json({"code":100, "status":"Error in database connection"});
//       return;
//     }
//     console.log("connected as id " + connection.threadId);

//     // async hashing
//     if(req.method == 'POST'){
//       post = req.body;
//       if(post.password){
//         bcrypt.hash(post.password, 12, function(err, hash) {
//           post.password = hash
//           console.log(post,'post')
//           query = connection.query('INSERT INTO user SET ?', post, function(err,rows){
//             connection.release();
//             if(err){
//               console.log(err,'err')
//             }else{
//               res.json(rows);
//             }
//           });
//           // console.log(query.sql,'query')
//         });
//       }
//     }else if(req.method == 'GET'){
//       console.log('list')
//       connection.query('SELECT * FROM user LIMIT 1000', function(err,rows){
//         connection.release();
//         if(err){
//           console.log(err,'err')
//         }else{
//           res.json(rows);
//         }
//       });
//     }

//     connection.on("error", function(err){
//       res.json({"code":100, "status": "Error in database connection"});
//       return;
//     });
//   });
// }

// app.get("/list",function(req,res){
//   handleDatabase(req,res);
// });

// app.post("/create",function(req,res){
//   handleDatabase(req,res);
// });


// app.listen(3003);



function postUser(req, res){
  var post = req.body;
  if(post.password){
    bcrypt.hash(post.password, 12, function(err, hash) {
      post.password = hash
      pool.getConnection(function(err, connection){
        if(err){
          console.log(err,'err connection')
          connection.release();
          res.json({"code":100, "status":"Error in database connection"});
          return;
        }
        console.log("connected as id " + connection.threadId);
        query = connection.query('INSERT INTO user SET ?', post, function(err,rows){
          connection.release();
          if(err){
            console.log(err,'err')
          }else{
            res.json(rows);
          }
        });
        // console.log(query.sql,'query')
        connection.on("error", function(err){
          res.json({"code":100, "status": "Error in database connection"});
          return;
        });
      }) 
    });
  }
}

function listUser(req, res){
  pool.getConnection(function(err, connection){
    if(err){
      console.log(err,'err connection')
      connection.release();
      res.json({"code":100, "status":"Error in database connection"});
      return;
    }
    console.log("connected as id " + connection.threadId);
    connection.query('SELECT * FROM user LIMIT 1000', function(err,rows){
      connection.release();
      if(err){
        console.log(err,'err')
      }else{
        res.json(rows);
      }
    });
    connection.on("error", function(err){
      res.json({"code":100, "status": "Error in database connection"});
      return;
    });
  })
}


app.get("/list",function(req,res){
  listUser(req,res);
});

app.post("/create",function(req,res){
  postUser(req,res);
});


app.listen(3003);