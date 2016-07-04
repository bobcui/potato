module.exports = function(app) {
  return new Handler(app)
}

var Handler = function(app) {
  this.app = app
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
