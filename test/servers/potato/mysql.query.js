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
    common.makePotatoRequest('potato.mysql.query', {
      serverId: 'mysql-1',
      sql: 'INSERT INTO ??.?? set name = ?',
      values: ['potatotest', 'user', 'bob'],
      timeout: 100,
    }, cb)
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.query', {
      serverId: 'mysql-1',
      sql: 'select * from ??.??',
      values: ['potatotest', 'user'],
      timeout: 100,
    }, cb)
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.query', {
      serverId: 'mysql-1',
      sql: 'select sleep(1)',
      timeout: 100,
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
