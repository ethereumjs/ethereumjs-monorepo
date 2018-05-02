var networks = {}
networks['names'] = {}

let availableNetworks = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan'
}

function addNetworkParams (id, name) {
  networks['names'][id] = name
  networks[name] = require(`./${name}.json`)
}

for (let key in availableNetworks) {
  addNetworkParams(key, availableNetworks[key])
}

module.exports = networks
