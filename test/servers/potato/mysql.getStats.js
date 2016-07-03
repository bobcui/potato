var async = require('async')
var common = require('../common')

async.series([
  function(cb) {
    common.makePotatoRequest('potato.mysql.getStats', {
      serverId: 'mysql-2',
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.getStats', {
      serverId: ['mysql-1', 'mysql-2'],
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.getStats', {
      serverId: '*',
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.getStats', {
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.getStats', {
      serverId: 'nullserver'
    }, cb)    
  },
],
function(err) {
  console.log('err=' + err)
})
