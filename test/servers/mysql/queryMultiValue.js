var async = require('async')
var common = require('../common')

async.series([
  function(cb) {
    common.makeMysqlRequest('mysql.handler.query', {
      sql: 'CREATE DATABASE IF NOT EXISTS ??',
      values: ['mysqltest'],
      timeout: 100,
    }, cb)    
  },
  function(cb) {
    common.makeMysqlRequest('mysql.handler.query', {
      sql: 'CREATE TABLE IF NOT EXISTS ??.?? (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)',
      values: ['mysqltest', 'user'],
      timeout: 100,
    }, cb)
  },
  function(cb) {
    common.makeMysqlRequest('mysql.handler.queryMultiValue', {
      sql: 'INSERT INTO ??.?? set name = ?',
      values: {
        'bob': ['mysqltest', 'user', 'bob'],
        'naomi': ['mysqltest', 'user', 'naomi'],
        'leo': ['mysqltest', 'user', 'leo'],
      },
      timeout: 100,
    }, cb)
  },
  function(cb) {
    common.makeMysqlRequest('mysql.handler.queryMultiValue', {
      sql: 'select * from ??.?? where name = ?',
      values: {
        'bob': ['mysqltest', 'user', 'bob'],
        'naomi': ['mysqltest', 'user', 'naomi'],
        'leo': ['mysqltest', 'user', 'leo'],
      },
      timeout: 100,
    }, cb)
  },
  function(cb) {
    common.makeMysqlRequest('mysql.handler.queryMultiValue', {
      sql: 'SELECT SLEEP(1)',
    }, cb)
  },  
  function(cb) {
    common.makeMysqlRequest('mysql.handler.query', {
      sql: 'DROP DATABASE IF EXISTS ??',
      values: ['mysqltest'],
      timeout: 100,
    }, cb)
  },
],
function(err) {
  console.log('err=' + err)
})