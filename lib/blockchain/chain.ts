import * as events from 'events'
import Common from 'ethereumjs-common'
const Block = require('ethereumjs-block')
import Blockchain from 'ethereumjs-blockchain'
import { BN } from 'ethereumjs-util'
import { defaultLogger } from '../logging'
const promisify = require('util-promisify')

const defaultOptions = {
  logger: defaultLogger,
  common: new Common('mainnet', 'chainstart'),
}

function hexToBuffer(hexString: string): Buffer | string {
  if (typeof hexString === 'string' && hexString.startsWith('0x')) {
    return Buffer.from(hexString.slice(2), 'hex')
  }
  return hexString
}

/**
 * Blockchain
 * @memberof module:blockchain
 */
export class Chain extends events.EventEmitter {
  public logger: any
  public common: Common
  public db: any
  public blockchain: Blockchain

  public opened = false

  private _headers = {}
  private _blocks = {}

  private _getBlocks: Function | undefined
  private _getBlock: Function | undefined
  private _putBlocks: Function | undefined
  private _putHeaders: Function | undefined
  private _getLatestHeader: Function | undefined
  private _getLatestBlock: Function | undefined
  private _getTd: Function | undefined

  /**
   * Create new chain
   * @param {Object}  options constructor parameters
   * @param {LevelDB} [options.db] database (must implement leveldb interface)
   * @param {Common}  [options.common] common parameters
   * @param {Logger}  [options.logger] Logger instance
   */
  constructor(options?: any) {
    super()
    options = { ...defaultOptions, ...options }

    this.logger = options.logger
    this.common = options.common
    this.db = options.db
    this.blockchain = options.blockchain
    this.init()
  }

  init() {
    if (!this.blockchain) {
      this.blockchain = new Blockchain({
        db: this.db,
        validate: false,
        common: this.common,
      })
      if (!this.db) {
        this.db = this.blockchain.db
      }
    }

    this.reset()
    this.opened = false
  }

  reset() {
    this._headers = {
      latest: null,
      td: new BN(0),
      height: new BN(0),
    }
    this._blocks = {
      latest: null,
      td: new BN(0),
      height: new BN(0),
    }
  }

  /**
   * Network ID
   */
  get networkId(): number {
    return this.common.networkId()
  }

  /**
   * Genesis block parameters
   */
  get genesis(): object {
    const genesis = this.common.genesis()
    Object.entries(genesis).forEach(([k, v]) => {
      genesis[k] = hexToBuffer(v as string)
    })
    return genesis
  }

  /**
   * Returns properties of the canonical headerchain. The ``latest`` property is
   * the latest header in the chain, the ``td`` property is the total difficulty of
   * headerchain, and the ``height`` is the height of the headerchain.
   */
  get headers(): object {
    return { ...this._headers }
  }

  /**
   * Returns properties of the canonical blockchain. The ``latest`` property is
   * the latest block in the chain, the ``td`` property is the total difficulty of
   * blockchain, and the ``height`` is the height of the blockchain.
   */
  get blocks(): object {
    return { ...this._blocks }
  }

  /**
   * Open blockchain and wait for database to load
   */
  async open(): Promise<boolean | void> {
    if (this.opened) {
      return false
    }

    await this.blockchain.db.open()
    this.opened = true
    await this.update()
  }

  /**
   * Close blockchain and database
   */
  async close(): Promise<boolean | void> {
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
  async update(): Promise<boolean | void> {
    if (!this.opened) {
      return false
    }
    const headers: any = {}
    const blocks: any = {}
    headers.latest = await this.getLatestHeader()
    blocks.latest = await this.getLatestBlock()

    headers.td = await this.getTd(headers.latest.hash())
    blocks.td = await this.getTd(blocks.latest.hash())

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
   */
  async getBlocks(block: Buffer | BN, max: number, skip: number, reverse: boolean): Promise<any[]> {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getBlocks) {
      this._getBlocks = promisify(this.blockchain.getBlocks.bind(this.blockchain))
    }
    return await (this._getBlocks as Function)(block, max, skip, reverse)
  }

  /**
   * Gets a block by its hash or number
   * @param blocks block hash or number
   */
  async getBlock(block: Buffer | BN): Promise<any> {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getBlock) {
      this._getBlock = promisify(this.blockchain.getBlock.bind(this.blockchain))
    }

    return await (this._getBlock as Function)(block)
  }

  /**
   * Insert new blocks into blockchain
   * @method putBlocks
   * @param {Block[]} blocks list of blocks to add
   */
  async putBlocks(blocks: object[]): Promise<void> {
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
   */
  async getHeaders(
    block: Buffer | BN,
    max: number,
    skip: number,
    reverse: boolean
  ): Promise<any[]> {
    const blocks = await this.getBlocks(block, max, skip, reverse)
    return blocks.map((b: any) => b.header)
  }

  /**
   * Insert new headers into blockchain
   * @method putHeaders
   * @param headers list of headers to add
   */
  async putHeaders(headers: object[]): Promise<void> {
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
   */
  async getLatestHeader(): Promise<any> {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getLatestHeader) {
      this._getLatestHeader = promisify(this.blockchain.getLatestHeader.bind(this.blockchain))
    }
    const result: any = await (this._getLatestHeader as Function)()
    return result
  }

  /**
   * Gets the latest block in the canonical chain
   */
  async getLatestBlock(): Promise<any> {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getLatestBlock) {
      this._getLatestBlock = promisify(this.blockchain.getLatestBlock.bind(this.blockchain))
    }
    const result: any = await (this._getLatestBlock as Function)()
    return result
  }

  /**
   * Gets total difficulty for a block
   * @param hash block hash
   */
  async getTd(hash: Buffer): Promise<any> {
    if (!this.opened) {
      await this.open()
    }
    if (!this._getTd) {
      this._getTd = promisify(this.blockchain._getTd.bind(this.blockchain))
    }
    return await (this._getTd as Function)(hash)
  }
}
