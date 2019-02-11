const jayson = require('jayson')
const Common = require('ethereumjs-common').default

const Manager = require('../../lib/rpc')
const Logger = require('../../lib/logging')
const blockChain = require('./blockChainStub.js')
const Chain = require('../../lib/blockchain/chain.js')

const config = { loglevel: 'error' }
config.logger = Logger.getLogger(config)

module.exports = {
  startRPC (methods, port = 3000) {
    const server = jayson.server(methods)
    const httpServer = server.http()
    httpServer.listen(port)
    return httpServer
  },

  closeRPC (server) {
    server.close()
  },

  createManager (node) {
    return new Manager(node, config)
  },

  createNode (nodeConfig) {
    const chain = new Chain({ blockchain: blockChain({}) })
    chain.opened = true
    const defaultNodeConfig = { blockchain: chain, opened: true, commonChain: new Common('mainnet'), ethProtocolVersions: [63] }
    const trueNodeConfig = { ...defaultNodeConfig, ...nodeConfig }
    return {
      services: [
        {
          name: 'eth',
          chain: trueNodeConfig.blockchain,
          pool: { peers: [1, 2, 3] },
          protocols: [{
            name: 'eth',
            versions: trueNodeConfig.ethProtocolVersions
          }]
        }
      ],
      common: trueNodeConfig.commonChain,
      opened: trueNodeConfig.opened
    }
  }
}
