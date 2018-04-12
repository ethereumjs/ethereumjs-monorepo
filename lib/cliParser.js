const c = require('./constants.js')

var parser = require('yargs')
  .option('networkid', {
    describe: 'Network ID (1=Mainnet, 3=Ropsten, 4=Rinkeby)',
    choices: c.SUPPORTED_NETWORK_IDS,
    default: c.DEFAULT_NETWORK_ID
  })
  .option('loglevel', {
    describe: 'Verbosity of logging output (error, warn, info, debug)',
    choices: ['error', 'warn', 'info', 'debug'],
    default: 'info'
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
