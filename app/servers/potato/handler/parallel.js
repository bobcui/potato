module.exports = function(app) {
  return new Parallel(app);
}

var Parallel = function(app) {
  this.app = app
}

Parallel.prototype.find = function(msg, session, next) {
  next(null, {})
}
