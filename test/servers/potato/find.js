var http = require('http')
var argv = require('optimist').argv

var server = argv.s || argv.server || '127.0.0.1:14001'
var ids = argv.i || argv.ids || '[1,2]'

var host = server.split(':')[0], port = server.split(':')[1]
var ids = JSON.parse(ids)

var req = http.request({
  hostname: host,
  port: port,
  method: 'POST'
}, function(res){
  res.on('data', function(body) {
    console.log('res: ' + body);
  })
})

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
})

var reqBody = JSON.stringify({
  id: 1,
  route: 'potato.parallel.find',
  body: {
    ids: ids
  }
})

console.log('req: ' + reqBody)
req.write(reqBody)

req.end()

