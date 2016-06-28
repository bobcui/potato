module.exports = function(app) {
  return new Handler(app)
}

var Handler = function(app) {
  this.app = app
}

Handler.prototype.query = function(req, session, cb) {
  this.app.rpc.mysql.remote.query(this.mysql, req.sql, req.values, req.timeout, cb)
}

Handler.prototype.queryMultiValue = function(req, session, cb) {
  this.app.rpc.mysql.remote.queryMultiValue(this.mysql, req.sql, req.values, req.timeout, cb)
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
