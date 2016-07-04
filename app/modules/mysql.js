var _ = require('lodash')
var mysqlApi = require('mysql')
var logger = require('pomelo-logger').getLogger('mysql', __filename, 'pid:'+process.pid)
var fun = require('../utils/fun')
var Stats = require('../utils/stats')

module.exports = Mysql

function Mysql() {
}

Mysql.prototype.init = function(config) {
  this.config = config
  this.pool = mysqlApi.createPool(config.get('mysql'))
  this.stats = new Stats()

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

Mysql.prototype.fini = function(cb) {
  var config = this.config
  this.pool.end(function(err){
    if (!!err) {
      logger.error('mysql [%s@%s] fini error. error=[%s]', config.get('mysql').user, config.get('mysql').host, err.toString())
    }
    else {
      logger.debug('mysql fini [%s@%s]', config.get('mysql').user, config.get('mysql').host)
    }
    cb(null)
  })
}

Mysql.prototype.query = function(sql, values, timeout, cb) {
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

  var startTime = Date.now()
  var error = 0
  var warn = 0
  var self = this

  this.pool.query({
    sql: sql,
    values: values,
    timeout: timeout
  }, 
  function(err, rows, fields) {
    var timeUsed = Date.now() - startTime
    if (!!err) {
      error = 1
      logger.error('query error. sql=[%s] values=%j err=%j errmsg=[%s]', sql, values, err, err.toString())
    }
    if (self.config.get('mysql').needStats) {
      self.stats.add(sql, 1, error, warn, timeUsed)
    }
    fun.invokeCallback(cb, err, rows, fields)
  })
}

Mysql.prototype.getInfo = function() {
  return {
    connTotal: this.pool._allConnections.length,
    connFree: this.pool._freeConnections.length,
    connAcquired: this.pool._acquiringConnections.length,
    queryQueued: this.pool._connectionQueue.length
  }
}

Mysql.prototype.getStats = function() {
  return this.stats.get()
}

Mysql.prototype.resetStats = function() {
  return this.stats.reset()
}

Mysql.prototype._updateConfig = function() {
  var mysqlConfig = this.config.get('mysql')
  if (this.pool.config.connectionLimit < mysqlConfig.connectionLimit) {
    this.pool.config.connectionLimit = mysqlConfig.connectionLimit
  }
  this.pool.config.queueLimit = mysqlConfig.queueLimit
}
