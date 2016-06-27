var pomelo = require('pomelo')

var app = pomelo.createApp()

app.set('name', 'parallel-potato')

app.configure('all', 'potato', function(){
  app.set('connectorConfig', {
    connector : pomelo.connectors.httpconnector
  })
})

app.configure('all', 'mysql', function(){
})

app.configure('all', 'redis', function(){
})

app.start()

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack)
})
