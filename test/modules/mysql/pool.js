var mysql = require('mysql')
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : '127.0.0.1',
  user            : 'root',
  password        : '',
  connectionLimit : 2,
  waitForConnections: true,
  acquireTimeout  : 1000,
  queueLimit      : 0
})

pool.on('connection', function (connection) {
  console.log('on connection')
})

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});

pool.query('SELECT * from test.user where id=1 and', function(err, rows, fields) {
  if (err) throw err
  console.log(rows)
})

pool.query('SELECT * from test.user where id=2', function(err, rows, fields) {
  if (err) throw err
  console.log(rows)
})

pool.query('SELECT * from test.user where id=3', function(err, rows, fields) {
  if (err) throw err
  console.log(rows)
})

process.on('uncaughtException', function(err) {
    console.error('%j', err)
})