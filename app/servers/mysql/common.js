var _ = require('lodash')
var async = require('async')

var exp = module.exports

exp.query = function(mysql, sql, value, timeout, cb) {
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
//   key: [values]
// }
// cb({
//   key: {
//     err:
//     results:
//   }
// })
exp.queryMultiValue = function(mysql, sql, values, timeout, cb) {
  var funcs = {}
  _.each(values, function(value, key) {
    funcs[key] = function(cb) {
      exp.query(mysql, sql, value, timeout, cb)
    }
  })
  async.parallel(funcs, function(err, results){
    cb(null, results)
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
//   sqlKey1: {
//     valueKey1: {err, result}
//     valueKey2: {err, result}
//   }
//   sqlKey2: {...}
// })
exp.queryMultiSql = function(mysql, sqls, cb) {
  var funcs = {}
  _.each(sqls, function(value, key) {
    funcs[key] = function(cb) {
      if (_.isNil(value.values) || _.isArray(value.values)) {
        exp.query(mysql, value.sql, value.values, value.timeout, cb)
      }
      else {
        exp.queryMultiValue(mysql, value.sql, value.values, value.timeout, cb)
      }
    }
  })
  async.parallel(funcs, function(err, results){
    cb(null, results)
  })
}
