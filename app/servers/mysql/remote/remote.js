var common = require('../common')

module.exports = function(app) {
  return new Remote(app)
}

var Remote = function(app) {
  this.app = app
  this.mysql = app.mysql
}

Remote.prototype.query = function(sql, values, timeout, cb) {
  common.query(this.mysql, sql, values, timeout, cb)
}

Remote.prototype.queryMultiValue = function(sql, values, timeout, cb) {
  common.queryMultiValue(this.mysql, sql, values, timeout, cb)
}

Remote.prototype.queryMultiSql = function(sqls, cb) {
  common.queryMultiSql(this.mysql, sqls, cb)
}

Remote.prototype.getInfo = function(req, cb) {
  cb(null, this.mysql.getInfo())
}

Remote.prototype.clearStats = function(req, cb) {
  this.mysql.clearStats()
  cb()
}
