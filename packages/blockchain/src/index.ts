import Semaphore from 'semaphore-async-await'
import { BN, rlp } from 'ethereumjs-util'
import { Block, BlockHeader } from '@ethereumjs/block'
import Ethash from '@ethereumjs/ethash'
import Common from '@ethereumjs/common'
import { DBManager, DBOp } from './dbManager'
import {
  HEAD_BLOCK_KEY,
  HEAD_HEADER_KEY,
  bufBE8,
  hashToNumberKey,
  headerKey,
  bodyKey,
  numberToHashKey,
  tdKey,
} from './util'

import type { LevelUp } from 'levelup'

const level = require('level-mem')

type OnBlock = (block: Block, reorg: boolean) => Promise<void> | void

export interface BlockchainInterface {
  /**
   * Adds a block to the blockchain.
   *
   * @param block - The block to be added to the blockchain.
   * @param isGenesis - True if block is the genesis block.
   */
  putBlock(block: Block, isGenesis?: boolean): Promise<void>

  /**
   * Deletes a block from the blockchain. All child blocks in the chain are deleted and any
   * encountered heads are set to the parent block.
   *
   * @param blockHash - The hash of the block to be deleted
   */
  delBlock(blockHash: Buffer): Promise<void>

  /**
   * Returns a block by its hash or number.
   */
  getBlock(blockId: Buffer | number | BN): Promise<Block | null>

  /**
   * Iterates through blocks starting at the specified iterator head and calls the onBlock function
   * on each block.
   *
   * @param name - Name of the state root head
   * @param onBlock - Function called on each block with params (block: Block, reorg: boolean)
   */
  iterator(name: string, onBlock: OnBlock): Promise<void>
}

/**
 * This are the options that the Blockchain constructor can receive.
 */
export interface BlockchainOptions {
  /**
   * Specify the chain and hardfork by passing a Common instance.
   *
   * If not provided this defaults to chain `mainnet` and hardfork `chainstart`
   *
   */
  common?: Common

  /**
   * Database to store blocks and metadata. Should be an abstract-leveldown compliant store.
   */
  db?: LevelUp

  /**
   * This flags indicates if Proof-of-work should be validated. Defaults to `true`.
   */
  validatePow?: boolean

  /**
   * This flags indicates if blocks should be validated. See Block#validate for details. If
   * `validate` is provided, this option takes its value. If neither `validate` nor this option are
   * provided, it defaults to `true`.
   */
  validateBlocks?: boolean
}

/**
 * This class stores and interacts with blocks.
 */
export default class Blockchain implements BlockchainInterface {
  db: LevelUp
  dbManager: DBManager
  ethash?: Ethash

  private _genesis?: Buffer
  private _headBlock?: Buffer
  private _headHeader?: Buffer
  private _heads: { [key: string]: Buffer }
  private _staleHeadBlock: boolean
  private _staleHeads: string[]

  private _initDone: boolean
  private _lock: Semaphore

  private _common: Common
  private readonly _validatePow: boolean
  private readonly _validateBlocks: boolean

  /**
   * Creates new Blockchain object
   *
   * @param opts - An object with the options that this constructor takes. See [[BlockchainOptions]].
   */
  constructor(opts: BlockchainOptions = {}) {
    // Throw on chain or hardfork options removed in latest major release
    // to prevent implicit chain setup on a wrong chain
    if ('chain' in opts || 'hardfork' in opts) {
      throw new Error('Chain/hardfork options are not allowed any more on initialization')
    }

    if (opts.common) {
      this._common = opts.common
    } else {
      const DEFAULT_CHAIN = 'mainnet'
      const DEFAULT_HARDFORK = 'chainstart'
      this._common = new Common({ chain: DEFAULT_CHAIN, hardfork: DEFAULT_HARDFORK })
    }

    this._validatePow = opts.validatePow !== undefined ? opts.validatePow : true
    this._validateBlocks = opts.validateBlocks !== undefined ? opts.validateBlocks : true

    this.db = opts.db ? opts.db : level()
    this.dbManager = new DBManager(this.db, this._common)

    if (this._validatePow) {
      this.ethash = new Ethash(this.db)
    }

    this._heads = {}
    this._staleHeadBlock = false
    this._staleHeads = []

    this._lock = new Semaphore(1)
    this._initDone = false
  }

  /**
   * Returns an object with metadata about the Blockchain. It's defined for backwards compatibility.
   */
  get meta() {
    return {
      rawHead: this._headHeader,
      heads: this._heads,
      genesis: this._genesis,
    }
  }

  /**
   * Fetches the meta info about the blockchain from the db. Meta info contains
   * hashes of the headerchain head, blockchain head, genesis block and iterator
   * heads.
   *
   * @hidden
   */
  async _init() {
    let genesisHash
    try {
      genesisHash = await this.dbManager.numberToHash(new BN(0))
    } catch (error) {
      await this._setCanonicalGenesisBlock()
      genesisHash = this._genesis
      if (error.type !== 'NotFoundError') {
        throw error
      }
    }

    // load verified iterator heads
    try {
      const heads = await this.dbManager.getHeads()
      this._heads = heads
    } catch (error) {
      this._heads = {}
      if (error.type !== 'NotFoundError') {
        throw error
      }
    }

    // load headerchain head
    try {
      const hash = await this.dbManager.getHeadHeader()
      this._headHeader = hash
    } catch (error) {
      this._headHeader = genesisHash
      if (error.type !== 'NotFoundError') {
        throw error
      }
    }

    // load blockchain head
    try {
      const hash = await this.dbManager.getHeadBlock()
      this._headBlock = hash
    } catch (error) {
      this._headBlock = genesisHash
      if (error.type !== 'NotFoundError') {
        throw error
      }
    }

    this._initDone = true
  }

  /**
   * Sets the default genesis block
   *
   * @hidden
   */
  async _setCanonicalGenesisBlock() {
    const common = new Common({ chain: this._common.chainId(), hardfork: 'chainstart' })
    const genesis = Block.genesis({}, { common })
    await this._putBlockOrHeader(genesis, true)
  }

  /**
   * Puts the genesis block in the database
   *
   * @param genesis - The genesis block to be added
   */
  async putGenesis(genesis: Block) {
    await this.putBlock(genesis, true)
  }

  /**
   * Returns the specified iterator head.
   *
   * @param name - Optional name of the state root head (default: 'vm')
   */
  async getHead(name = 'vm'): Promise<Block> {
    if (!this._initDone) {
      await this._init()
    }

    // if the head is not found return the headHeader
    const hash = this._heads[name] || this._headBlock
    if (!hash) {
      throw new Error('No head found.')
    }

    return this.getBlock(hash)
  }

  /**
   * Returns the latest header in the canonical chain.
   */
  async getLatestHeader(): Promise<BlockHeader> {
    if (!this._initDone) {
      await this._init()
    }

    if (!this._headHeader) {
      throw new Error('No head header set')
    }

    const block = await this.getBlock(this._headHeader)
    return block.header
  }

  /**
   * Returns the latest full block in the canonical chain.
   */
  async getLatestBlock() {
    if (!this._initDone) {
      await this._init()
    }

    if (!this._headBlock) {
      throw new Error('No head block set')
    }

    return this.getBlock(this._headBlock)
  }

  /**
   * Adds many blocks to the blockchain.
   *
   * @param blocks - The blocks to be added to the blockchain
   */
  async putBlocks(blocks: Block[]) {
    for (let i = 0; i < blocks.length; i++) {
      await this.putBlock(blocks[i])
    }
  }

  /**
   * Adds a block to the blockchain.
   *
   * @param block - The block to be added to the blockchain
   */
  async putBlock(block: Block, isGenesis?: boolean) {
    if (!this._initDone) {
      await this._init()
    }

    await this._lock.wait()

    try {
      await this._putBlockOrHeader(block, isGenesis)
      this._lock.release()
    } catch (error) {
      this._lock.release()
      throw error
    }
  }

  /**
   * Adds many headers to the blockchain.
   *
   * @param headers - The headers to be added to the blockchain
   */
  async putHeaders(headers: Array<any>) {
    for (let i = 0; i < headers.length; i++) {
      await this.putHeader(headers[i])
    }
  }

  /**
   * Adds a header to the blockchain.
   *
   * @param header - The header to be added to the blockchain
   */
  async putHeader(header: BlockHeader) {
    if (!this._initDone) {
      await this._init()
    }

    await this._lock.wait()
    try {
      await this._putBlockOrHeader(header)
      this._lock.release()
    } catch (error) {
      this._lock.release()
      throw error
    }
  }

  /**
   * @hidden
   */
  async _putBlockOrHeader(item: Block | BlockHeader, isGenesis?: boolean) {
    const block = item instanceof BlockHeader ? new Block(item) : item

    const hash = block.hash()
    const { header } = block
    const { number } = header
    const td = header.difficulty.clone()
    const currentTd = { header: new BN(0), block: new BN(0) }
    const dbOps: DBOp[] = []

    if (block._common.chainId() !== this._common.chainId()) {
      throw new Error('Chain mismatch while trying to put block or header')
    }

    if (this._validateBlocks && !isGenesis && !block.isGenesis()) {
      await block.validate(this)
    }

    if (this._validatePow && this.ethash) {
      const valid = await this.ethash.verifyPOW(block)
      if (!valid) {
        throw new Error('invalid POW')
      }
    }

    if (!isGenesis) {
      // set total difficulty in the current context scope
      if (this._headHeader) {
        currentTd.header = await this._getTd(this._headHeader)
      }
      if (this._headBlock) {
        currentTd.block = await this._getTd(this._headBlock)
      }

      // calculate the total difficulty of the new block
      const parentTd = await this._getTd(header.parentHash, number.subn(1))
      td.iadd(parentTd)
    }

    const rebuildInfo = async () => {
      const type = 'put'
      const keyEncoding = 'binary'
      const valueEncoding = 'binary'

      // save block and total difficulty to the database
      let key = tdKey(number, hash)
      let value = rlp.encode(td)
      dbOps.push({ type, key, value, keyEncoding, valueEncoding })
      this.dbManager._cache.td.set(key, value)

      // save header
      key = headerKey(number, hash)
      value = header.serialize()
      dbOps.push({ type, key, value, keyEncoding, valueEncoding })
      this.dbManager._cache.header.set(key, value)

      // store body if it exists
      if (isGenesis || block.transactions.length || block.uncleHeaders.length) {
        key = bodyKey(number, hash)
        value = rlp.encode(block.raw().slice(1))
        dbOps.push({ type, key, value, keyEncoding, valueEncoding })
        this.dbManager._cache.body.set(key, value)
      }

      // if total difficulty is higher than current, add it to canonical chain
      if (block.isGenesis() || td.gt(currentTd.header)) {
        this._headHeader = hash
        if (item instanceof Block) {
          this._headBlock = hash
        }
        if (block.isGenesis()) {
          this._genesis = hash
        }

        // delete higher number assignments and overwrite stale canonical chain
        await this._deleteStaleAssignments(number.addn(1), hash, dbOps)
        await this._rebuildCanonical(header, dbOps)
      } else {
        if (td.gt(currentTd.block) && item instanceof Block) {
          this._headBlock = hash
        }
        // save hash to number lookup info even if rebuild not needed
        key = hashToNumberKey(hash)
        value = bufBE8(number)
        dbOps.push({ type, key, keyEncoding, valueEncoding, value })
        this.dbManager._cache.hashToNumber.set(key, value)
      }
    }

    await rebuildInfo()

    const ops = dbOps.concat(this._saveHeadOps())
    await this.dbManager.batch(ops)
  }

  /**
   * Gets a block by its hash.
   *
   * @param blockId - The block's hash or number
   */
  async getBlock(blockId: Buffer | number | BN): Promise<Block> {
    if (!this._initDone) {
      await this._init()
    }

    return this._getBlock(blockId)
  }

  /**
   * @hidden
   */
  async _getBlock(blockId: Buffer | number | BN) {
    return this.dbManager.getBlock(blockId)
  }

  /**
   * Looks up many blocks relative to blockId
   *
   * @param blockId - The block's hash or number
   * @param maxBlocks - Max number of blocks to return
   * @param skip - Number of blocks to skip apart
   * @param reverse - Fetch blocks in reverse
   */
  async getBlocks(
    blockId: Buffer | BN | number,
    maxBlocks: number,
    skip: number,
    reverse: boolean,
  ): Promise<Block[]> {
    const blocks: Block[] = []
    let i = -1

    const nextBlock = async (blockId: Buffer | BN | number): Promise<any> => {
      let block
      try {
        block = await this.getBlock(blockId)
      } catch (error) {
        if (error.type !== 'NotFoundError') {
          throw error
        }
        return
      }
      i++
      const nextBlockNumber = block.header.number.addn(reverse ? -1 : 1)
      if (i !== 0 && skip && i % (skip + 1) !== 0) {
        return await nextBlock(nextBlockNumber)
      }
      blocks.push(block)
      if (blocks.length < maxBlocks) {
        await nextBlock(nextBlockNumber)
      }
    }

    await nextBlock(blockId)
    return blocks
  }

  /**
   * Given an ordered array, returns an array of hashes that are not in the blockchain yet.
   *
   * @param hashes - Ordered array of hashes
   */
  async selectNeededHashes(hashes: Array<Buffer>) {
    let max: number
    let mid: number
    let min: number

    max = hashes.length - 1
    mid = min = 0

    while (max >= min) {
      let number
      try {
        number = await this.dbManager.hashToNumber(hashes[mid])
      } catch (error) {
        if (error.type !== 'NotFoundError') {
          throw error
        }
      }
      if (number) {
        min = mid + 1
      } else {
        max = mid - 1
      }
      mid = Math.floor((min + max) / 2)
    }
    return hashes.slice(min)
  }

  /**
   * @hidden
   */
  _saveHeadOps(): DBOp[] {
    return [
      {
        type: 'put',
        key: 'heads',
        keyEncoding: 'binary',
        valueEncoding: 'json',
        value: this._heads,
      },
      {
        type: 'put',
        key: HEAD_HEADER_KEY,
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: this._headHeader!,
      },
      {
        type: 'put',
        key: HEAD_BLOCK_KEY,
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: this._headBlock!,
      },
    ]
  }

  /**
   * @hidden
   */
  async _saveHeads() {
    return this.dbManager.batch(this._saveHeadOps())
  }

  /**
   * Delete canonical number assignments for specified number and above
   *
   * @hidden
   */
  async _deleteStaleAssignments(number: BN, headHash: Buffer, ops: DBOp[]) {
    let hash: Buffer
    try {
      hash = await this.dbManager.numberToHash(number)
    } catch (error) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
      return
    }

    const type = 'del'
    const key = numberToHashKey(number)
    const keyEncoding = 'binary'

    ops.push({ type, key, keyEncoding })
    this.dbManager._cache.numberToHash.del(key)

    // reset stale iterator heads to current canonical head
    Object.keys(this._heads).forEach((name) => {
      if (this._heads[name].equals(hash)) {
        this._heads[name] = headHash
      }
    })

    // reset stale headBlock to current canonical
    if (this._headBlock?.equals(hash)) {
      this._headBlock = headHash
    }

    await this._deleteStaleAssignments(number.addn(1), headHash, ops)
  }

  /**
   * Overwrites stale canonical number assignments.
   *
   * @hidden
   */
  async _rebuildCanonical(header: BlockHeader, ops: DBOp[]) {
    const hash = header.hash()
    const { number } = header

    const saveLookups = async (hash: Buffer, number: BN) => {
      const type = 'put'
      const keyEncoding = 'binary'
      const valueEncoding = 'binary'

      let key = numberToHashKey(number)
      let value = hash
      ops.push({ type, key, keyEncoding, valueEncoding, value })
      this.dbManager._cache.numberToHash.set(key, value)

      key = hashToNumberKey(hash)
      value = bufBE8(number)
      ops.push({ type, key, keyEncoding, valueEncoding, value })
      this.dbManager._cache.hashToNumber.set(key, value)
    }

    // handle genesis block
    if (number.isZero()) {
      await saveLookups(hash, number)
      return
    }

    let staleHash: Buffer | null = null
    try {
      staleHash = await this.dbManager.numberToHash(number)
    } catch (error) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
    }

    if (!staleHash || !hash.equals(staleHash)) {
      await saveLookups(hash, number)

      // flag stale head for reset
      Object.keys(this._heads).forEach((name) => {
        if (staleHash && this._heads[name].equals(staleHash)) {
          this._staleHeads = this._staleHeads || []
          this._staleHeads.push(name)
        }
      })
      // flag stale headBlock for reset
      if (staleHash && this._headBlock?.equals(staleHash)) {
        this._staleHeadBlock = true
      }

      try {
        const parentHeader = await this._getHeader(header.parentHash, number.subn(1))
        await this._rebuildCanonical(parentHeader, ops)
      } catch (error) {
        this._staleHeads = []
        if (error.type !== 'NotFoundError') {
          throw error
        }
      }
    } else {
      // set stale heads to last previously valid canonical block
      this._staleHeads.forEach((name: string) => {
        this._heads[name] = hash
      })
      this._staleHeads = []
      // set stale headBlock to last previously valid canonical block
      if (this._staleHeadBlock) {
        this._headBlock = hash
        this._staleHeadBlock = false
      }
    }
  }

  /**
   * Deletes a block from the blockchain. All child blocks in the chain are deleted and any
   * encountered heads are set to the parent block.
   *
   * @param blockHash - The hash of the block to be deleted
   */
  async delBlock(blockHash: Buffer) {
    if (!this._initDone) {
      await this._init()
    }

    await this._lock.wait()
    try {
      await this._delBlock(blockHash)
      this._lock.release()
    } catch (error) {
      this._lock.release()
      throw error
    }
  }

  /**
   * @hidden
   */
  async _delBlock(blockHash: Buffer) {
    const dbOps: DBOp[] = []
    let blockHeader = null
    let blockNumber: BN
    let parentHash: Buffer
    let inCanonical: boolean

    // get header
    const header = await this._getHeader(blockHash)
    blockHeader = header
    blockNumber = blockHeader.number
    parentHash = blockHeader.parentHash

    // check if block is in the canonical chain
    let canonicalHash = null
    try {
      canonicalHash = await this.dbManager.numberToHash(blockNumber)
    } catch (error) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
    }
    inCanonical = !!canonicalHash && canonicalHash.equals(blockHash)

    // delete the block, and if block is in the canonical chain, delete all
    // children as well
    await this._delChild(blockHash, blockNumber, inCanonical ? parentHash : null, dbOps)

    // delete all number to hash mappings for deleted block number and above
    if (inCanonical) {
      await this._deleteStaleAssignments(blockNumber, parentHash, dbOps)
    }

    await this.dbManager.batch(dbOps)
  }

  /**
   * @hidden
   */
  async _delChild(hash: Buffer, number: BN, headHash: Buffer | null, ops: DBOp[]) {
    // delete header, body, hash to number mapping and td
    ops.push({
      type: 'del',
      key: headerKey(number, hash),
      keyEncoding: 'binary',
    })
    this.dbManager._cache.header.del(headerKey(number, hash))

    ops.push({
      type: 'del',
      key: bodyKey(number, hash),
      keyEncoding: 'binary',
    })
    this.dbManager._cache.body.del(bodyKey(number, hash))

    ops.push({
      type: 'del',
      key: hashToNumberKey(hash),
      keyEncoding: 'binary',
    })
    this.dbManager._cache.hashToNumber.del(hashToNumberKey(hash))

    ops.push({
      type: 'del',
      key: tdKey(number, hash),
      keyEncoding: 'binary',
    })
    this.dbManager._cache.td.del(tdKey(number, hash))

    if (!headHash) {
      return
    }

    if (this._headHeader?.equals(hash)) {
      this._headHeader = headHash
    }

    if (this._headBlock?.equals(hash)) {
      this._headBlock = headHash
    }

    try {
      const childHeader = await this._getCanonicalHeader(number.addn(1))
      await this._delChild(childHeader.hash(), childHeader.number, headHash, ops)
    } catch (error) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
    }
  }

  /**
   * Iterates through blocks starting at the specified iterator head and calls the onBlock function
   * on each block. The current location of an iterator head can be retrieved using the `getHead()`
   * method.
   *
   * @param name - Name of the state root head
   * @param onBlock - Function called on each block with params (block, reorg)
   */
  async iterator(name: string, onBlock: OnBlock) {
    if (!this._initDone) {
      await this._init()
    }

    return this._iterator(name, onBlock)
  }

  /**
   * @hidden
   */
  async _iterator(name: string, onBlock: OnBlock) {
    const blockHash = this._heads[name] || this._genesis
    let blockNumber: BN
    let lastBlock: Block | undefined

    if (!blockHash) {
      return
    }

    const number = await this.dbManager.hashToNumber(blockHash)
    blockNumber = number.addn(1)

    while (blockNumber) {
      try {
        const block = await this.getBlock(blockNumber)

        if (!block) {
          break
        }

        this._heads[name] = block.hash()
        const reorg = lastBlock ? lastBlock.hash().equals(block.header.parentHash) : false
        lastBlock = block
        await onBlock(block, reorg)
        blockNumber.iaddn(1)
      } catch (error) {
        if (error.type !== 'NotFoundError') {
          throw error
        }
        break
      }
    }

    await this._saveHeads()
  }

  /**
   * Gets a header by hash and number. Header can exist outside the canonical chain
   *
   * @hidden
   */
  async _getHeader(hash: Buffer, number?: BN) {
    if (!number) {
      number = await this.dbManager.hashToNumber(hash)
    }
    return this.dbManager.getHeader(hash, number)
  }

  /**
   * Gets a header by number. Header must be in the canonical chain
   *
   * @hidden
   */
  async _getCanonicalHeader(number: BN) {
    const hash = await this.dbManager.numberToHash(number)
    return this._getHeader(hash, number)
  }

  /**
   * Gets total difficulty for a block specified by hash and number
   *
   * @hidden
   */
  async _getTd(hash: Buffer, number?: BN) {
    if (!number) {
      number = await this.dbManager.hashToNumber(hash)
    }
    return this.dbManager.getTd(hash, number)
  }
}
