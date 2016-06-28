var http = require('http')

module.exports.makeHttpRequest = function(host, port, route, body, cb) {
  var req = http.request({
    hostname: host,
    port: port,
    method: 'POST'
  }, function(res){
    res.on('data', function(body) {
      console.log('res: ' + body)
      if (!!cb) {
        cb(null)
      }
    })
  })

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message)
    if (!!cb) {
      cb(new Error())
    }
  })

  var reqBody = JSON.stringify({
    id: 1,
    route: route,
    body: body
  })

  console.log('req: ' + reqBody)
  req.write(reqBody)

  req.end()
}

module.exports.makeMysqlRequest = function(route, body, cb) {
  module.exports.makeHttpRequest('127.0.0.1', 13011, route, body, cb)
}