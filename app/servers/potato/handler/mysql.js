var _ = require('lodash')
var async = require('async')
var logger = require('pomelo-logger').getLogger('potato', __filename, 'pid:'+process.pid)

module.exports = function(app) {
  return new Handler(app)
}

var Handler = function(app) {
  this.app = app
}

Handler.prototype.query = function(req, session, cb) {
  this.app.rpc.mysql.remote.query.toServer(req.serverId, req.sql, req.values, req.timeout, function(err, result){
    if (!!err) {
      logger.error('mysql.remote.query error. serverId=%s err=%s', req.serverId, err.stack)
      cb(null, {err:'INTERNAL_SERVER_ERROR'})
    }
    else {
      cb(null, {err:null, result:result})
    }
  })
}

// req: {
//   sql:
//   timeout:
//   values: {
//     key: []
//   }
//   serverIds: {
//     key: serverId
//   }
// }
// res: {
//   key1: {
//     err:
//     result:
//   }
//   key2: ...
// }
Handler.prototype.queryMultiValue = function(req, session, cb) {
  var app = this.app,
    sql = req.sql,
    timeout = req.timeout,
    values = req.values,
    serverIds = req.serverIds,
    serverValues = {}


  // serverValues: {
  //   serverId1: {
  //     key1: values1
  //     key2: values2
  //   }
  //   serverId2: ...
  // }
  _.each(serverIds, function(serverId, key){
    if (_.isNil(serverValues[serverId])) {
      serverValues[serverId] = {}
    }    
    serverValues[serverId][key] = values[key]
  })

  var funcs = {}
  _.each(serverValues, function(serverId, serverValue){
    funcs[serverId] = function(callback) {
      app.rpc.mysql.remote.queryMultiValue.toServer(serverId, sql, serverValue, timeout, function(err, result){
        if (!!err) {
          logger.error('mysql.remote.queryMultiValue error. serverId=%s err=%s', serverId, err.stack)
          result = {}
          _.each(serverValue, function(v, k){
            result[k] = {err:'INTERNAL_SERVER_ERROR'}
          })
        }
        callback(null, result)
      })
    }
  })

  // results: {
  //   serverId1: {
  //     key: {
  //       err: 
  //       result:
  //     }
  //   },
  //   serverId2
  // }
  async.parallel(funcs, function(err, results){
    var finalResults = {}
    _.each(results, function(result){
      finalResults = _.merge(finalResults, result)
    })
    cb(null, finalResults)
  })
}

Handler.prototype.queryMultiSql = function(req, session, cb) {
  this.app.rpc.mysql.remote.queryMultiSql(this.mysql, req.sqls, cb)
}

Handler.prototype.getInfo = function(req, session, cb) {
  this.app.rpc.mysql.remote.getInfo(req, cb)
}

Handler.prototype.clearStats = function(req, session, cb) {
  this.app.rpc.mysql.remote.clearStats(req, cb)
}
