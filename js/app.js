var koa   = require('koa'),
  app     = koa(),
  router  = require('koa-router')(),
  koaBody = require('koa-body')(),
  bcrypt  = require('bcrypt'),
  db      = require('mysql2');



var pool = db.createPool({
  host: process.env.MYSQL_PORT_3306_TCP_ADDR,
  user: "root",
  password: "test",
  database: "benchmark",
  connectionLimit: 100,
  acquireTimeout: 999999,
  debug     : false
});

// var usersTable = 
//   "CREATE TABLE IF NOT EXISTS user"+
//   "( id INT NOT NULL AUTO_INCREMENT,"+
//   "PRIMARY KEY(id),"+
//   "email VARCHAR(30) NOT NULL,"+
//   "firstName VARCHAR(256) NOT NULL,"+
//   "lastName VARCHAR(256) NOT NULL,"+
//   "password VARCHAR(60) NOT NULL,"+
//   "description VARCHAR(512) NOT NULL)";

// pool.getConnection(function(err, connection){
//   if(err){
//     console.log(err);
//   }else{
//     connection.query(usersTable,function(err,status){
//       connection.release();
//       if(err){
//         console.log(err)
//       }else{
//         console.log(status);
//       }
//     });

//   }
// });

var createUser = function (data) {
  /*var def = Q.defer();

  pool.getConnection(function(err, connection){
    if(err){
      console.log(err);
      def.reject(new Error(err));
    }else{
      var user = data;
      bcrypt.hash(user.password, 12, function(err,hash){
        if(err){
          console.log(err);
          def.reject(new Error(err));
        }else{
          user.password = hash;

          connection.query("INSERT INTO users SET ?", data, function(err,rows){
            connection.release();
            if(err){
              console.log(err);
              def.reject(new Error(err));
            }else{
              def.resolve(rows);
            }
          });
        }
      })
    }
  })

  return def.promise;*/
  return new Promise(function(resolve,reject){    
    var user = data;
    pool.getConnection(function(err, connection){
      if(err){
        connection.release();
        reject(err);
      }else{
        bcrypt.hash(user.password, 12, function(err,hash){
          if(err){
            console.log(err);
            connection.release();
            reject(err);
          }else{
            user.password = hash;

            connection.query("INSERT INTO user SET ?", data, function(err,rows){
              connection.release();
              if(err){
                reject(err);
              }else{
                resolve(rows);
              }
            });
          }
        });
      }
    })
  })

};

var getUsers = function () {
  /*var def = Q.defer();
  pool.getConnection(function(err, connection){
    if(err){
      def.reject(new Error(err));
    }else{
      connection.query('SELECT * FROM users LIMIT 1000',function(err,rows){
        connection.release();
        if(err){
          def.reject(new Error(err));
        }else{
          def.resolve(rows);
        }
      });
    }
  });
  return def.promise;*/
  return new Promise(function(resolve,reject){
    pool.getConnection(function(err, connection){
      if(err){
        connection.release();
        reject(err);
      }else{
        connection.query('SELECT * FROM user LIMIT 1000',function(err,rows){
          connection.release();
          if(err){
            reject(err);
          }else{
            resolve(rows);
          }
        });

      }
    });
  })
};
/*
  Example Data to be received
  {
    "email":"test@email.com",
    "firstName":"John",
    "lastName":"Smith",
    "description":"sample long description",
    "password":"password"
  }
*/
router.post("/create", koaBody,
  function *(next){
    this.body = yield createUser(this.request.body);
  }
);

router.get("/list",
  function *(next){
    this.body = yield getUsers();
  }
);

app
.use(router.routes())
.use(router.allowedMethods());

app.listen(3000);


console.log('listening on port 3000');