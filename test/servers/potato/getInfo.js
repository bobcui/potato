var async = require('async')
var common = require('../common')

async.series([
  function(cb) {
    common.makePotatoRequest('potato.mysql.getInfo', {
      serverId: 'mysql-2',
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.getInfo', {
      serverId: ['mysql-1', 'mysql-2'],
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.getInfo', {
      serverId: '*',
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.getInfo', {
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.getInfo', {
      serverId: 'nullserver'
    }, cb)    
  },
],
function(err) {
  console.log('err=' + err)
})
