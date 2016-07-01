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
    common.makePotatoRequest('potato.mysql.queryMultiSql', {
      'sqls': {
        'insert': {
          sql: 'INSERT INTO ??.?? set name = ?',
          values: {
            'bob': ['potatotest', 'user', 'bob'],
            'naomi': ['potatotest', 'user', 'naomi'],
            'leo': ['potatotest', 'user', 'leo'],
          },
          timeout: 100,
          serverIds: {
            'bob': 'mysql-1',
            'naomi': 'mysql-1',
            'leo': 'mysql-2',
          },          
        },
        'select': {
          sql: 'select * from ??.??',
          values: {
            'bob': ['potatotest', 'user'],
            'naomi': ['potatotest', 'user'],
            'leo': ['potatotest', 'user'],
          },
          timeout: 100,
          serverIds: {
            'bob': 'mysql-1',
            'naomi': 'mysql-1',
            'leo': 'mysql-2',
          },               
        },
        'sleep': {
          sql: 'select sleep(1)',
          serverIds: {
            'sleep': 'mysql-1',
          },
        }
      }
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