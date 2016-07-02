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
  if (_.isEmpty(req.serverId)) {
    cb(null, {err:'INVALID_PARAM_SERVERID'})
    return
  }

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
//   err:
//   result: {
//     key1: {
//       err:
//       result:
//     }
//     key2: ...
//   }
// }
Handler.prototype.queryMultiValue = function(req, session, cb) {
  var app = this.app,
    sql = req.sql,
    timeout = req.timeout,
    values = req.values || {},
    serverIds = req.serverIds,
    serverValues = {}

  if (_.isEmpty(serverIds)) {
    cb(null, {err:'INVALID_PARAM_SERVERID'})
    return    
  }

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
    serverValues[serverId][key] = values[key] || []
  })

  var funcs = {}
  _.each(serverValues, function(serverValue, serverId){
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

// req: {
//   sqls: {
//     sqlKey1: {
//       sql:
//       timeout:
//       values: {
//         vKey1: []
//         vKey2: ...
//       }
//       serverIds: {
//         vKey1: serverId
//         vKey2: ...          
//       }
//     }
//     sqlKey2: ...
//   }
// }
// cb: {
//   err:
//   result: {
//     sqlKey1: {
//       vKey1: {err:, result:}
//       vKey2: ...
//     }
//     sqlKey2: ...
//   }
// }
// 
Handler.prototype.queryMultiSql = function(req, session, cb) {
  if (_.isEmpty(req.sqls)) {
    cb(null, {err:'INVALID_PARAM_SQLS'})
    return    
  }

  var app = this.app

  // serverSqls: {
  //   serverId1: {
  //     sqlKey1: {
  //       sql: 
  //       timeout:
  //       values: {
  //         vKey1: [],
  //         vKey2: ...
  //       }
  //     }
  //     sqlKey2: ...
  //   }
  //   serverId2: ...
  // }
  var serverSqls = {}
  _.each(req.sqls, function(sqlValue, sqlKey){
    _.each(sqlValue.serverIds, function(serverId, vKey){
      if (_.isNil(serverSqls[serverId])) {
        serverSqls[serverId] = {}
      }
      if (_.isNil(serverSqls[serverId][sqlKey])) {
        serverSqls[serverId][sqlKey] = {
          sql: sqlValue.sql,
          timeout: sqlValue.timeout,
          values: {}
        }
      }
      if (!_.isNil(sqlValue.values)) {
        serverSqls[serverId][sqlKey].values[vKey] = sqlValue.values[vKey]
      }
    })
  })

  var funcs = {}
  _.each(serverSqls, function(sqls, serverId){
    funcs[serverId] = function(callback) {
      app.rpc.mysql.remote.queryMultiSql.toServer(serverId, sqls, function(err, result){
        if (!!err) {
          logger.error('mysql.remote.queryMultiSql error. serverId=%s err=%s', serverId, err.stack)
          result = {}
          _.each(sqls[serverId], function(sqlValue, sqlKey){
            result[sqlKey] = {}
            _.each(sqlValue, function(value, valueKey){
              result[sqlKey][valueKey] = {err:'INTERNAL_SERVER_ERROR'}
            })
          })
        }
        callback(null, result)
      })
    }
  })

  async.parallel(funcs, function(err, results){
    var finalResults = {}
    _.each(results, function(result){
      finalResults = _.merge(finalResults, result)
    })
    cb(null, finalResults)
  })
}

Handler.prototype.getInfo = function(req, session, cb) {
  if (_.isEmpty(req.serverId)) {
    cb(null, {err:'INVALID_PARAM_SERVERID'})
    return    
  }

  var app = this.app
  var serverId = req.serverId
  var funcs = {}

  if (!_.isArray(serverId)) {
    if (serverId === '*') {
      serverId = []
      _.each(app.getServersByType('mysql'), function(mysql){
          serverId.push(mysql.id)
      })
    }
    else {
      serverId = [serverId]
    }
  }

  _.each(serverId, function(sId){
    funcs[sId] = function(callback){
      app.rpc.mysql.remote.getInfo.toServer(sId, {}, function(err, result){
        if (!!err) {
          logger.error('mysql.remote.getInfo error. serverId=%s err=%s', serverId, err.stack)
          result = {}
        }        
        callback(null, result)
      })
    }
  })

  async.parallel(funcs, cb)
}

Handler.prototype.getStats = function(req, session, cb) {
  if (_.isEmpty(req.serverId)) {
    cb(null, {err:'INVALID_PARAM_SERVERID'})
    return    
  }

  var app = this.app
  var serverId = req.serverId
  var funcs = {}

  if (!_.isArray(serverId)) {
    if (serverId === '*') {
      serverId = []
      _.each(app.getServersByType('mysql'), function(mysql){
          serverId.push(mysql.id)
      })
    }
    else {
      serverId = [serverId]
    }
  }

  _.each(serverId, function(sId){
    funcs[sId] = function(callback){
      app.rpc.mysql.remote.getStats.toServer(sId, {}, function(err, result){
        if (!!err) {
          logger.error('mysql.remote.getStats error. serverId=%s err=%s', serverId, err.stack)
          result = {}
        }        
        callback(null, result)
      })
    }
  })

  async.parallel(funcs, cb)
}

Handler.prototype.clearStats = function(req, session, cb) {
  if (_.isEmpty(req.serverId)) {
    cb(null, {err:'INVALID_PARAM_SERVERID'})
    return    
  }

  var app = this.app
  var serverId = req.serverId
  var funcs = {}

  if (!_.isArray(serverId)) {
    if (serverId === '*') {
      serverId = []
      _.each(app.getServersByType('mysql'), function(mysql){
          serverId.push(mysql.id)
      })
    }
    else {
      serverId = [serverId]
    }
  }

  _.each(serverId, function(sId){
    funcs[sId] = function(callback){
      app.rpc.mysql.remote.clearStats.toServer(sId, {}, function(err, result){
        if (!!err) {
          logger.error('mysql.remote.clearStats error. serverId=%s err=%s', serverId, err.stack)
          result = false
        }        
        callback(null, result)
      })
    }
  })

  async.parallel(funcs, cb)
}
