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
    this._latest = {
      block: null,
      td: new BN(0)
    }
    this._opened = false
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
   * Total difficulty of canonical chain
   * @type {BN}
   */
  get td () {
    return this._latest.td
  }

  /**
   * Latest block in canonical chain
   * @type {Block}
   */
  get latest () {
    return this._latest.block
  }

  /**
   * Blockchain height
   * @type {BN}
   */
  get height () {
    return this.latest && new BN(this._latest.block.header.number)
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
    if (this._opened) {
      return false
    }

    this.logger.info(`Data directory: ${this.dataDir}`)
    await this.blockchain.db.open()
    this._opened = true
    await this.update()
  }

  /**
   * Close blockchain and database
   * @return {Promise}
   */
  async close () {
    if (!this._opened) {
      return false
    }
    await this.blockchain.db.close()
  }

  /**
   * Update blockchain properties (latest block, td, height, etc...)
   * @return {Promise}
   */
  async update () {
    if (!this._opened) {
      return false
    }
    await new Promise((resolve, reject) => {
      this.blockchain.getLatestBlock((err, block) => {
        if (err) return reject(err)
        this._latest.block = block
        resolve()
      })
    })
    await new Promise((resolve, reject) => {
      this.blockchain._getTd(this._latest.block.hash(), (err, td) => {
        if (err) return reject(err)
        this._latest.td = td
        resolve()
      })
    })
    this.emit('updated')
  }

  /**
   * Insert new blocks into blockchain
   * @return {Promise}
   */
  async add (blocks) {
    if (!this._opened) {
      return false
    }
    if (blocks instanceof Block) {
      blocks = [ blocks ]
    }
    if (!blocks || !blocks.length) {
      return false
    }

    await new Promise((resolve, reject) => {
      this.blockchain.putBlocks(blocks, err => err ? reject(err) : resolve())
    })

    await this.update()
  }
}

function hexToBuffer (hexString) {
  if (typeof (hexString) === 'string' && hexString.startsWith('0x')) {
    return Buffer.from(hexString.slice(2), 'hex')
  }
  return hexString
}

module.exports = Chain
