var async = require('async')
var common = require('../common')

async.series([
  function(cb) {
    common.makePotatoRequest('potato.mysql.query', {
      serverId: 'mysql-1',
      sql: 'CREATE DATABASE IF NOT EXISTS ??',
      values: ['potatotest'],
      timeout: 100,
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.query', {
      serverId: 'mysql-1',
      sql: 'CREATE TABLE IF NOT EXISTS ??.?? (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)',
      values: ['potatotest', 'user'],
      timeout: 100,
    }, cb)
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.queryMultiValue', {
      sql: 'INSERT INTO ??.?? set name = ?',
      values: {
        'bob': ['potatotest', 'user', 'bob'],
        'naomi': ['potatotest', 'user', 'naomi'],
        'leo': ['potatotest', 'user', 'leo'],
      },
      serverIds: {
        'bob': 'mysql-1',
        'naomi': 'mysql-2',
        'leo': 'mysql-1',
      },
      timeout: 100,
    }, cb)
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.queryMultiValue', {
      sql: 'select * from ??.?? where name = ?',
      values: {
        'bob': ['potatotest', 'user', 'bob'],
        'naomi': ['potatotest', 'user', 'naomi'],
        'leo': ['potatotest', 'user', 'leo'],
      },
      serverIds: {
        'bob': 'mysql-1',
        'naomi': 'mysql-2',
        'leo': 'mysql-2',
      },      
      timeout: 100,
    }, cb)
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.queryMultiValue', {
      sql: 'SELECT SLEEP(1)',
      serverIds: {
        'sid': 'mysql-1',
      }, 
    }, cb)
  },  
  function(cb) {
    common.makePotatoRequest('potato.mysql.query', {
      serverId: 'mysql-1',
      sql: 'DROP DATABASE IF EXISTS ??',
      values: ['potatotest'],
      timeout: 100,
    }, cb)
  },
],
function(err) {
  console.log('err=' + err)
})