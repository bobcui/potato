var http = require('http')

module.exports.log = true

module.exports.makeHttpRequest = function(host, port, route, body, cb) {
  var req = http.request({
    hostname: host,
    port: port,
    method: 'POST',
  }, function(res){
    res.on('data', function(body) {
      if (module.exports.log) {
        console.log('res: ' + body)
      }
      if (!!cb) {
        cb(null)
      }
    })
  })

  req.on('error', function(e) {
    if (1||module.exports.log) {
      console.log('problem with request: ' + e.message)
    }
    if (!!cb) {
      cb(new Error())
    }
  })

  var reqBody = JSON.stringify({
    id: 1,
    route: route,
    body: body
  })

  if (module.exports.log) {
    console.log('req: ' + reqBody)
  }
  req.write(reqBody)

  req.end()
}

module.exports.makePotatoRequest = function(route, body, cb) {
  module.exports.makeHttpRequest('127.0.0.1', 13010, route, body, cb)
}

module.exports.makeMysqlRequest = function(route, body, cb) {
  module.exports.makeHttpRequest('127.0.0.1', 13020, route, body, cb)
}
