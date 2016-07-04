var common = require('../common')
common.makeMysqlRequest('mysql.handler.getMysqlStats')
common.makeMysqlRequest('mysql.handler.getHandlerStats')
common.makeMysqlRequest('mysql.handler.getRpcStats')