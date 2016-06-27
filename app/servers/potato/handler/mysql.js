module.exports = function(app) {
  return new Parallel(app);
}

var Parallel = function(app) {
  this.app = app
}

Mysql.prototype.query = function(msg, session, next) {
  next(null, msg)
}
