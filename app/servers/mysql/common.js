var _ = require('lodash')
var async = require('async')

var exp = module.exports

exp.query = function(mysql, sql, value, timeout, cb) {
  if (_.isEmpty(sql)) {
    cb(null, {err:'INVALID_PARAM_SQL'})
    return
  }

  if (!_.isArray(value)) {
    value = []
  }

  mysql.query(sql, value, timeout, function(err, result){
    if (!!err) {
      err = err.code
    }
    cb(null, {err:err, result:result})
  })
}

// values: {
//   key1: [values]
//   key2: ...
// }
// cb({
//   err:
//   result: {
//     key1: {
//       err:
//       results:
//     }
//     key2: ...
//   }
// })
exp.queryMultiValue = function(mysql, sql, values, timeout, cb) {
  if (_.isEmpty(values)) {
    cb(null, {err:'INVALID_PARAM_VALUES'})
    return
  }

  var funcs = {}
  _.each(values, function(value, key) {
    funcs[key] = function(cb) {
      exp.query(mysql, sql, value, timeout, cb)
    }
  })
  async.parallel(funcs, function(err, results){
    cb(null, {err:null, result:results})
  })
}

// sqls: {
//   sqlKey1: {
//     sql:
//     timeout: 
//     values: {
//       valueKey1: []
//       valueKey2: []
//     }
//   }
//   sqlKey2: {...}
// }
// cb({
//   err:
//   result: {
//     sqlKey1: {
//       valueKey1: {err, result}
//       valueKey2: {err, result}
//     }
//     sqlKey2: {...}
//   }
// })
exp.queryMultiSql = function(mysql, sqls, cb) {
  if (_.isEmpty(sqls)) {
    cb(null, {err:'INVALID_PARAM_SQLS'})
    return
  }

  var funcs = {}
  _.each(sqls, function(value, key) {
    funcs[key] = function(cb) {
      if (_.isEmpty(value.values) || _.isArray(value.values)) {
        exp.query(mysql, value.sql, value.values, value.timeout, cb)
      }
      else {
        exp.queryMultiValue(mysql, value.sql, value.values, value.timeout, function(err, result){
          cb(err, result.result)
        })
      }
    }
  })
  async.parallel(funcs, function(err, results){
    cb(null, {err:null, result:results})
  })
}
