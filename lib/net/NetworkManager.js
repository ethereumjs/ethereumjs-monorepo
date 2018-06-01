const ms = require('ms')
const Block = require('ethereumjs-block')
const Header = require('ethereumjs-block/header')
const devp2p = require('ethereumjs-devp2p')

const REMOTE_CLIENTID_FILTER = ['go1.5', 'go1.6', 'go1.7', 'quorum', 'pirl', 'ubiq', 'gmc', 'gwhale', 'prichain']

const REFRESH_INTERVAL = ms('15s')
const BLOCKS_PER_REQUEST = 25

class NetworkManager {
  constructor (privateKey, config, capabilities) {
    this._config = config
    this._logger = config.logger
    this._bootnodes = this._getBootnodes(config)
    this._requests = { headers: {}, headerRequestStarts: {}, blocks: {} }

    // DPT
    this._dpt = new devp2p.DPT(privateKey, {
      refreshInterval: REFRESH_INTERVAL,
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
      remoteClientIdFilter: REMOTE_CLIENTID_FILTER,
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
    }, REFRESH_INTERVAL)
  }

  _getPeerAddr (peer) {
    return `${peer._socket.remoteAddress}:${peer._socket.remotePort}`
  }

  _sendStatus (peer, chainInfo) {
    const protocol = peer.getProtocols()[0]
    // TODO: Replace hard-coded mainnet parameters in common package with a request to
    // network specific params from separate file (PR to be opened) networks.json
    protocol.sendStatus({
      networkId: this._config.networkid,
      td: devp2p._util.int2buffer(this._config.common.genesis().difficulty), // total difficulty in genesis block
      bestHash: Buffer.from(chainInfo.rawHead, 'hex'),
      genesisHash: Buffer.from(this._config.common.genesis().hash.slice(2), 'hex')
    })
  }

  getBlockHeaders (peer, chainInfo) {
    const protocol = peer.getProtocols()[0]
    var startHeight = chainInfo.height + 1
    if (Object.keys(this._requests.headers).length > 0) {
      startHeight = Math.max(startHeight, parseInt(Object.keys(this._requests.headers)[0]))
    }
    this._cleanUpRequestsDicts(startHeight)
    while (this._requests.headers[startHeight] && this._requests.headers[startHeight] !== 'OPEN') {
      startHeight += BLOCKS_PER_REQUEST
    }
    this._requests.headers[startHeight] = 'REQUESTED'
    setTimeout(() => {
      if (this._requests.headers[startHeight] === 'REQUESTED') {
        this._requests.headers[startHeight] = 'OPEN'
        this._requests.blocks[startHeight] = 'OPEN'
      }
    }, ms('5s'))

    this._requests.headerRequestStarts[this._getPeerAddr(peer)] = startHeight
    protocol.sendMessage(devp2p.ETH.MESSAGE_CODES.GET_BLOCK_HEADERS, [ startHeight, BLOCKS_PER_REQUEST, 0, 0 ])
  }

  getBlockBodies (peer, blockHashes) {
    const protocol = peer.getProtocols()[0]
    protocol.sendMessage(devp2p.ETH.MESSAGE_CODES.GET_BLOCK_BODIES, blockHashes)
  }

  _receivedBlockHeaders (peer, payload) {
    let header
    let headers = []
    let hashes = []
    let startHeight = this._requests.headerRequestStarts[this._getPeerAddr(peer)]

    for (let rawHeader of payload) {
      header = new Header(rawHeader)
      headers.push(header)
      hashes.push(header.hash())
    }
    if (headers.length > 0) {
      this._requests.headers[startHeight] = headers
      this.getBlockBodies(peer, hashes)
    }
    return headers
  }

  _receivedBlockBodies (peer, payload) {
    let header
    let block
    let blocks = []
    let startHeight = this._requests.headerRequestStarts[this._getPeerAddr(peer)]
    let headers = Object.assign([], this._requests.headers[startHeight])

    for (let rawBody of payload) {
      header = headers.shift()
      if (header) {
        block = new Block([header.raw, rawBody[0], rawBody[1]])
        blocks.push(block)
      }
    }
    if (blocks.length > 0) {
      this._requests.blocks[startHeight] = blocks
    } else {
      delete this._requests.headers[startHeight]
    }

    return blocks
  }

  _cleanUpRequestsDicts (startHeight) {
    for (let key in this._requests.headers) {
      if (key < startHeight) {
        delete this._requests.headers[key]
      }
    }
    for (let key in this._requests.blocks) {
      if (key < startHeight) {
        delete this._requests.blocks[key]
      }
    }
  }

  _getConsecutiveDownloadedBlocks () {
    let blocks = []
    if (Object.keys(this._requests.headers).length === 0) {
      return blocks
    }
    let startHeight = parseInt(Object.keys(this._requests.headers)[0])

    while (this._requests.blocks[startHeight] &&
      this._requests.blocks[startHeight].length > 0 &&
      this._requests.blocks[startHeight] !== 'OPEN') {
      blocks = blocks.concat(this._requests.blocks[startHeight])
      delete this._requests.headers[startHeight]
      delete this._requests.blocks[startHeight]
      startHeight += BLOCKS_PER_REQUEST
    }
    if (blocks.length === 0) {
      delete this._requests.headers[startHeight]
    }
    return blocks
  }

  startNetworking (chainInfo, onBlockHeadersCb, onBlockBodiesCb) {
    this._logger.info('Started p2p networking communication')
    for (let bootnode of this._bootnodes) {
      this._dpt.bootstrap(bootnode).catch((err) => {
        this._logger.error(`DPT bootstrap error: ${err.stack || err}`)
      })
    }

    this._rlpx.on('peer:added', (peer) => {
      const addr = this._getPeerAddr(peer)
      const protocol = peer.getProtocols()[0]

      const clientId = peer.getHelloMessage().clientId
      this._logger.debug(`Add peer: ${addr} ${clientId} (eth${protocol.getVersion()}) (total: ${this._rlpx.getPeers().length})`)

      this._sendStatus(peer, chainInfo)

      protocol.once('status', () => {
        this.getBlockHeaders(peer, chainInfo)
      })

      protocol.on('message', async (code, payload) => {
        switch (code) {
          case devp2p.ETH.MESSAGE_CODES.BLOCK_HEADERS:
            let headers = this._receivedBlockHeaders(peer, payload)
            onBlockHeadersCb(peer, headers)
            break
          case devp2p.ETH.MESSAGE_CODES.BLOCK_BODIES:
            this._receivedBlockBodies(peer, payload)
            let blocks = this._getConsecutiveDownloadedBlocks()
            onBlockBodiesCb(peer, blocks)
            break
        }
      })
    })

    this._rlpx.on('peer:removed', (peer, reasonCode, disconnectWe) => {
      delete this._requests.headerRequestStarts[this._getPeerAddr(peer)]
      const who = disconnectWe ? 'we disconnect' : 'peer disconnect'
      const total = this._rlpx.getPeers().length

      let msg = `Remove peer: ${this._getPeerAddr(peer)} - ${who}, `
      msg += `reason: ${peer.getDisconnectPrefix(reasonCode)} `
      msg += `(${String(reasonCode)}) (total: ${total})`
      this._logger.debug(msg)
    })
  }

  _getBootnodes (config) {
    return this._config.common.bootstrapNodes().map((node) => {
      return {
        address: node.ip,
        udpPort: node.port,
        tcpPort: node.port
      }
    })
  }

  _debugDumpRequestsDict (dict) {
    let tmpDict = Object.assign({}, dict)
    for (let key in tmpDict) {
      if (typeof (tmpDict[key]) === 'object') {
        tmpDict[key] = tmpDict[key].length
      }
    }
    return tmpDict
  }
}

module.exports = NetworkManager
