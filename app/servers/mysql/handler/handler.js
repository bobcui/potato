var common = require('../common')

module.exports = function(app) {
  return new Handler(app)
}

var Handler = function(app) {
  this.app = app
  this.mysql = app.mysql
}

Handler.prototype.query = function(req, session, cb) {
  common.query(this.mysql, req.sql, req.values, req.timeout, cb)
}

Handler.prototype.queryMultiValue = function(req, session, cb) {
  common.queryMultiValue(this.mysql, req.sql, req.values, req.timeout, cb)
}

Handler.prototype.queryMultiSql = function(req, session, cb) {
  common.queryMultiSql(this.mysql, req.sqls, cb)
}

Handler.prototype.getInfo = function(req, session, cb) {
  cb(null, this.mysql.getInfo())
}

Handler.prototype.clearStats = function(req, session, cb) {
  this.mysql.clearStats()
  cb()
}
