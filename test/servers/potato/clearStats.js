var async = require('async')
var common = require('../common')

async.series([
  function(cb) {
    common.makePotatoRequest('potato.mysql.clearStats', {
      serverId: 'mysql-2',
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.clearStats', {
      serverId: ['mysql-1', 'mysql-2'],
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.clearStats', {
      serverId: '*',
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.clearStats', {
    }, cb)    
  },
  function(cb) {
    common.makePotatoRequest('potato.mysql.clearStats', {
      serverId: 'nullserver'
    }, cb)    
  },
],
function(err) {
  console.log('err=' + err)
})
