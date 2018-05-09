var chains = {}
chains['names'] = {}

chains['names'][1] = 'mainnet'
chains['names'][3] = 'ropsten'
chains['names'][4] = 'rinkeby'
chains['names'][42] = 'kovan'

chains['mainnet'] = require('./mainnet.json')
chains['ropsten'] = require('./ropsten.json')
chains['rinkeby'] = require('./rinkeby.json')
chains['kovan'] = require('./kovan.json')

module.exports = chains
