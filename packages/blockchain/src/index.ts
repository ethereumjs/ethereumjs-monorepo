import Semaphore from 'semaphore-async-await'
import { BN } from 'ethereumjs-util'
import { Block, BlockHeader } from '@ethereumjs/block'
import Ethash from '@ethereumjs/ethash'
import Common from '@ethereumjs/common'
import { DBManager } from './db/manager'
import {
  DBOp,
  DBSetBlockOrHeader,
  DBSetTD,
  DBSetHashToNumber,
  DBSaveLookups,
} from './db/helpers'
import { DBTarget } from './db/operation'

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

  /**
   * If a genesis block is present in the provided `db`, then this genesis block will be used.
   * If there is no genesis block in the `db`, use this `genesisBlock`: if none is provided, use the standard genesis block.
   */
  genesisBlock?: Block
}

/**
 * This class stores and interacts with blocks.
 */
export default class Blockchain implements BlockchainInterface {
  db: LevelUp
  dbManager: DBManager
  ethash?: Ethash

  private _genesis?: Buffer // the genesis hash of this blockchain
  private _headBlockHash?: Buffer // the hash of the current head block
  private _headHeaderHash?: Buffer // the hash of the current head header
  private _heads: { [key: string]: Buffer } // a Map which stores the head of each key (for instance the "vm" key)

  private _initDone: boolean
  public initPromise: Promise<void>
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
      this._common = new Common({
        chain: DEFAULT_CHAIN,
        hardfork: DEFAULT_HARDFORK,
      })
    }

    this._validatePow = opts.validatePow !== undefined ? opts.validatePow : true
    this._validateBlocks = opts.validateBlocks !== undefined ? opts.validateBlocks : true

    this.db = opts.db ? opts.db : level()
    this.dbManager = new DBManager(this.db, this._common)

    if (this._validatePow) {
      this.ethash = new Ethash(this.db)
    }

    this._heads = {}

    this._lock = new Semaphore(1)
    this._initDone = false

    if (opts.genesisBlock && !opts.genesisBlock.isGenesis()) {
      throw 'supplied block is not a genesis block'
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.initPromise = this._init(opts.genesisBlock)
  }

  public static async create(opts: BlockchainOptions = {}) {
    const blockchain = new Blockchain(opts)
    await blockchain.initPromise!.catch((e) => {
      throw e
    })
    return blockchain
  }

  /**
   * Returns an object with metadata about the Blockchain. It's defined for backwards compatibility.
   */
  get meta() {
    return {
      rawHead: this._headHeaderHash,
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
  private async _init(genesisBlock?: Block): Promise<void> {
    let genesisHash
    try {
      genesisHash = await this.dbManager.numberToHash(new BN(0))
      const genesisBlock = await this.dbManager.getBlock(genesisHash)
      await this._putBlockOrHeader(genesisBlock)
      this._genesis = genesisHash
    } catch (error) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
      if (genesisBlock) {
        await this._putBlockOrHeader(genesisBlock)
      } else {
        await this._setCanonicalGenesisBlock()
      }
      genesisHash = this._genesis
    }
    // load verified iterator heads
    try {
      const heads = await this.dbManager.getHeads()
      this._heads = heads
    } catch (error) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
      this._heads = {}
    }

    // load headerchain head
    try {
      const hash = await this.dbManager.getHeadHeader()
      this._headHeaderHash = hash
    } catch (error) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
      this._headHeaderHash = genesisHash
    }

    // load blockchain head
    try {
      const hash = await this.dbManager.getHeadBlock()
      this._headBlockHash = hash
    } catch (error) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
      this._headBlockHash = genesisHash
    }
    this._initDone = true
  }

  /**
   * Perform the `action` function after we have initialized this module and have acquired a lock
   * @param action - the action function to run after initializing and acquiring a lock
   * @hidden
   */
  private async initAndLock<T>(action: () => Promise<T>): Promise<T> {
    await this.initPromise
    return await this.runWithLock(action)
  }

  /**
   * Run a function after acquiring a lock. It is implied that we have already initialized the module (or we are calling this from the init function, like `_setCanonicalGenesisBlock`)
   * @param action - function to run after acquiring a lock
   * @hidden
   */
  private async runWithLock<T>(action: () => Promise<T>): Promise<T> {
    try {
      await this._lock.acquire()
      const value = await action()
      this._lock.release()
      return value
    } finally {
      this._lock.release()
    }
  }

  /**
   * Sets the default genesis block
   *
   * @hidden
   */
  private async _setCanonicalGenesisBlock() {
    const common = new Common({
      chain: this._common.chainId(),
      hardfork: 'chainstart',
    })
    const genesis = Block.genesis({}, { common })
    await this._putBlockOrHeader(genesis)
  }

  /**
   * Puts the genesis block in the database
   *
   * @param genesis - The genesis block to be added
   */
  async putGenesis(genesis: Block) {
    if (!genesis.isGenesis()) {
      throw new Error('Supplied block is not a genesis block')
    }
    await this.putBlock(genesis)
  }

  /**
   * Returns the specified iterator head.
   *
   * @param name - Optional name of the state root head (default: 'vm')
   */
  async getHead(name = 'vm'): Promise<Block> {
    return await this.initAndLock<Block>(async () => {
      // if the head is not found return the headHeader
      const hash = this._heads[name] || this._headBlockHash
      if (!hash) {
        throw new Error('No head found.')
      }

      const block = await this._getBlock(hash)
      return block
    })
  }

  /**
   * Returns the latest header in the canonical chain.
   */
  async getLatestHeader(): Promise<BlockHeader> {
    return await this.initAndLock<BlockHeader>(async () => {
      if (!this._headHeaderHash) {
        throw new Error('No head header set')
      }

      const block = await this._getBlock(this._headHeaderHash)
      return block.header
    })
  }

  /**
   * Returns the latest full block in the canonical chain.
   */
  async getLatestBlock(): Promise<Block> {
    return this.initAndLock<Block>(async () => {
      if (!this._headBlockHash) {
        throw new Error('No head block set')
      }

      const block = this._getBlock(this._headBlockHash)
      return block
    })
  }

  /**
   * Adds many blocks to the blockchain.
   *
   * @param blocks - The blocks to be added to the blockchain
   */
  async putBlocks(blocks: Block[]) {
    await this.initPromise
    for (let i = 0; i < blocks.length; i++) {
      await this.putBlock(blocks[i])
    }
  }

  /**
   * Adds a block to the blockchain.
   *
   * @param block - The block to be added to the blockchain
   */
  async putBlock(block: Block) {
    await this.initPromise
    await this._putBlockOrHeader(block)
  }

  /**
   * Adds many headers to the blockchain.
   *
   * @param headers - The headers to be added to the blockchain
   */
  async putHeaders(headers: Array<any>) {
    await this.initPromise
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
    await this.initPromise
    await this._putBlockOrHeader(header)
  }

  /**
   * @hidden
   */
  async _putBlockOrHeader(item: Block | BlockHeader) {
    const block = item instanceof BlockHeader ? new Block(item) : item
    const isGenesis = block.isGenesis()

    // we cannot overwrite the Genesis block after initializing the Blockchain

    if (this._initDone && isGenesis) {
      throw new Error('Cannot put a new Genesis block: create a new Blockchain')
    }

    const { header } = block
    const blockHash = header.hash()
    const blockNumber = header.number
    const td = header.difficulty.clone()
    const currentTd = { header: new BN(0), block: new BN(0) }
    let dbOps: DBOp[] = []

    if (block._common.chainId() !== this._common.chainId()) {
      throw new Error('Chain mismatch while trying to put block or header')
    }

    if (this._validateBlocks && !isGenesis) {
      // this calls into `getBlock`, which is why we cannot lock yet
      await block.validate(this)
    }

    if (this._validatePow && this.ethash) {
      const valid = await this.ethash.verifyPOW(block)
      if (!valid) {
        throw new Error('invalid POW')
      }
    }

    await this.runWithLock<void>(async () => {
      if (!isGenesis) {
        // set total difficulty in the current context scope
        if (this._headHeaderHash) {
          currentTd.header = await this._getTd(this._headHeaderHash)
        }
        if (this._headBlockHash) {
          currentTd.block = await this._getTd(this._headBlockHash)
        }

        // calculate the total difficulty of the new block
        const parentTd = await this._getTd(header.parentHash, blockNumber.subn(1))
        td.iadd(parentTd)
      }

      const rebuildInfo = async () => {
        // save block and total difficulty to the database
        dbOps = dbOps.concat(DBSetTD(td, blockNumber, blockHash))

        // save header/block
        dbOps = dbOps.concat(DBSetBlockOrHeader(block))

        // if total difficulty is higher than current, add it to canonical chain
        if (block.isGenesis() || td.gt(currentTd.header)) {
          this._headHeaderHash = blockHash
          if (item instanceof Block) {
            this._headBlockHash = blockHash
          }

          // TODO SET THIS IN CONSTRUCTOR
          if (block.isGenesis()) {
            this._genesis = blockHash
          }

          // delete higher number assignments and overwrite stale canonical chain
          await this._deleteCanonicalChainReferences(blockNumber.addn(1), blockHash, dbOps)
          // from the current header block, check the blockchain in reverse (i.e. traverse `parentHash`) until `numberToHash` matches the current number/hash in the canonical chain
          // also: overwrite any heads if these heads are stale in `_heads` and `_headBlockHash`
          await this._rebuildCanonical(header, dbOps)
        } else {
          // the TD is lower than the current highest TD so we will add the block to the DB, but will not mark it as the canonical chain.
          if (td.gt(currentTd.block) && item instanceof Block) {
            this._headBlockHash = blockHash
          }
          // save hash to number lookup info even if rebuild not needed
          dbOps.push(DBSetHashToNumber(blockHash, blockNumber))
        }
      }

      await rebuildInfo()

      const ops = dbOps.concat(this._saveHeadOps())
      await this.dbManager.batch(ops)
    })
  }

  /**
   * Gets a block by its hash.
   *
   * @param blockId - The block's hash or number
   */
  async getBlock(blockId: Buffer | number | BN): Promise<Block> {
    return await this.initAndLock<Block>(async () => {
      const block = await this._getBlock(blockId)
      return block
    })
  }

  /**
   * @hidden
   */
  async _getBlock(blockId: Buffer | number | BN) {
    return this.dbManager.getBlock(blockId)
  }

  /**
   * Looks up many blocks relative to blockId
   * Note: due to `GetBlockHeaders (0x03)` (ETH wire protocol) we have to support skip/reverse as well.
   * @param blockId - The block's hash or number
   * @param maxBlocks - Max number of blocks to return
   * @param skip - Number of blocks to skip apart
   * @param reverse - Fetch blocks in reverse
   */
  async getBlocks(
    blockId: Buffer | BN | number,
    maxBlocks: number,
    skip: number,
    reverse: boolean
  ): Promise<Block[]> {
    return await this.initAndLock<Block[]>(async () => {
      const blocks: Block[] = []
      let i = -1

      const nextBlock = async (blockId: Buffer | BN | number): Promise<any> => {
        let block
        try {
          block = await this._getBlock(blockId)
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
    })
  }

  /**
   * Given an ordered array, returns an array of hashes that are not in the blockchain yet.
   * Uses binary search to find out what hashes are missing. Therefore, the array needs to be ordered upon number.
   * @param hashes - Ordered array of hashes (ordered on `number`).
   */
  async selectNeededHashes(hashes: Array<Buffer>): Promise<Buffer[]> {
    return await this.initAndLock<Buffer[]>(async () => {
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
    })
  }

  /**
   * Builds the `DatabaseOperation[]` list which describes the DB operations to write the heads, head header hash and the head header block to the DB
   * @hidden
   */
  private _saveHeadOps(): DBOp[] {
    return [
      DBOp.set(DBTarget.Heads, this._heads),
      DBOp.set(DBTarget.HeadHeader, this._headHeaderHash!),
      DBOp.set(DBTarget.HeadBlock, this._headBlockHash!),
    ]
  }

  /**
   * Gets the `DatabaseOperation[]` list to save `_heads`, `_headHeaderHash` and `_headBlockHash` and writes these to the DB
   * @hidden
   */
  private async _saveHeads() {
    return this.dbManager.batch(this._saveHeadOps())
  }

  /**
   * Pushes DB operations to delete canonical number assignments for specified block number and above
   * Also
   * @param blockNumber - the block number from which we start deleting canonical chain assignments (including this block)
   * @param headHash - the hash of the current canonical chain head. The _heads reference matching any hash of any of the deleted blocks will be set to this
   * @param ops - the DatabaseOperation list to write DatabaseOperations to
   * @hidden
   */
  private async _deleteCanonicalChainReferences(
    blockNumber: BN,
    headHash: Buffer,
    ops: DBOp[]
  ) {
    let hash: Buffer
    try {
      hash = await this.dbManager.numberToHash(blockNumber)
    } catch (error) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
      return
    }

    ops.push(DBOp.del(DBTarget.NumberToHash, { blockNumber }))

    // reset stale iterator heads to current canonical head
    Object.keys(this._heads).forEach((name) => {
      if (this._heads[name].equals(hash)) {
        this._heads[name] = headHash
      }
    })

    // reset stale headBlock to current canonical
    if (this._headBlockHash?.equals(hash)) {
      this._headBlockHash = headHash
    }

    await this._deleteCanonicalChainReferences(blockNumber.addn(1), headHash, ops)
  }

  /**
   * Given a `header`, put all operations to change the canonical chain directly into `ops`
   * @param header - The canonical header.
   * @param ops - The database operations list.
   * @hidden
   */
  async _rebuildCanonical(header: BlockHeader, ops: DBOp[]) {
    const blockHash = header.hash()
    const blockNumber = header.number

    // track the staleHash: this is the hash currently in the DB which matches the block number of the provided header.
    let staleHash: Buffer | null = null
    let staleHeads: string[] = []
    let staleHeadBlock = false

    do {
      // handle genesis block
      if (blockNumber.isZero()) {
        DBSaveLookups(blockHash, blockNumber).map((op) => {
          ops.push(op)
        })
        break
      }

      try {
        staleHash = await this.dbManager.numberToHash(blockNumber)
      } catch (error) {
        if (error.type !== 'NotFoundError') {
          throw error
        }
      }

      if (!staleHash || !blockHash.equals(staleHash)) {
        DBSaveLookups(blockHash, blockNumber).map((op) => {
          ops.push(op)
        })

        // mark each key `_heads` which is currently set to the hash in the DB as stale to overwrite this later.
        Object.keys(this._heads).forEach((name) => {
          if (staleHash && this._heads[name].equals(staleHash)) {
            staleHeads.push(name)
          }
        })
        // flag stale headBlock for reset
        if (staleHash && this._headBlockHash?.equals(staleHash)) {
          staleHeadBlock = true
        }

        try {
          header = await this._getHeader(header.parentHash, blockNumber.subn(1))
        } catch (error) {
          staleHeads = []
          if (error.type !== 'NotFoundError') {
            throw error
          }
        }
      }
    } while (staleHash)
    // the stale hash is equal to the blockHash
    // set stale heads to last previously valid canonical block
    staleHeads.forEach((name: string) => {
      this._heads[name] = blockHash
    })
    // set stale headBlock to last previously valid canonical block
    if (staleHeadBlock) {
      this._headBlockHash = blockHash
    }
  }

  /**
   * Completely deletes a block from the blockchain including any references to this block. All child blocks in the chain are deleted and any
   * encountered heads are set to the parent block. If the block was in the canonical chain, also update the canonical chain and set the head of the canonical chain to the parent block.
   *
   * @param blockHash - The hash of the block to be deleted
   */
  async delBlock(blockHash: Buffer) {
    await this.initAndLock<void>(async () => {
      await this._delBlock(blockHash)
    })
  }

  /**
   * @hidden
   */
  async _delBlock(blockHash: Buffer) {
    const dbOps: DBOp[] = []

    // get header
    const header = await this._getHeader(blockHash)
    const blockHeader = header
    const blockNumber = blockHeader.number
    const parentHash = blockHeader.parentHash

    // check if block is in the canonical chain
    let canonicalHash = null
    try {
      canonicalHash = await this.dbManager.numberToHash(blockNumber)
    } catch (error) {
      if (error.type !== 'NotFoundError') {
        throw error
      }
    }
    const inCanonical = !!canonicalHash && canonicalHash.equals(blockHash)

    // delete the block, and if block is in the canonical chain, delete all
    // children as well
    await this._delChild(blockHash, blockNumber, inCanonical ? parentHash : null, dbOps)

    // delete all number to hash mappings for deleted block number and above
    if (inCanonical) {
      await this._deleteCanonicalChainReferences(blockNumber, parentHash, dbOps)
    }

    await this.dbManager.batch(dbOps)
  }

  /**
   * Updates the `DatabaseOperation` list to delete a block from the DB, identified by `blockHash` and `blockNumber`. Deletes fields from `Header`, `Body`, `HashToNumber` and `TotalDifficulty` tables.
   * If child blocks of this current block are in the canonical chain, delete these as well. Does not actually commit these changes to the DB.
   * Sets `_headHeaderHash` and `_headBlockHash` to `headHash` if any of these matches the current child to be deleted.
   * @param blockHash - the block hash to delete
   * @param blockNumber - the number corresponding to the block hash
   * @param headHash - the current head of the chain (if null, do not update `_headHeaderHash` and `_headBlockHash`)
   * @param ops - the `DatabaseOperation` list to add the delete operations to
   * @hidden
   */
  async _delChild(blockHash: Buffer, blockNumber: BN, headHash: Buffer | null, ops: DBOp[]) {
    // delete header, body, hash to number mapping and td
    ops.push(DBOp.del(DBTarget.Header, { blockHash, blockNumber }))
    ops.push(DBOp.del(DBTarget.Body, { blockHash, blockNumber }))
    ops.push(DBOp.del(DBTarget.HashToNumber, { blockHash }))
    ops.push(DBOp.del(DBTarget.TotalDifficulty, { blockHash, blockNumber }))

    if (!headHash) {
      return
    }

    if (this._headHeaderHash?.equals(blockHash)) {
      this._headHeaderHash = headHash
    }

    if (this._headBlockHash?.equals(blockHash)) {
      this._headBlockHash = headHash
    }

    try {
      const childHeader = await this._getCanonicalHeader(blockNumber.addn(1))
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
    return this._iterator(name, onBlock)
  }

  /**
   * @hidden
   */
  private async _iterator(name: string, onBlock: OnBlock) {
    await this.initAndLock<void>(async () => {
      const blockHash = this._heads[name] || this._genesis
      let lastBlock: Block | undefined

      if (!blockHash) {
        return
      }

      const number = await this.dbManager.hashToNumber(blockHash)
      const blockNumber = number.addn(1)

      // eslint-disable-next-line no-constant-condition
      while (true) {
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
    })
  }

  /* Helper functions */

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
