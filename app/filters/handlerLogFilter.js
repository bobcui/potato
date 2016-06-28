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

  var logString = JSON.stringify(log)
  if (!!err) {
    this.logger.error('%s err=%s stack=%j', logString, err, err.stack)
  }
  else if(!!resp.code) {
    this.logger.error(logString)
  }
  else if (timeUsed > this.app.config.get('handlerWarnLogTime')) {
    this.logger.warn(logString)
  }
  else {
    this.logger.debug(logString)
  }

  next(err)
}