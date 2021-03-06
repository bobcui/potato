var fs = require('fs')
var logger = require('pomelo-logger').getLogger('config', __filename, 'pid:'+process.pid)

var exp = module.exports

var CONFIG_PATH = '../../config/config.json'
var CHECK_SEC = 1

var config = {},
  path,
  mtime,
  env,
  timer

exp.init = function(environment, opts) {
  env = environment
  opts = opts || {}
  path = opts.path || CONFIG_PATH
  var checkSec = opts.checkSec || CHECK_SEC

  mtime = fs.statSync(path).mtime.getTime()
  config = JSON.parse(fs.readFileSync(path))
  config = config[env]
  if (!config) {
    throw new Error('load config file '+ path + ' failed env=' + env)
  }

  timer = setInterval(check, checkSec*1000)
  logger.debug('config init file=%s mtime=%s env=%s', path, mtime, env)
}

exp.fini = function(cb) {
  logger.debug('config fini')
  clearInterval(timer)
  cb(null)
}

exp.get = function(property) {
  return config[property]
}

var check = function() {
  fs.stat(path, function(err, stats){
    if (!!err) {
      logger.error('stat config file %s fail err=%s', path, err.stack)
    }
    else {
      var nowMTime = stats.mtime.getTime()
      if (nowMTime !== mtime) {
        mtime = nowMTime
        reload()
      }
    }
  })
}

var reload = function() {
  fs.readFile(path, function(err, data) {
    if (!!err) {
      logger.error('read config file %s fail err=%s', path, err.stack)
    }
    else {
      try {
        config = JSON.parse(data)
        config = config[env]
        if (!config) {
          throw new Error('reload config is null')
        }
        logger.debug('reload config file %s mtime=%s env=%s', path, mtime, env)
      }
      catch (e) {
        logger.error('reload config file %s failed mtime=%s env=%s err=%s', path, mtime, env, e.stack)
      }
    }
  })
}
