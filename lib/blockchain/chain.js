'use strict'

const fs = require('fs-extra')
const levelup = require('levelup')
const leveldown = require('leveldown')
const EventEmitter = require('events')
const Common = require('ethereumjs-common')
const Block = require('ethereumjs-block')
const Blockchain = require('ethereumjs-blockchain')
const { BN } = require('ethereumjs-util')
const { defaultLogger } = require('../logging')
const { promisify } = require('util')

const defaultOptions = {
  logger: defaultLogger,
  common: new Common('mainnet')
}

/**
 * Blockchain
 * @memberof module:blockchain
 */
class Chain extends EventEmitter {
  /**
   * Create new chain
   * @param {Object} options constructor parameters
   * @param {string} [options.dataDir] data directory path (use in-memory db if missing)
   * @param {Common} [options.common] common parameters
   * @param {Logger} [options.logger] Logger instance
   */
  constructor (options) {
    super()
    options = {...defaultOptions, ...options}

    this.logger = options.logger
    this.common = options.common
    this.dataDir = options.dataDir
    this.blockchain = options.blockchain
    this.init()
  }

  init () {
    let db
    if (this.dataDir) {
      fs.ensureDirSync(this.dataDir)
      db = levelup(this.dataDir, { db: leveldown })
    }
    if (!this.blockchain) {
      this.blockchain = new Blockchain({
        db,
        validate: false,
        common: this.common
      })
    }

    this.reset()
    this.opened = false
  }

  reset () {
    this._headers = {
      latest: null,
      td: new BN(0),
      height: new BN(0)
    }
    this._blocks = {
      latest: null,
      td: new BN(0),
      height: new BN(0)
    }
  }

  /**
   * Network ID
   * @type {number}
   */
  get networkId () {
    return this.common.networkId()
  }

  /**
   * Genesis block parameters
   * @type {Object}
   */
  get genesis () {
    const genesis = this.common.genesis()
    Object.entries(genesis).forEach(([k, v]) => { genesis[k] = hexToBuffer(v) })
    return genesis
  }

  /**
   * Returns properties of the canonical headerchain. The ``latest`` property is
   * the latest header in the chain, the ``td`` property is the total difficulty of
   * headerchain, and the ``height`` is the height of the headerchain.
   * @type {Object}
   */
  get headers () {
    return { ...this._headers }
  }

  /**
   * Returns properties of the canonical blockchain. The ``latest`` property is
   * the latest block in the chain, the ``td`` property is the total difficulty of
   * blockchain, and the ``height`` is the height of the blockchain.
   * @type {Object}
   */
  get blocks () {
    return { ...this._blocks }
  }

  /**
   * Blockchain database
   * @type {}
   */
  get db () {
    return this.blockchain && this.blockchain.db
  }

  /**
   * Open blockchain and wait for database to load
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return false
    }

    await this.blockchain.db.open()
    this.opened = true
    await this.update()
  }

  /**
   * Close blockchain and database
   * @return {Promise}
   */
  async close () {
    if (!this.opened) {
      return false
    }
    this.reset()
    await this.blockchain.db.close()
    this.opened = false
  }

  /**
   * Update blockchain properties (latest block, td, height, etc...)
   * @return {Promise}
   */
  async update () {
    if (!this.opened) {
      return false
    }
    const headers = {}
    const blocks = {}
    await Promise.all([
      this.getLatestHeader(),
      this.getLatestBlock()
    ]).then(latest => { [headers.latest, blocks.latest] = latest })
    await Promise.all([
      this.getTd(headers.latest.hash()),
      this.getTd(blocks.latest.hash())
    ]).then(td => { [headers.td, blocks.td] = td })
    headers.height = new BN(headers.latest.number)
    blocks.height = new BN(blocks.latest.header.number)
    this._headers = headers
    this._blocks = blocks
    this.emit('updated')
  }

  /**
   * Get blocks from blockchain
   * @param {Buffer|BN} block block hash or number to start from
   * @param {number} max maximum number of blocks to get
   * @param {number} skip number of blocks to skip
   * @param {boolean} reverse get blocks in reverse
   * @return {Promise}
   */
  async getBlocks (block, max, skip, reverse) {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getBlocks) {
      this._getBlocks = promisify(this.blockchain.getBlocks.bind(this.blockchain))
    }
    return this._getBlocks(block, max, skip, reverse)
  }

  /**
   * Gets a block by its hash or number
   * @param {Buffer|BN} blocks block hash or number
   * @return {Promise}
   */
  async getBlock (block) {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getBlock) {
      this._getBlock = promisify(this.blockchain.getBlock.bind(this.blockchain))
    }

    return this._getBlock(block)
  }

  /**
   * Insert new blocks into blockchain
   * @method putBlocks
   * @param {Block[]} blocks list of blocks to add
   * @return {Promise}
   */
  async putBlocks (blocks) {
    if (!this.opened) {
      await this.open()
    }
    if (!this._putBlocks) {
      this._putBlocks = promisify(this.blockchain.putBlocks.bind(this.blockchain))
    }
    if (!blocks) {
      return
    }
    blocks = blocks.map(b => new Block(b.raw, { common: this.common }))
    await this._putBlocks(blocks)
    await this.update()
  }

  /**
   * Get headers from blockchain
   * @param {Buffer|BN} block block hash or number to start from
   * @param {number} max maximum number of headers to get
   * @param {number} skip number of headers to skip
   * @param {boolean} reverse get headers in reverse
   * @return {Promise}
   */
  async getHeaders (block, max, skip, reverse) {
    const blocks = await this.getBlocks(block, max, skip, reverse)
    return blocks.map(b => b.header)
  }

  /**
   * Insert new headers into blockchain
   * @method putHeaders
   * @param {Block.Header[]} headers list of headers to add
   * @return {Promise}
   */
  async putHeaders (headers) {
    if (!this.opened) {
      await this.open()
    }
    if (!this._putHeaders) {
      this._putHeaders = promisify(this.blockchain.putHeaders.bind(this.blockchain))
    }
    if (!headers) {
      return
    }
    headers = headers.map(h => new Block.Header(h.raw, { common: this.common }))
    await this._putHeaders(headers)
    await this.update()
  }

  /**
   * Gets the latest header in the canonical chain
   * @return {Promise}
   */
  async getLatestHeader () {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getLatestHeader) {
      this._getLatestHeader = promisify(this.blockchain.getLatestHeader.bind(this.blockchain))
    }
    return this._getLatestHeader()
  }

  /**
   * Gets the latest block in the canonical chain
   * @return {Promise}
   */
  async getLatestBlock () {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getLatestBlock) {
      this._getLatestBlock = promisify(this.blockchain.getLatestBlock.bind(this.blockchain))
    }
    return this._getLatestBlock()
  }

  /**
   * Gets total difficulty for a block
   * @param {Buffer} hash block hash
   * @return {Promise}
   */
  async getTd (hash) {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getTd) {
      this._getTd = promisify(this.blockchain._getTd.bind(this.blockchain))
    }
    return this._getTd(hash)
  }
}

function hexToBuffer (hexString) {
  if (typeof (hexString) === 'string' && hexString.startsWith('0x')) {
    return Buffer.from(hexString.slice(2), 'hex')
  }
  return hexString
}

module.exports = Chain
