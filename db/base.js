/**
 * Created by Yc on 2016/6/16.
 */
var mysql = require('mysql');

var config = {
    host     : 'localhost',
    user     : 'root',
    password : '110114',
    database : 'shopping',
};

var connection = mysql.createConnection(config);


function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(config);
    handleDisconnect(connection);
    connection.connect();
  });
}

handleDisconnect(connection);
connection.connect();

// console.log(connection.escape("string"),connection.escape(123),connection.escape(new Date())); // value
// console.log(connection.escapeId("dsf.date")); // id
//
// var sql = "SELECT * FROM ?? WHERE ?? = ?"; // ??->id   ?->value
// var inserts = ['users', 'id', 'xxx'];
// sql = mysql.format(sql, inserts);
// console.log(sql);
connection.format = mysql.format;
connection.likeStrFilter = function (s) {
    return '%'+s.replace(/([_%])/g,'*'+RegExp.$1)+'%';
}
module.exports = connection;

//
// connection.query('SELECT username from users', function(err, rows, fields) {
//     if (err) throw err;
//
//     console.log('The solution is: ', fields,rows);
// });


// connection.end();
