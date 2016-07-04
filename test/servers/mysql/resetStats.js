var common = require('../common')
common.makeMysqlRequest('mysql.handler.resetMysqlStats')
common.makeMysqlRequest('mysql.handler.resetHandlerStats')
common.makeMysqlRequest('mysql.handler.resetRpcStats')