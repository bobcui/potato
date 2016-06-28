module.exports = function(app) {
  return new Remote(app)
}

var Remote = function(app) {
  this.app = app
  this.mysql = app.mysql
}

Remote.prototype.query = function(ids, cb) {
  cb(null, {})
}
