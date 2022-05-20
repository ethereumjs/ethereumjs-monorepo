import { Block, BlockHeader } from '@ethereumjs/block'
import Blockchain from '@ethereumjs/blockchain'
import { ConsensusAlgorithm, Hardfork } from '@ethereumjs/common'
import { BN, toBuffer } from 'ethereumjs-util'
import { Config } from '../config'
import { Event } from '../types'
// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'

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
  chainDB?: LevelUp

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
  td: BN

  /**
   * The height of the blockchain
   */
  height: BN
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
  td: BN

  /**
   * The height of the headerchain
   */
  height: BN
}

/**
 * common.genesis() <any> with all values converted to Buffer
 */
export interface GenesisBlockParams {
  [key: string]: Buffer
}

/**
 * Blockchain
 * @memberof module:blockchain
 */
export class Chain {
  public config: Config
  public chainDB: LevelUp
  public blockchain: Blockchain
  public opened: boolean
  public terminalPoWBlock: Block | undefined
  public transitionPoSBlock: Block | undefined
  public lastFinalizedBlockHash: Buffer | undefined

  private _headers: ChainHeaders = {
    latest: null,
    td: new BN(0),
    height: new BN(0),
  }

  private _blocks: ChainBlocks = {
    latest: null,
    td: new BN(0),
    height: new BN(0),
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
      new Blockchain({
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
  get networkId(): BN {
    return this.config.chainCommon.networkIdBN()
  }

  /**
   * Genesis block parameters
   */
  get genesis(): GenesisBlockParams {
    const genesis = this.config.chainCommon.genesis()
    const genesisParams: GenesisBlockParams = {}
    Object.entries(genesis).forEach(([k, v]) => {
      genesisParams[k] = toBuffer(v as string)
    })
    return genesisParams
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
    await this.blockchain.initPromise
    this.opened = true
    await this.update(false)

    this.config.chainCommon.on('hardforkChanged', async (hardfork: string) => {
      if (hardfork !== Hardfork.Merge) {
        const block = this.config.chainCommon.hardforkBlockBN()
        this.config.logger.info(`New hardfork reached 🪢 ! hardfork=${hardfork} block=${block}`)
      } else {
        const block = await this.getLatestBlock()
        const num = block.header.number
        const td = await this.blockchain.getTotalDifficulty(block.hash(), num)
        this.config.logger.info(`Merge hardfork reached 🐼 👉 👈 🐼 ! block=${num} td=${td}`)
        this.config.logger.info(`First block for CL-framed execution: block=${num.addn(1)}`)
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

  /**
   * Update blockchain properties (latest block, td, height, etc...)
   * @param emit Emit a `CHAIN_UPDATED` event
   * @returns false if chain is closed, otherwise void
   */
  async update(emit = true): Promise<boolean | void> {
    if (!this.opened) return false

    const headers: ChainHeaders = {
      latest: null,
      td: new BN(0),
      height: new BN(0),
    }
    const blocks: ChainBlocks = {
      latest: null,
      td: new BN(0),
      height: new BN(0),
    }

    headers.latest = await this.getLatestHeader()
    blocks.latest = await this.getLatestBlock()

    headers.height = headers.latest.number
    blocks.height = blocks.latest.header.number

    headers.td = await this.getTd(headers.latest.hash(), headers.height)
    blocks.td = await this.getTd(blocks.latest.hash(), blocks.height)

    this._headers = headers
    this._blocks = blocks

    this.config.chainCommon.setHardforkByBlockNumber(headers.latest.number, headers.td)

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
  async getBlocks(block: Buffer | BN, max = 1, skip = 0, reverse = false): Promise<Block[]> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getBlocks(block, max, skip, reverse)
  }

  /**
   * Get a block by its hash or number
   * @param block block hash or number
   * @throws if block is not found
   */
  async getBlock(block: Buffer | BN): Promise<Block> {
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
      const block = Block.fromValuesArray(b.raw(), {
        common: this.config.chainCommon,
        hardforkByTD: this.headers.td,
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
    block: Buffer | BN,
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
        hardforkByTD: this.headers.td,
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
  async getLatestHeader(): Promise<BlockHeader> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getLatestHeader()
  }

  /**
   * Gets the latest block in the canonical chain
   */
  async getLatestBlock(): Promise<Block> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getLatestBlock()
  }

  /**
   * Gets total difficulty for a block
   * @param hash the block hash
   * @param num the block number
   * @returns the td
   */
  async getTd(hash: Buffer, num: BN): Promise<BN> {
    if (!this.opened) throw new Error('Chain closed')
    return this.blockchain.getTotalDifficulty(hash, num)
  }
}
