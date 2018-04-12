const ms = require('ms')
const devp2p = require('ethereumjs-devp2p')

class NetworkManager {
  constructor (privateKey, config, capabilities) {
    this._config = config
    this._logger = config.logger
    this._bootnodes = this.getBootnodes(config)

    // DPT
    this._dpt = new devp2p.DPT(privateKey, {
      refreshInterval: 30000,
      endpoint: {
        address: '0.0.0.0',
        udpPort: null,
        tcpPort: null
      }
    })

    this._dpt.on('error', (err) => {
      this._logger.error(`DPT error: ${err}`)
    })

    // RLPx
    this._rlpx = new devp2p.RLPx(privateKey, {
      dpt: this._dpt,
      maxPeers: 25,
      capabilities: capabilities,
      listenPort: null
    })

    this._rlpx.on('error', (err) => {
      this._logger.error(`RLPx error: ${err.stack || err}`)
    })

    setInterval(() => {
      const peersCount = this._dpt.getPeers().length
      const openSlots = this._rlpx._getOpenSlots()
      const queueLength = this._rlpx._peersQueue.length
      const queueLength2 = this._rlpx._peersQueue.filter((o) => o.ts <= Date.now()).length

      this._logger.info(`Total nodes in DPT: ${peersCount}, open slots: ${openSlots}, queue: ${queueLength} / ${queueLength2}`)
    }, ms('30s'))
  }

  startNetworking () {
    this._logger.info('Started p2p networking communication')
    for (let bootnode of this._bootnodes) {
      this._dpt.bootstrap(bootnode).catch((err) => {
        this._logger.error(`DPT bootstrap error: ${err.stack || err}`)
      })
    }
  }

  getBootnodes (config) {
    return require('ethereum-common').bootstrapNodes.filter((node) => {
      return node.chainId === config.networkid
    }).map((node) => {
      return {
        address: node.ip,
        udpPort: node.port,
        tcpPort: node.port
      }
    })
  }
}

module.exports = NetworkManager
