const constants = require('./constants.js')

var parser = require('yargs')
  .option('networkid', {
    describe: 'Network ID (1=Mainnet, 3=Ropsten)',
    choices: constants.SUPPORTED_NETWORK_IDS,
    default: constants.DEFAULT_NETWORK_ID
  })
  .locale('en_EN')

module.exports = parser
