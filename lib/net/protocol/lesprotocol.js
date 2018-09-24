'use strict'

const Protocol = require('./protocol')
const util = require('ethereumjs-util')
const Block = require('ethereumjs-block')
const BN = util.BN

const messages = [{
  name: 'GetBlockHeaders',
  code: 0x02,
  response: 0x03,
  encode: (block, max, skip, reverse) => [[
    BN.isBN(block) ? block.toBuffer() : block, max, skip, reverse
  ]],
  decode: ([block, max, skip, reverse]) => [
    block.length === 32 ? block : new BN(block),
    ...[max, skip, reverse].map(util.bufferToInt)
  ]
}, {
  name: 'BlockHeaders',
  code: 0x03,
  reply: true,
  encode: (headers) => [headers.map(h => h.raw)],
  decode: (payload) => payload.map(p => new Block.Header(p))
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

  /**
   * Encodes message into proper format before sending
   * @protected
   * @param {Protocol~Message} message message definition
   * @param {...*} args message arguments
   * @return {*}
   */
  encode (message, args) {
    const encoded = [ this.reqId++ ]
    if (message.reply) {
      // add BV if this is a reply message
      encoded.push(args.shift())
    }
    return encoded.concat(message.encode(...args))
  }

  /**
   * Decodes message payload
   * @protected
   * @param {Protocol~Message} message message definition
   * @param {*} payload message payload
   * @param {BoundProtocol} bound reference to bound protocol
   * @return {*}
   */
  decode (message, payload) {
    return {
      reqId: new BN(payload.shift()),
      bv: message.reply ? new BN(payload.shift()).toNumber() : undefined,
      payload: message.decode(payload.shift())
    }
  }
}

module.exports = LesProtocol
