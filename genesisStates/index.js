var genesisStates = {}
genesisStates['names'] = {}

genesisStates['names'][1] = 'mainnet'
genesisStates['names'][3] = 'ropsten'
genesisStates['names'][4] = 'rinkeby'
genesisStates['names'][42] = 'kovan'

genesisStates['mainnet'] = require('./mainnet.json')
genesisStates['ropsten'] = require('./ropsten.json')
genesisStates['rinkeby'] = require('./rinkeby.json')
genesisStates['kovan'] = require('./kovan.json')

module.exports = genesisStates
