const { randomBytes } = require('crypto')
const Common = require('ethereumjs-common')
const Logger = require('./logging.js')
const EthNetworkManager = require('./net/EthNetworkManager.js')
const ChainManager = require('./chain/ChainManager.js')

function runClient () {
  const cliParser = require('./cliParser.js')
  const config = cliParser.getClientConfig()
  config.logger = Logger.getLogger(config)
  config.common = new Common(config.networkid)

  // TODO: Make this configurable by CL option
  // TODO: This is a rough first try, the concept for directory structure should be thought through more thorougly
  config.datadir = `./chaindb/${config.common.chainName()}`

  const logger = config.logger
  logger.info('ethereumjs-client initialized')
  logger.info('Connecting to the %s network', config.common.chainName())

  const PRIVATE_KEY = randomBytes(32)
  var nm = new EthNetworkManager(PRIVATE_KEY, config)

  var cm = new ChainManager(config, nm) // eslint-disable-line
}

runClient()
