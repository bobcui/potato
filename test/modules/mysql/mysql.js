var async = require('async')
var config = require('../../../app/utils/config')
var Mysql = require('../../../app/modules/mysql')

config.init('development', {path: '../../../config/config.json'})

var mysql = new Mysql
mysql.init(config)

async.auto({
  createDatabase: function(callback){
    mysql.query('CREATE DATABASE IF NOT EXISTS ??', ['mysqltest'], callback)
  },
  createTable: ['createDatabase', function(callback){
    mysql.query('CREATE TABLE IF NOT EXISTS mysqltest.user (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)', callback)
  }],
  insertBob: ['createTable', function(callback){
    mysql.query('INSERT INTO mysqltest.user set name = ?', ['bob'], callback)
  }],
  insertLeo: ['createTable', function(callback){
    mysql.query('INSERT INTO mysqltest.user set name = ?', ['leo'], callback)
  }],
  insertNaomi: ['createTable', function(callback){
    mysql.query('INSERT INTO mysqltest.user set name = ?', ['naomi'], callback)
  }],
  query: ['insertBob', 'insertLeo', 'insertNaomi', function(callback){
    mysql.query('SELECT * FROM ??.??', ['mysqltest', 'user'], function(err, rows, fields){
      if (!err) {
        console.log(rows)
      }
      callback(err)
    })
  }],
  drop: ['query', function(callback){
    mysql.query('DROP DATABASE IF EXISTS ??', ['mysqltest'], callback)
  }],
  getInfo: ['drop', function(callback){
    console.log(mysql.getInfo())
    mysql.clearQueryStats()
    console.log(mysql.getInfo())
    callback()
  }],
}, 
function(err){
  if (!!err) {
    console.log(err)
  }  
  mysql.fini()
  config.fini()
})
