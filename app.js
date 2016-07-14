var pomelo = require('pomelo')
var app = pomelo.createApp()

app.configure(function(){
  var config = require('./app/utils/config')
  config.init(app.get('env'), {path: './config/config.json'})
  app.registerBeforeShutdownFunc(function(self, cb){
    config.fini(cb)
  })

  var gc = require('./app/utils/gc')
  gc.init(config)
  app.registerBeforeShutdownFunc(function(self, cb){
    gc.fini(cb)
  })

  app.set('config', config, true)
  app.set('ssh_config_params', config.get('sshParams'))

  app.set('proxyConfig', {
    timeout: 10000,
    // bufferMsg: true,
    // interval: 30
  })
  app.set('remoteConfig', {
    // bufferMsg: true,
    // interval: 30,
    // 
    // in experiment
    // handleEnqueue: false,  
    // handleInterval: 30,
    // handleCountOnce: 300,
    // msgMaxPriority: 5
  })
  app.set('serverConfig', {
    // // in experiment
    // handleEnqueue: false,        
    // handleInterval: 30,
    // handleCountOnce: 300
  })

  var Stats = require('./app/utils/stats')
  app.set('handlerStats', new Stats(), true)
  app.set('rpcStats', new Stats(), true)

  var handlerFilter = require('./app/filters/handlerFilter')
  app.filter(handlerFilter(app))

  var rpcFilter = require('./app/filters/rpcFilter')
  app.rpcFilter(rpcFilter(app))
})

app.configure('all', 'potato', function(){
  app.set('name', 'potato')
  app.set('connectorConfig', {
    connector : pomelo.connectors.httpconnector
  })
})

app.configure('all', 'mysql', function(){
  app.set('name', 'mysql')
  app.set('connectorConfig', {
    connector : pomelo.connectors.httpconnector
  })

  app.registerBeforeStartupFunc(function(self, cb){
    var MysqlClass = require('./app/modules/mysql')
    var mysql = new MysqlClass()
    mysql.init(self.config)
    app.set('mysql', mysql, true)
    cb(null)
  })
  app.registerBeforeShutdownFunc(function(self, cb){
    self.mysql.fini(cb)
  })
})

app.start()

process.on('uncaughtException', function (err) {
  console.error('uncaughtException err=%j stack=%s', err, err.stack)
})
