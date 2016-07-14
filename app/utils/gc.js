var logger = require('pomelo-logger').getLogger('gc', __filename, 'pid:'+process.pid)

var exp = module.exports

var CHECK_SEC = 1
var config, timer

exp.init = function(opt) {
  config = opt
  var checkSec = config.get('gc').checkSec || CHECK_SEC
  if (global.gc) {
    timer = setInterval(check, checkSec*1000)
  }
  logger.debug('gc init')
}

exp.fini = function(cb) {
  if (timer) {
    clearInterval(timer)  
  }
  logger.debug('gc fini')
  cb(null)
}

var check = function() {
  var rss = process.memoryUsage().rss
  if (rss > config.get('gc').threshold) {
    var begin = Date.now()
    global.gc()
    var timeUse = Date.now() - begin
    var afterRss = process.memoryUsage().rss
    if (timeUse > config.get('gc').warnLogTime) {
      logger.warn('gc() invoked, mem %d -> %d , cost %d ms', rss, afterRss, timeUse)
    }
    else {
      logger.info('gc() invoked, mem %d -> %d , cost %d ms', rss, afterRss, timeUse)
    }
  }
}
