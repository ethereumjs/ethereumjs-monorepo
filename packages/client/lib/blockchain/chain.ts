import { Block, BlockHeader } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { ConsensusAlgorithm, Hardfork } from '@ethereumjs/common'

import { Event } from '../types'

import type { Config } from '../config'
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
  chainDB?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>

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
  public chainDB: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>
  public blockchain: Blockchain
  public opened: boolean

  private _headers: ChainHeaders = {
    latest: null,
    td: BigInt(0),
    height: BigInt(0),
  }

  private _blocks: ChainBlocks = {
    latest: null,
    td: BigInt(0),
    height: BigInt(0),
  }

  /**
   * Create new chain
   * @param options
   */
  constructor(options: ChainOptions) {
    this.config = options.config
    let validateConsensus = false
    if (this.config.chainCommon.consensusAlgorithm() === ConsensusAlgorithm.Clique) {
      validateConsensus = true
    }

    this.blockchain =
      options.blockchain ??
      new (Blockchain as any)({
        db: options.chainDB,
        common: this.config.chainCommon,
        hardforkByHeadBlockNumber: true,
        validateBlocks: true,
        validateConsensus,
      })

    this.chainDB = this.blockchain.db
    this.opened = false
  }

  /**
   * Resets _header, _blocks
   */
  private reset() {
    this._headers = {
      latest: null,
      td: BigInt(0),
      height: BigInt(0),
    }
    this._blocks = {
      latest: null,
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
      if (hardfork !== Hardfork.Merge) {
        const block = this.config.chainCommon.hardforkBlock()
        this.config.logger.info(`New hardfork reached 🪢 ! hardfork=${hardfork} block=${block}`)
      } else {
        const block = await this.getCanonicalHeadBlock()
        const num = block.header.number
        const td = await this.blockchain.getTotalDifficulty(block.hash(), num)
        this.config.logger.info(`Merge hardfork reached 🐼 👉 👈 🐼 ! block=${num} td=${td}`)
        this.config.logger.info(`First block for CL-framed execution: block=${num + BigInt(1)}`)
      }
    })
  }

  /**
   * Closes chain
   * @returns false if chain is closed, otherwise void
   */
  async close(): Promise<boolean | void> {
    if (!this.opened) return false
    this.reset()
    await this.blockchain.db.close()
    this.opened = false
  }

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
      td: BigInt(0),
      height: BigInt(0),
    }
    const blocks: ChainBlocks = {
      latest: null,
      td: BigInt(0),
      height: BigInt(0),
    }

    headers.latest = await this.getCanonicalHeadHeader()
    blocks.latest = await this.getCanonicalHeadBlock()

    headers.height = headers.latest.number
    blocks.height = blocks.latest.header.number

    headers.td = await this.getTd(headers.latest.hash(), headers.height)
    blocks.td = await this.getTd(blocks.latest.hash(), blocks.height)

    this._headers = headers
    this._blocks = blocks

    this.config.chainCommon.setHardforkByBlockNumber(
      headers.latest.number,
      headers.td,
      headers.latest.timestamp
    )

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
  async getBlocks(block: Buffer | bigint, max = 1, skip = 0, reverse = false): Promise<Block[]> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getBlocks(block, max, skip, reverse)
  }

  /**
   * Get a block by its hash or number
   * @param block block hash or number
   * @throws if block is not found
   */
  async getBlock(block: Buffer | bigint): Promise<Block> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getBlock(block)
  }

  /**
   * Insert new blocks into blockchain
   * @param blocks list of blocks to add
   * @param fromEngine pass true to process post-merge blocks, otherwise they will be skipped
   * @returns number of blocks added
   */
  async putBlocks(blocks: Block[], fromEngine = false): Promise<number> {
    if (!this.opened) throw new Error('Chain closed')
    if (blocks.length === 0) return 0

    let numAdded = 0
    for (const [i, b] of blocks.entries()) {
      if (!fromEngine && this.config.chainCommon.gteHardfork(Hardfork.Merge)) {
        if (i > 0) {
          // emitOnLast below won't be reached, so run an update here
          await this.update(true)
        }
        break
      }

      let td = this.headers.td
      if (b.header.number <= this.headers.height) {
        td = await this.blockchain.getTotalDifficulty(b.header.parentHash)
        ;(this.blockchain as any).checkAndTransitionHardForkByNumber(
          b.header.number - BigInt(1),
          td
        )
        await this.blockchain.consensus.setup({ blockchain: this.blockchain })
      }

      const block = Block.fromValuesArray(b.raw(), {
        common: this.config.chainCommon,
        hardforkByTTD: td,
      })

      await this.blockchain.putBlock(block)
      numAdded++
      const emitOnLast = blocks.length === numAdded
      await this.update(emitOnLast)
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
    block: Buffer | bigint,
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
      if (!mergeIncludes && this.config.chainCommon.gteHardfork(Hardfork.Merge)) {
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
   * Gets total difficulty for a block
   * @param hash the block hash
   * @param num the block number
   * @returns the td
   */
  async getTd(hash: Buffer, num: bigint): Promise<bigint> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getTotalDifficulty(hash, num)
  }
}
