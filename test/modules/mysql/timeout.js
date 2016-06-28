var config = require('../../../app/utils/config')
var Mysql = require('../../../app/modules/mysql')

config.init('development', {path: '../../../config/config.json'})

var mysql = new Mysql
mysql.init(config)

mysql.query('select sleep(1)', 100, function(err, result){
  console.log('err=%j', err)
  console.log('result=%j', result)

  mysql.fini()
  config.fini()
})
