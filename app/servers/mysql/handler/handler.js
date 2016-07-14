var common = require('../common')

module.exports = function(app) {
  return new Handler(app)
}

var Handler = function(app) {
  this.app = app
  this.mysql = app.mysql
}

Handler.prototype.query = function(req, session, cb) {
  cb(null, {})
  return
  common.query(this.mysql, req.sql, req.values, req.timeout, cb)
}

Handler.prototype.queryMultiValue = function(req, session, cb) {
  common.queryMultiValue(this.mysql, req.sql, req.values, req.timeout, cb)
}

Handler.prototype.queryMultiSql = function(req, session, cb) {
  common.queryMultiSql(this.mysql, req.sqls, cb)
}

Handler.prototype.getMysqlInfo = function(req, session, cb) {
  cb(null, this.mysql.getInfo())
}

Handler.prototype.getMysqlStats = function(req, session, cb) {
  cb(null, this.mysql.getStats())
}

Handler.prototype.resetMysqlStats = function(req, session, cb) {
  cb(null, this.mysql.resetStats())
}

Handler.prototype.getHandlerStats = function(req, session, cb) {
  cb(null, this.app.handlerStats.get())
}

Handler.prototype.resetHandlerStats = function(req, session, cb) {
  cb(null, this.app.handlerStats.reset())
}

Handler.prototype.getRpcStats = function(req, session, cb) {
  cb(null, this.app.rpcStats.get())
}

Handler.prototype.resetRpcStats = function(req, session, cb) {
  cb(null, this.app.rpcStats.reset())
}
