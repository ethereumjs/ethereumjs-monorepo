var chains = {}
chains['names'] = {}

let availableChains = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan'
}

function addChainParams (id, name) {
  chains['names'][id] = name
  chains[name] = require(`./${name}.json`)
}

for (let key in availableChains) {
  addChainParams(key, availableChains[key])
}

module.exports = chains
