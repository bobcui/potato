var pomelo = require('pomelo')
var config = require('./app/utils/config')

var app = pomelo.createApp()
config.init(app.get('env'), {path: './config/config.json'})

app.registerBeforeStartupFunc(function(self, cb){  
  config.init(app.get('env'), {path: './config/config.json'})
  cb()
})
app.registerBeforeShutdownFunc(function(){
  config.fini()
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
    mysql.init(config)
    app.set('mysql', mysql, true)
    cb()
  })
  app.registerBeforeShutdownFunc(function(){
    mysql.fini()
  })
})

app.configure('all', 'redis', function(){
  app.set('name', 'redis')
})

app.start()

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack)
})
