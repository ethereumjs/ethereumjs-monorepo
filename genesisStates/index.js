var genesisStates = {}
genesisStates['names'] = {}

genesisStates['names'][1] = 'mainnet'
genesisStates['names'][3] = 'ropsten'
genesisStates['names'][4] = 'rinkeby'
genesisStates['names'][42] = 'kovan'
genesisStates['names'][6284] = 'goerli'

genesisStates['mainnet'] = require('./mainnet.json')
genesisStates['ropsten'] = require('./ropsten.json')
genesisStates['rinkeby'] = require('./rinkeby.json')
genesisStates['kovan'] = require('./kovan.json')
genesisStates['goerli'] = require('./goerli.json')

module.exports = genesisStates
