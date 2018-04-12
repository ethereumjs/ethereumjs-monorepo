const devp2p = require('ethereumjs-devp2p')
const NetworkManager = require('./NetworkManager.js')

class EthNetworkManager extends NetworkManager {
  constructor (privateKey, config) {
    const capabilities = [
      devp2p.ETH.eth63,
      devp2p.ETH.eth62
    ]
    super(privateKey, config, capabilities)
  }
}

module.exports = EthNetworkManager
