'use strict'

const Protocol = require('./protocol')
const util = require('ethereumjs-util')
const Block = require('ethereumjs-block')
const BN = util.BN

let id = new BN(0)

const messages = [{
  name: 'Announce',
  code: 0x01,
  encode: ({headHash, headNumber, headTd, reorgDepth}) => [
    // TO DO: handle state changes
    headHash,
    headNumber.toBuffer(),
    headTd.toBuffer(),
    new BN(reorgDepth).toBuffer()
  ],
  decode: ([headHash, headNumber, headTd, reorgDepth]) => ({
    // TO DO: handle state changes
    headHash: headHash,
    headNumber: new BN(headNumber),
    headTd: new BN(headTd),
    reorgDepth: util.bufferToInt(reorgDepth)
  })
}, {
  name: 'GetBlockHeaders',
  code: 0x02,
  response: 0x03,
  encode: ({reqId, block, max, skip = 0, reverse = 0}) => [
    (reqId === undefined ? id.iaddn(1) : new BN(reqId)).toBuffer(),
    [ BN.isBN(block) ? block.toBuffer() : block, max, skip, reverse ]
  ],
  decode: ([reqId, [block, max, skip, reverse]]) => ({
    reqId: new BN(reqId),
    block: block.length === 32 ? block : new BN(block),
    max: util.bufferToInt(max),
    skip: util.bufferToInt(skip),
    reverse: util.bufferToInt(reverse)
  })
}, {
  name: 'BlockHeaders',
  code: 0x03,
  encode: ({reqId, bv, headers}) => [
    new BN(reqId).toBuffer(),
    new BN(bv).toBuffer(),
    headers.map(h => h.raw)
  ],
  decode: ([reqId, bv, headers]) => ({
    reqId: new BN(reqId),
    bv: new BN(bv),
    headers: headers.map(raw => new Block.Header(raw))
  })
}]

/**
 * Implements les/1 and les/2 protocols
 * @memberof module:net/protocol
 */
class LesProtocol extends Protocol {
  /**
   * Create les protocol
   * @param {Object}      options constructor parameters
   * @param {Chain}       options.chain blockchain
   * @param {FlowControl} options.flow flow control manager
   * @param {number}      [options.timeout=5000] handshake timeout in ms
   * @param {Logger}      [options.logger] logger instance
   */
  constructor (options) {
    super(options)

    this.chain = options.chain
    this.flow = options.flow
    this.reqId = 0
  }

  /**
   * Name of protocol
   * @type {string}
   */
  get name () {
    return 'les'
  }

  /**
   * Protocol versions supported
   * @type {number[]}
   */
  get versions () {
    return [2, 1]
  }

  /**
   * Messages defined by this protocol
   * @type {Protocol~Message[]}
   */
  get messages () {
    return messages
  }

  /**
   * Opens protocol and any associated dependencies
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return false
    }
    await this.chain.open()
    this.opened = true
  }

  /**
   * Encodes status into ETH status message payload
   * @return {Object}
   */
  encodeStatus () {
    const mrc = Object.entries(this.flow.mrc).map(([name, { base, req }]) => {
      const { code } = messages.find(m => m.name === name)
      return [code, base, req]
    })
    return {
      networkId: this.chain.networkId,
      headTd: this.chain.headers.td.toBuffer(),
      headHash: this.chain.headers.latest.hash(),
      headNum: this.chain.headers.latest.number,
      genesisHash: this.chain.genesis.hash,
      serveHeaders: 1,
      serveChainSince: 0,
      serveStateSince: 0,
      txRelay: 1,
      'flowControl/BL': new BN(this.flow.bl).toBuffer(),
      'flowControl/MRR': new BN(this.flow.mrr).toBuffer(),
      'flowControl/MRC': mrc
    }
  }

  /**
   * Decodes ETH status message payload into a status object
   * @param {Object} status status message payload
   * @return {Object}
   */
  decodeStatus (status) {
    this.isServer = !!status.serveHeaders
    const mrc = {}
    if (status['flowControl/MRC']) {
      for (let entry of status['flowControl/MRC']) {
        entry = entry.map(e => new BN(e).toNumber())
        mrc[entry[0]] = { base: entry[1], req: entry[2] }
        const message = messages.find(m => m.code === entry[0])
        if (message) {
          mrc[message.name] = mrc[entry[0]]
        }
      }
    }
    return {
      networkId: util.bufferToInt(status.networkId),
      headTd: new BN(status.headTd),
      headHash: status.headHash,
      headNum: new BN(status.headNum),
      genesisHash: status.genesisHash,
      serveHeaders: this.isServer,
      serveChainSince: status.serveChainSince && new BN(status.serveChainSince),
      serveStateSince: status.serveStateSince && new BN(status.serveStateSince),
      txRelay: !!status.txRelay,
      bl: status['flowControl/BL'] && new BN(status['flowControl/BL']).toNumber(),
      mrr: status['flowControl/MRR'] && new BN(status['flowControl/MRR']).toNumber(),
      mrc: mrc
    }
  }
}

module.exports = LesProtocol
