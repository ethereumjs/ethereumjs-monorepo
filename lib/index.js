const { randomBytes } = require('crypto')
const Logger = require('./logging.js')
const EthNetworkManager = require('./net/EthNetworkManager.js')
const c = require('./constants.js')

function runClient () {
  const cliParser = require('./cliParser.js')
  const config = cliParser.getClientConfig()
  config.logger = Logger.getLogger(config)

  const logger = config.logger
  logger.info('ethereumjs-client initialized')
  logger.info('Connecting to the %s network', c.NETWORK_ID_CNAMES[config.networkid])

  const PRIVATE_KEY = randomBytes(32)
  var nm = new EthNetworkManager(PRIVATE_KEY, config)
  nm.startNetworking()
}

runClient()
