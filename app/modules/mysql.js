var _ = require('lodash')
var mysqlApi = require('mysql')
var logger = require('pomelo-logger').getLogger('mysql', __filename, 'pid:'+process.pid)
var fun = require('../utils/fun')

module.exports = Mysql

function Mysql() {
}

Mysql.prototype.init = function(config) {
  this.config = config
  this.pool = mysqlApi.createPool(config.get('mysql'))
  this.queryTotalStats = new MysqlQueryStats()
  this.queryStats = new MysqlQueryStats()

  var pool = this.pool
  pool.on('connection', function() {
    logger.debug('new connection. all=%d acquired=%d free=%d', 
      pool._allConnections.length, pool._acquiringConnections.length, pool._freeConnections.length)
  })
  pool.on('enqueue', function() {
    logger.debug('query enqueued. queue=%d connection=%d', pool._connectionQueue.length, pool._allConnections.length)
  })
  
  logger.debug('mysql init [%s@%s]', config.get('mysql').user, config.get('mysql').host)
}

Mysql.prototype.fini = function() {
  var config = this.config
  this.pool.end(function(err){
    if (!!err) {
      logger.error('mysql [%s@%s] fini error. error=[%s]', config.get('mysql').user, config.get('mysql').host, err.toString())
    }
    else {
      logger.debug('mysql fini [%s@%s]', config.get('mysql').user, config.get('mysql').host)
    }
  })
}

Mysql.prototype.query = function(sql, values, timeout, cb) {

  if (!sql) {
    console.log(argument)
    throw new Error()
  }

  // unshift if values not exists
  if (!_.isArray(values)) {
    cb = timeout
    timeout = values
    values = []
  }

  // unshift if timeout not exists
  if (_.isFunction(timeout)) {
    cb = timeout
    timeout = null
  }

  if (!_.isNumber(timeout)) {
    timeout = this.config.get('mysql').queryTimeout
  }

  this._updateConfig()

  var queryTotalStats = this.queryTotalStats
  var queryStats = this.queryStats
  queryTotalStats.incrCount()
  queryStats.incrCount()

  var startTime = Date.now()

  this.pool.query({
    sql: sql,
    values: values,
    timeout: timeout
  }, function(err, rows, fields) {
    var time = Date.now() - startTime
    queryTotalStats.statTime(time, sql, values)
    queryStats.statTime(time, sql, values)

    if (!!err) {      
      queryTotalStats.onError(err.code)
      queryStats.onError(err.code)
      logger.error('query error. sql=[%s] values=%j err=%j errmsg=[%s]', sql, values, err, err.toString())
    }
    fun.invokeCallback(cb, err, rows, fields)
  })
}

Mysql.prototype.getInfo = function() {
  var pool = this.pool
  return {
    connection: {
      total: pool._allConnections.length,
      free: pool._freeConnections.length,
      acquiring: pool._acquiringConnections.length,
      queue: pool._connectionQueue.length
    },
    queryTotal: this.queryTotalStats.getInfo(),
    query: this.queryStats.getInfo()
  }
}

Mysql.prototype.clearStats = function() {
  this.queryStats = new MysqlQueryStats()
}

Mysql.prototype._updateConfig = function() {
  var mysqlConfig = this.config.get('mysql')
  if (this.pool.config.connectionLimit < mysqlConfig.connectionLimit) {
    this.pool.config.connectionLimit = mysqlConfig.connectionLimit
  }
  this.pool.config.queueLimit = mysqlConfig.queueLimit
}

var MysqlQueryStats = function() {
  this.createTime = Date.now()
  this.count = 0
  this.error = {}
  this.timeTotal = 0
  this.timeMax = 0
  this.timeMaxSql = this.timeMaxValues = null
  this.timeMin = 0
}

MysqlQueryStats.prototype.incrCount = function() {
  this.count ++
}

MysqlQueryStats.prototype.onError = function(err) {
  if (_.isNil(this.error[err])) {
    this.error[err] = 1
  }
  else {
    this.error[err]++
  }
}

MysqlQueryStats.prototype.statTime = function(time, sql, values) {
  this.timeTotal += time
  if (time > this.timeMax) {
    this.timeMax = time
    this.timeMaxSql = sql
    this.timeMaxValues = values
  }
  if (time < this.timeMin) {
    this.timeMin = time
  }
}

MysqlQueryStats.prototype.getInfo = function() {
  return {
    statTime: Math.round((Date.now()-this.createTime)/1000),
    count: this.count,
    error: this.error,
    timeTotal: this.timeTotal,
    timeMin: this.timeMin,    
    timeMax: this.timeMax,
    timeMaxQuery: {sql: this.timeMaxSql, values: this.timeMaxValues},
    timeAve: Math.round(this.timeTotal / this.count)
  }
}
