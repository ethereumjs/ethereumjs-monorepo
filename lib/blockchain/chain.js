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
  dataDir: './chaindata',
  network: 'mainnet'
}

/**
 * Blockchain
 * @memberof module:blockchain
 */
class Chain extends EventEmitter {
  /**
   * Create new chain
   * @param {Object} options constructor parameters
   * @param {string} [options.dataDir=./chaindata] data directory path
   * @param {string} [options.network=mainnet] ethereum network name
   * @param {Logger} [options.logger] Logger instance
   */
  constructor (options) {
    super()
    options = {...defaultOptions, ...options}

    this.logger = options.logger
    this.common = new Common(options.network)
    this.dataDir = options.dataDir
    this.blockchain = null
    this.init()
  }

  init () {
    fs.ensureDirSync(this.dataDir)

    this.blockchain = new Blockchain({
      db: levelup(this.dataDir, { db: leveldown }),
      validate: false
    })
    // add promisified functions to blockchain instance for convenience
    const bc = this.blockchain
    bc.p = {
      getLatestHeader: promisify(bc.getLatestHeader.bind(bc)),
      getLatestBlock: promisify(bc.getLatestBlock.bind(bc)),
      putBlocks: promisify(bc.putBlocks.bind(bc)),
      getTd: promisify(bc._getTd.bind(bc))
    }
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
    this.opened = false
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

    this.logger.info(`Data directory: ${this.dataDir}`)
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
    await this.blockchain.db.close()
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
      this.blockchain.p.getLatestHeader(),
      this.blockchain.p.getLatestBlock()
    ]).then(latest => { [headers.latest, blocks.latest] = latest })
    await Promise.all([
      this.blockchain.p.getTd(headers.latest.hash()),
      this.blockchain.p.getTd(blocks.latest.hash())
    ]).then(td => { [headers.td, blocks.td] = td })
    headers.height = new BN(headers.latest.number)
    blocks.height = new BN(blocks.latest.header.number)
    this._headers = headers
    this._blocks = blocks
    this.emit('updated')
  }

  /**
   * Insert new blocks into blockchain
   * @param  {Block[]|Block} blocks list of blocks or single block to add
   * @return {Promise}
   */
  async add (blocks) {
    if (!this.opened) {
      return false
    }
    if (blocks instanceof Block) {
      blocks = [ blocks ]
    }
    if (!blocks || !blocks.length) {
      return false
    }
    await this.blockchain.p.putBlocks(blocks)
    await this.update()
  }

  /**
   * Insert new headers into blockchain
   * @param  {Header[]} headers list of headers to add
   * @return {Promise}
   */
  async addHeaders (headers) {
    if (!this.opened) {
      return false
    }
    const blocks = headers.map(header => new Block([header.raw, [], []]))
    await this.add(blocks)
  }
}

function hexToBuffer (hexString) {
  if (typeof (hexString) === 'string' && hexString.startsWith('0x')) {
    return Buffer.from(hexString.slice(2), 'hex')
  }
  return hexString
}

module.exports = Chain
