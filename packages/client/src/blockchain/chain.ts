import { Block, BlockHeader } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { ConsensusAlgorithm, Hardfork } from '@ethereumjs/common'
import { equalsBytes } from 'ethereum-cryptography/utils'

import { LevelDB } from '../execution/level'
import { Event } from '../types'

import type { Config } from '../config'
import type { DB, DBObject } from '@ethereumjs/util'
import type { AbstractLevel } from 'abstract-level'

/**
 * The options that the Blockchain constructor can receive.
 */
export interface ChainOptions {
  /**
   * Client configuration instance
   */
  config: Config

  /**
   * Database to store blocks and metadata. Should be an abstract-leveldown compliant store.
   */
  chainDB?: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>

  /**
   * Specify a blockchain which implements the Chain interface
   */
  blockchain?: Blockchain
}

/**
 * Returns properties of the canonical blockchain.
 */
export interface ChainBlocks {
  /**
   * The latest block in the chain
   */
  latest: Block | null

  /**
   * The block as signalled `finalized` in the fcU
   * This corresponds to the last finalized beacon block
   */
  finalized: Block | null

  /**
   * The block as signalled `safe` in the fcU
   * This corresponds to the last justified beacon block
   */
  safe: Block | null

  /**
   * The total difficulty of the blockchain
   */
  td: bigint

  /**
   * The height of the blockchain
   */
  height: bigint
}

/**
 * Returns properties of the canonical headerchain.
 */
export interface ChainHeaders {
  /**
   * The latest header in the chain
   */
  latest: BlockHeader | null

  /**
   * The block as signalled `finalized` in the fcU
   * This corresponds to the last finalized beacon block
   */
  finalized: BlockHeader | null

  /**
   * The block as signalled `safe` in the fcU
   * This corresponds to the last justified beacon block
   */
  safe: BlockHeader | null

  /**
   * The total difficulty of the headerchain
   */
  td: bigint

  /**
   * The height of the headerchain
   */
  height: bigint
}

/**
 * Blockchain
 * @memberof module:blockchain
 */
export class Chain {
  public config: Config
  public chainDB: DB<string | Uint8Array, string | Uint8Array | DBObject>
  public blockchain: Blockchain
  public opened: boolean

  private _headers: ChainHeaders = {
    latest: null,
    finalized: null,
    safe: null,
    td: BigInt(0),
    height: BigInt(0),
  }

  private _blocks: ChainBlocks = {
    latest: null,
    finalized: null,
    safe: null,
    td: BigInt(0),
    height: BigInt(0),
  }

  /**
   * Safe creation of a Chain object awaiting the initialization
   * of the underlying Blockchain object.
   *
   * @param options
   */
  public static async create(options: ChainOptions) {
    let validateConsensus = false
    if (options.config.chainCommon.consensusAlgorithm() === ConsensusAlgorithm.Clique) {
      validateConsensus = true
    }

    options.blockchain =
      options.blockchain ??
      new (Blockchain as any)({
        db: new LevelDB(options.chainDB),
        common: options.config.chainCommon,
        hardforkByHeadBlockNumber: true,
        validateBlocks: true,
        validateConsensus,
      })

    return new this(options)
  }

  /**
   * Creates new chain
   *
   * Do not use directly but instead use the static async `create()` constructor
   * for concurrency safe initialization.
   *
   * @param options
   */
  protected constructor(options: ChainOptions) {
    this.config = options.config
    this.blockchain = options.blockchain!

    this.chainDB = this.blockchain.db
    this.opened = false
  }

  /**
   * Resets _header, _blocks
   */
  private reset() {
    this._headers = {
      latest: null,
      finalized: null,
      safe: null,
      td: BigInt(0),
      height: BigInt(0),
    }
    this._blocks = {
      latest: null,
      finalized: null,
      safe: null,
      td: BigInt(0),
      height: BigInt(0),
    }
  }

  /**
   * Network ID
   */
  get networkId(): bigint {
    return this.config.chainCommon.networkId()
  }

  /**
   * Genesis block for the chain
   */
  get genesis() {
    return this.blockchain.genesisBlock
  }

  /**
   * Returns properties of the canonical headerchain.
   */
  get headers(): ChainHeaders {
    return { ...this._headers }
  }

  /**
   * Returns properties of the canonical blockchain.
   */
  get blocks(): ChainBlocks {
    return { ...this._blocks }
  }

  /**
   * Open blockchain and wait for database to load
   * @returns false if chain is already open, otherwise void
   */
  async open(): Promise<boolean | void> {
    if (this.opened) return false
    await this.blockchain.db.open()
    await (this.blockchain as any)._init()
    this.opened = true
    await this.update(false)

    this.config.chainCommon.on('hardforkChanged', async (hardfork: string) => {
      const block = this.config.chainCommon.hardforkBlock()
      this.config.logger.info(`New hardfork reached 🪢 ! hardfork=${hardfork} block=${block}`)
    })
  }

  /**
   * Closes chain
   * @returns false if chain is closed, otherwise void
   */
  async close(): Promise<boolean | void> {
    if (!this.opened) return false
    this.reset()
    await (this.blockchain.db as any)?.close?.()
    this.opened = false
  }

  /**
   * Resets the chain to canonicalHead number
   */
  async resetCanonicalHead(canonicalHead: bigint): Promise<boolean | void> {
    if (!this.opened) return false
    await this.blockchain.resetCanonicalHead(canonicalHead)
    return this.update(false)
  }

  /**
   * Update blockchain properties (latest block, td, height, etc...)
   * @param emit Emit a `CHAIN_UPDATED` event
   * @returns false if chain is closed, otherwise void
   */
  async update(emit = true): Promise<boolean | void> {
    if (!this.opened) return false

    const headers: ChainHeaders = {
      latest: null,
      finalized: null,
      safe: null,
      td: BigInt(0),
      height: BigInt(0),
    }
    const blocks: ChainBlocks = {
      latest: null,
      finalized: null,
      safe: null,
      td: BigInt(0),
      height: BigInt(0),
    }

    headers.latest = await this.getCanonicalHeadHeader()
    // finalized and safe are always blocks since they have to have valid execution
    // before they can be saved in chain
    headers.finalized = (await this.getCanonicalFinalizedBlock()).header
    headers.safe = (await this.getCanonicalSafeBlock()).header

    blocks.latest = await this.getCanonicalHeadBlock()
    blocks.finalized = await this.getCanonicalFinalizedBlock()
    blocks.safe = await this.getCanonicalSafeBlock()

    headers.height = headers.latest.number
    blocks.height = blocks.latest.header.number

    headers.td = await this.getTd(headers.latest.hash(), headers.height)
    blocks.td = await this.getTd(blocks.latest.hash(), blocks.height)

    this._headers = headers
    this._blocks = blocks

    const parentTd = await this.blockchain.getParentTD(headers.latest)
    this.config.chainCommon.setHardforkByBlockNumber(
      headers.latest.number,
      parentTd,
      headers.latest.timestamp
    )

    // Check and log if this is a terminal block and next block could be merge
    if (!this.config.chainCommon.gteHardfork(Hardfork.Paris)) {
      const nextBlockHf = this.config.chainCommon.getHardforkByBlockNumber(
        headers.height + BigInt(1),
        headers.td,
        undefined
      )
      if (this.config.chainCommon.hardforkGteHardfork(nextBlockHf, Hardfork.Paris)) {
        this.config.logger.info('*'.repeat(85))
        this.config.logger.info(
          `Paris (Merge) hardfork reached 🐼 👉 👈 🐼 ! block=${headers.height} td=${headers.td}`
        )
        this.config.logger.info('-'.repeat(85))
        this.config.logger.info(' ')
        this.config.logger.info('Consensus layer client (CL) needed for continued sync:')
        this.config.logger.info(
          'https://ethereum.org/en/developers/docs/nodes-and-clients/#consensus-clients'
        )
        this.config.logger.info(' ')
        this.config.logger.info(
          'Make sure to have the JSON RPC (--rpc) and Engine API (--rpcEngine) endpoints exposed'
        )
        this.config.logger.info('and JWT authentication configured (see client README).')
        this.config.logger.info(' ')
        this.config.logger.info('*'.repeat(85))
        this.config.logger.info(
          `Transitioning to PoS! First block for CL-framed execution: block=${
            headers.height + BigInt(1)
          }`
        )
      }
    }

    if (emit) {
      this.config.events.emit(Event.CHAIN_UPDATED)
    }
  }

  /**
   * Get blocks from blockchain
   * @param block hash or number to start from
   * @param max maximum number of blocks to get
   * @param skip number of blocks to skip
   * @param reverse get blocks in reverse
   * @returns an array of the blocks
   */
  async getBlocks(
    block: Uint8Array | bigint,
    max = 1,
    skip = 0,
    reverse = false
  ): Promise<Block[]> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getBlocks(block, max, skip, reverse)
  }

  /**
   * Get a block by its hash or number
   * @param block block hash or number
   * @throws if block is not found
   */
  async getBlock(block: Uint8Array | bigint): Promise<Block> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getBlock(block)
  }

  /**
   * Insert new blocks into blockchain
   * @param blocks list of blocks to add
   * @param fromEngine pass true to process post-merge blocks, otherwise they will be skipped
   * @returns number of blocks added
   */
  async putBlocks(blocks: Block[], fromEngine = false, skipUpdateEmit = false): Promise<number> {
    if (!this.opened) throw new Error('Chain closed')
    if (blocks.length === 0) return 0

    let numAdded = 0
    // filter out finalized blocks
    const newBlocks = []
    for (const block of blocks) {
      if (this.headers.finalized !== null && block.header.number <= this.headers.finalized.number) {
        const canonicalBlock = await this.getBlock(block.header.number)
        if (!equalsBytes(canonicalBlock.hash(), block.hash())) {
          throw Error(
            `Invalid putBlock for block=${block.header.number} before finalized=${this.headers.finalized.number}`
          )
        }
      } else {
        newBlocks.push(block)
      }
    }

    for (const [i, b] of newBlocks.entries()) {
      if (!fromEngine && this.config.chainCommon.gteHardfork(Hardfork.Paris)) {
        if (i > 0) {
          // emitOnLast below won't be reached, so run an update here
          await this.update(!skipUpdateEmit)
        }
        break
      }

      const td = await this.blockchain.getParentTD(b.header)
      if (b.header.number <= this.headers.height) {
        await this.blockchain.checkAndTransitionHardForkByNumber(b.header.number, td)
        await this.blockchain.consensus.setup({ blockchain: this.blockchain })
      }

      const block = Block.fromValuesArray(b.raw(), {
        common: this.config.chainCommon,
        hardforkByTTD: td,
      })

      await this.blockchain.putBlock(block)
      numAdded++
      const emitOnLast = newBlocks.length === numAdded
      await this.update(emitOnLast && !skipUpdateEmit)
    }
    return numAdded
  }

  /**
   * Get headers from blockchain
   * @param block hash or number to start from
   * @param max maximum number of headers to get
   * @param skip number of headers to skip
   * @param reverse get headers in reverse
   * @returns list of block headers
   */
  async getHeaders(
    block: Uint8Array | bigint,
    max: number,
    skip: number,
    reverse: boolean
  ): Promise<BlockHeader[]> {
    const blocks = await this.getBlocks(block, max, skip, reverse)
    return blocks.map((b) => b.header)
  }

  /**
   * Insert new headers into blockchain
   * @param headers
   * @param mergeIncludes skip adding headers after merge
   * @returns number of headers added
   */
  async putHeaders(headers: BlockHeader[], mergeIncludes = false): Promise<number> {
    if (!this.opened) throw new Error('Chain closed')
    if (headers.length === 0) return 0

    let numAdded = 0
    for (const [i, h] of headers.entries()) {
      if (!mergeIncludes && this.config.chainCommon.gteHardfork(Hardfork.Paris)) {
        if (i > 0) {
          // emitOnLast below won't be reached, so run an update here
          await this.update(true)
        }
        break
      }
      const header = BlockHeader.fromValuesArray(h.raw(), {
        common: this.config.chainCommon,
        hardforkByTTD: this.headers.td,
      })
      await this.blockchain.putHeader(header)
      numAdded++
      const emitOnLast = headers.length === numAdded
      await this.update(emitOnLast)
    }
    return numAdded
  }

  /**
   * Gets the latest header in the canonical chain
   */
  async getCanonicalHeadHeader(): Promise<BlockHeader> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getCanonicalHeadHeader()
  }

  /**
   * Gets the latest block in the canonical chain
   */
  async getCanonicalHeadBlock(): Promise<Block> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getCanonicalHeadBlock()
  }

  /**
   * Gets the latest block in the canonical chain
   */
  async getCanonicalSafeBlock(): Promise<Block> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getIteratorHead('safe')
  }

  /**
   * Gets the latest block in the canonical chain
   */
  async getCanonicalFinalizedBlock(): Promise<Block> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getIteratorHead('finalized')
  }

  /**
   * Gets total difficulty for a block
   * @param hash the block hash
   * @param num the block number
   * @returns the td
   */
  async getTd(hash: Uint8Array, num: bigint): Promise<bigint> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getTotalDifficulty(hash, num)
  }
}
