module.exports = function(app) {
  return new Remote(app)
}

var Remote = function(app) {
  this.app = app
}

Remote.prototype.find = function(ids, cb) {
  cb(null, {})
}
