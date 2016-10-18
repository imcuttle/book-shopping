/**
 * Created by Yc on 2016/6/16.
 */
var mysql = require('mysql');

var config = {
    host     : 'localhost',
    user     : 'root',
    password : '110114',
    database : 'shopping',
    // queueLimit: 50,
    // connectionLimit: 20,
    // waitForConnections: false
};


var database = mysql.createPool(config);



/*
var connection = mysql.createConnection(config);
function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.error('Re-connecting lost connection: ' + err.stack);
    connection.end();

    connection = mysql.createConnection(config);
    handleDisconnect(connection);
    connection.connect();
  });
}

handleDisconnect(connection);
connection.connect();
*/
// console.log(connection.escape("string"),connection.escape(123),connection.escape(new Date())); // value
// console.log(connection.escapeId("dsf.date")); // id
//
// var sql = "SELECT * FROM ?? WHERE ?? = ?"; // ??->id   ?->value
// var inserts = ['users', 'id', 'xxx'];
// sql = mysql.format(sql, inserts);
// console.log(sql);


module.exports = {
  query: function() {
    var argArr = Array.from(arguments);
    var cb = argArr.splice(-1)[0];
    
    database.getConnection(function(err, dbConnection) {
      if (err) { /* do something */ return }
      dbConnection.query.apply(dbConnection, argArr.concat(function() {
        dbConnection.release(); // return to the pool
        cb.apply(null, Array.from(arguments));
      }));
    })
  },
  format: mysql.format,
  likeStrFilter: function (s) {
    return '%'+s.replace(/([_%])/g,'*'+RegExp.$1)+'%';
  }
};

//
// connection.query('SELECT username from users', function(err, rows, fields) {
//     if (err) throw err;
//
//     console.log('The solution is: ', fields,rows);
// });


// connection.end();
