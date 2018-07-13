'use strict'

const Protocol = require('./protocol')
const { MESSAGE_CODES } = require('ethereumjs-devp2p').ETH
const util = require('ethereumjs-util')
const rlp = util.rlp
const BN = util.BN

/**
 * Implements eth/62 and eth/63 protocols
 * @memberof module:net/protocol
 */
class EthProtocol extends Protocol {
  /**
   * Create eth protocol
   * @param {Sender} sender
   */
  constructor (sender) {
    super(sender)

    this.init()
  }

  /**
   * Message code constants for eth/62 and eth/63
   * @type {Object}
   */
  static get codes () {
    return MESSAGE_CODES
  }

  /**
   * Name of protocol
   * @type {string}
   */
  get name () {
    return 'eth'
  }

  /**
   * Protocol version
   * @type {number}
   */
  get version () {
    return 63
  }

  /**
   * Protocol handshake status
   * @type {Object}
   */
  get status () {
    return this._status
  }

  /**
   * Total difficulty for peer's canonical chain
   * @type {BN}
   */
  get td () {
    return this._status.td
  }

  /**
   * Hash of peer's latest block
   * @type {Buffer}
   */
  get head () {
    return this._status.bestHash
  }

  init () {
    this._status = null
  }

  /**
   * Perform handshake
   * @param  {Chain}  chain
   * @return {Promise}
   */
  async handshake (chain) {
    if (this._status) {
      return
    }

    this.sender.sendStatus({
      networkId: chain.networkId,
      td: chain.td.toBuffer(),
      bestHash: chain.latest.hash(),
      genesisHash: chain.genesis.hash
    })
    return new Promise((resolve, reject) => {
      let timeout = setTimeout(() => {
        timeout = null
        reject(new Error(`Handshake timed out after ${this.timeout}ms`))
      }, this.timeout)

      this.sender.once('status', (status) => {
        this._status = {
          networkId: util.bufferToInt(status.networkId),
          td: new BN(status.td),
          bestHash: status.bestHash,
          genesisHash: status.genesisHash
        }
        // make sure we don't resolve twice if already timed out
        if (timeout) {
          clearTimeout(timeout)
          resolve(status)
        }
      })
    })
  }

  /**
   * Get a sequence of block headers. A BLOCK_HEADERS message is emitted when
   * results are returned from peer.
   * @param  {BN|Buffer} block   block number or hash
   * @param  {number} maxHeaders maximum number of heads to fetch
   * @param  {number} skip       blocks to skip between headers
   * @param  {boolean} reverse   decreasing header numbers if reverse is 1
   */
  getBlockHeaders (block, maxHeaders, skip, reverse) {
    this.sender.sendMessage(MESSAGE_CODES.GET_BLOCK_HEADERS, rlp.encode([
      block,
      maxHeaders,
      skip,
      reverse
    ]))
  }

  /**
   * Get a sequence of block bodies. A BLOCK_BODIES message is emitted when
   * results are returned from peer.
   * @param  {Buffer[]} hashes   Array of hashes to fetch bodies for
   */
  getBlockBodies (hashes) {
    this.sender.sendMessage(MESSAGE_CODES.GET_BLOCK_BODIES, rlp.encode(hashes))
  }
}

module.exports = EthProtocol
