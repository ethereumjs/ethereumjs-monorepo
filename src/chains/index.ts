var chains = {}
chains['names'] = {}

chains['names'][1] = 'mainnet'
chains['names'][3] = 'ropsten'
chains['names'][4] = 'rinkeby'
chains['names'][42] = 'kovan'
chains['names'][6284] = 'goerli'

chains['mainnet'] = require('./mainnet.json')
chains['ropsten'] = require('./ropsten.json')
chains['rinkeby'] = require('./rinkeby.json')
chains['kovan'] = require('./kovan.json')
chains['goerli'] = require('./goerli.json')

module.exports = chains
