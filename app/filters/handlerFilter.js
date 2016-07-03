module.exports = function(app) {
  return new Filter(app)
}

var Filter = function(app) {
  this.app = app
  this.logger = require('pomelo-logger').getLogger('handler-log', __filename, 'pid:'+process.pid)
}

Filter.prototype.before = function(msg, session, next) {
  session.__startTime__ = Date.now()
  next()
}

Filter.prototype.after = function(err, msg, session, resp, next) {
  var start = session.__startTime__
  var timeUsed = -1
  if (typeof start === 'number') {
    timeUsed = Date.now() - start
  }

  var code = (resp === undefined) ? undefined : resp.code
  var log = {
    route: msg.__route__,
    req: msg,
    res: resp,
    remote: this.app.sessionService.getClientAddressBySessionId(session.id),
    timeUsed: timeUsed,
    code: code
  }

  var error = 0
  var warn = 0
  var logged = 0

  if (!!err) {
    error = logged = 1
    this.logger.error('%s err=%s stack=%j', JSON.stringify(log), err, err.stack)
  }
  else if(!!resp.code) {
    error = logged = 1
    this.logger.error(JSON.stringify(log))
  }
  
  if (timeUsed > this.app.config.get('handlerWarnLogTime')) {
    warn = logged = 1
    this.logger.warn(JSON.stringify(log))
  }

  if (!logged) {
    this.logger.debug(JSON.stringify(log))
  }

  this.app.handlerStats.add(msg.__route__, 1, error, warn, timeUsed)

  next(err)
}
