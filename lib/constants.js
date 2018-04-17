const common = require('ethereum-common')

const c = {}

// Chain constants
c.MAINNET_NETWORK_ID = 1
c.ROPSTEN_NETWORK_ID = 3
c.RINKEBY_NETWORK_ID = 4

c.SUPPORTED_NETWORK_IDS = [
  c.MAINNET_NETWORK_ID,
  c.ROPSTEN_NETWORK_ID,
  c.RINKEBY_NETWORK_ID
]

c.NETWORK_ID_CNAMES = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby'
}

c.DEFAULT_NETWORK_ID = c.MAINNET_NETWORK_ID

c.common = common

module.exports = c
