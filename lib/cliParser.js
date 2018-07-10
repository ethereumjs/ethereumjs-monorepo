const c = require('./constants.js')

var parser = require('yargs')
  .option('networkid', {
    describe: 'Network ID (1=Mainnet, 3=Ropsten, 4=Rinkeby)',
    choices: c.SUPPORTED_NETWORK_IDS,
    default: c.DEFAULT_NETWORK_ID
  })
  .option('loglevel', {
    describe: 'Verbosity of logging output (error, warn, info, debug)',
    choices: c.SUPPORTED_LOG_LEVELS,
    default: c.DEFAULT_LOG_LEVEL
  })
  .option('rpc', {
    describe: 'Enable the JSON-RPC server'
  })
  .option('rpcport', {
    describe: 'HTTP-RPC server listening port',
    default: c.DEFAULT_RPC_PORT
  })
  .option('rpcaddr', {
    describe: 'HTTP-RPC server listening interface',
    default: c.DEFAULT_RPC_ADDR
  })
  .locale('en_EN')

parser.getClientConfig = function () {
  var config = Object.assign({}, parser.argv)
  delete config._
  delete config.help
  delete config.$0

  return config
}

module.exports = parser
