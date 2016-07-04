module.exports = function(app) {
  return new Filter(app)
}

var Filter = function (app) {
  this.app = app
  this.logger = require('pomelo-logger').getLogger('rpc-log', __filename, 'pid:'+process.pid)  
}

Filter.prototype.name = 'rpcLog'

Filter.prototype.before = function(serverId, msg, opts, next) {
  opts = opts||{}
  opts.__startTime__ = Date.now()
  next()
}

Filter.prototype.after = function(serverId, msg, opts, next) {
  if(!!opts && !!opts.__startTime__) {
    var timeUsed = Date.now() - opts.__startTime__
    var route = [msg.serverType, msg.service, msg.method].join('.')
    var error = 0
    var warn = 0
    var logged = 0

    var log = {
      serverId: serverId,
      route: route,
      timeUsed: timeUsed
    }

    if (timeUsed > this.app.config.get('rpc').warnLogTime) {
      warn = logged = 1
      this.logger.warn(JSON.stringify(log))
    }

    if (!logged) {
      this.logger.debug(JSON.stringify(log)) 
    }

    if (this.app.config.get('rpc').needStats) {
      this.app.rpcStats.add(route, 1, error, warn, timeUsed)
    }
  }
  next();
};
