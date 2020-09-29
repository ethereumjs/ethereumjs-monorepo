const { EventEmitter } = require('events')
import Common from 'ethereumjs-common'
const Block = require('ethereumjs-block')
const Blockchain = require('ethereumjs-blockchain')
import { BN } from 'ethereumjs-util'
const { defaultLogger } = require('../logging')
const promisify = require('util-promisify')

const defaultOptions = {
  logger: defaultLogger,
  common: new Common('mainnet', 'chainstart')
}

/**
 * Blockchain
 * @memberof module:blockchain
 */
export = module.exports = class Chain extends EventEmitter {

  private logger: any
  private common: Common
  private db: any
  private blockchain: any

  private opened = false

  private _headers = {}
  private _blocks = {}

  private _getBlocks: Function | undefined
  private _getBlock: Function | undefined
  private _putBlocks: Function | undefined
  private _putHeaders: Function | undefined
  private _getLatestHeader: Function | undefined
  private _getLatestBlock: Function | undefined
  private _getTd: Function | undefined

  /**
   * Create new chain
   * @param {Object}  options constructor parameters
   * @param {LevelDB} [options.db] database (must implement leveldb interface)
   * @param {Common}  [options.common] common parameters
   * @param {Logger}  [options.logger] Logger instance
   */
  constructor (options: any) {
    super()
    options = { ...defaultOptions, ...options }

    this.logger = options.logger
    this.common = options.common
    this.db = options.db
    this.blockchain = options.blockchain
    this.init()
  }

  init () {
    if (!this.blockchain) {
      this.blockchain = new Blockchain({
        db: this.db,
        validate: false,
        common: this.common
      })
      if (!this.db) {
        this.db = this.blockchain.db
      }
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
    Object.entries(genesis).forEach(([k, v]) => { genesis[k] = hexToBuffer(v as string) })
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
    const headers: any = {}
    const blocks: any = {}
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
   * @param block block hash or number to start from
   * @param max maximum number of blocks to get
   * @param skip number of blocks to skip
   * @param reverse get blocks in reverse
   * @return {Promise}
   */
  async getBlocks (block: Buffer | BN, max: number, skip: number, reverse: boolean) {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getBlocks) {
      this._getBlocks = promisify(this.blockchain.getBlocks.bind(this.blockchain))
    }
    return (this._getBlocks as Function)(block, max, skip, reverse)
  }

  /**
   * Gets a block by its hash or number
   * @param blocks block hash or number
   * @return {Promise}
   */
  async getBlock (block: Buffer | BN) {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getBlock) {
      this._getBlock = promisify(this.blockchain.getBlock.bind(this.blockchain))
    }

    return (this._getBlock as Function)(block)
  }

  /**
   * Insert new blocks into blockchain
   * @method putBlocks
   * @param {Block[]} blocks list of blocks to add
   * @return {Promise}
   */
  async putBlocks (blocks: object[]) {
    if (!this.opened) {
      await this.open()
    }
    if (!this._putBlocks) {
      this._putBlocks = promisify(this.blockchain.putBlocks.bind(this.blockchain))
    }
    if (!blocks) {
      return
    }
    blocks = blocks.map((b: any) => new Block(b.raw, { common: this.common }))
    await (this._putBlocks as Function)(blocks)
    await this.update()
  }

  /**
   * Get headers from blockchain
   * @param block block hash or number to start from
   * @param max maximum number of headers to get
   * @param skip number of headers to skip
   * @param reverse get headers in reverse
   * @return {Promise}
   */
  async getHeaders (block: Buffer | BN, max: number, skip: number, reverse: boolean) {
    const blocks = await this.getBlocks(block, max, skip, reverse)
    return blocks.map((b: any) => b.header)
  }

  /**
   * Insert new headers into blockchain
   * @method putHeaders
   * @param headers list of headers to add
   * @return {Promise}
   */
  async putHeaders (headers: object[]) {
    if (!this.opened) {
      await this.open()
    }
    if (!this._putHeaders) {
      this._putHeaders = promisify(this.blockchain.putHeaders.bind(this.blockchain))
    }
    if (!headers) {
      return
    }
    headers = headers.map((h: any) => new Block.Header(h.raw, { common: this.common }))
    await (this._putHeaders as Function)(headers)
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
    return (this._getLatestHeader as Function)()
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
    return (this._getLatestBlock as Function)()
  }

  /**
   * Gets total difficulty for a block
   * @param hash block hash
   * @return {Promise}
   */
  async getTd (hash: Buffer) {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getTd) {
      this._getTd = promisify(this.blockchain._getTd.bind(this.blockchain))
    }
    return (this._getTd as Function)(hash)
  }
}

function hexToBuffer (hexString: string) {
  if (typeof (hexString) === 'string' && hexString.startsWith('0x')) {
    return Buffer.from(hexString.slice(2), 'hex')
  }
  return hexString
}

