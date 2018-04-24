var networks = {}

/*
 * Usage:
 * networks['1'] (direct access)
 * networks[networks['mainnetId']] (more readable, explicit)
 */
const MAINNET_ID = '1'
networks['mainnetId'] = MAINNET_ID
networks[MAINNET_ID] = require('./mainnet.js')

const ROPSTEN_ID = '3'
networks['ropstenId'] = ROPSTEN_ID
networks[ROPSTEN_ID] = require('./ropsten.js')

const RINKEBY_ID = '4'
networks['rinkebyId'] = RINKEBY_ID
networks[RINKEBY_ID] = require('./rinkeby.js')

const KOVAN_ID = '42'
networks['kovanId'] = KOVAN_ID
networks[KOVAN_ID] = require('./kovan.js')

module.exports = networks
