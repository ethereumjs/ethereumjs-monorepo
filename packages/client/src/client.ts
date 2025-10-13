import { Chain } from './blockchain/index.ts'
import { FullEthereumService } from './service/index.ts'
import { Event } from './types.ts'
import { getPackageJSON } from './util/index.ts'

import type { Blockchain } from '@ethereumjs/blockchain'
import type { GenesisState } from '@ethereumjs/common'
import type { AbstractLevel } from 'abstract-level'
import type { Config } from './config.ts'
import type { MultiaddrLike } from './types.ts'

export interface EthereumClientOptions {
  /** Client configuration */
  config: Config

  /** Custom blockchain (optional) */
  blockchain?: Blockchain

  /**
   * Database to store blocks and metadata.
   * Should be an abstract-leveldown compliant store.
   *
   * Default: Database created by the Blockchain class
   */
  chainDB?: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>

  /**
   * Database to store the state.
   * Should be an abstract-leveldown compliant store.
   *
   * Default: Database created by the MerklePatriciaTrie class
   */
  stateDB?: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>

  /**
   * Database to store tx receipts, logs, and indexes.
   * Should be an abstract-leveldown compliant store.
   *
   * Default: Database created in datadir folder
   */
  metaDB?: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>

  /* List of bootnodes to use for discovery */
  bootnodes?: MultiaddrLike[]

  /* List of supported clients */
  clientFilter?: string[]

  /* How often to discover new peers */
  refreshInterval?: number

  /* custom genesisState if any for the chain */
  genesisState?: GenesisState
}

/**
 * Represents the top-level ethereum node, and is responsible for managing the
 * lifecycle of included services.
 * @memberof module:node
 */
export class EthereumClient {
  public config: Config
  public chain: Chain
  public service: FullEthereumService

  public opened: boolean
  public started: boolean

  /**
   * Main entrypoint for client initialization.
   *
   * Safe creation of a Chain object awaiting the initialization
   * of the underlying Blockchain object.
   */
  public static async create(options: EthereumClientOptions) {
    const chain = await Chain.create(options)
    return new this(chain, options)
  }

  /**
   * Create new node
   */
  protected constructor(chain: Chain, options: EthereumClientOptions) {
    this.config = options.config
    this.chain = chain
    this.service = new FullEthereumService({
      config: this.config,
      chainDB: options.chainDB,
      stateDB: options.stateDB,
      metaDB: options.metaDB,
      chain,
    })
    this.opened = false
    this.started = false
  }

  /**
   * Open node. Must be called before node is started
   */
  async open() {
    if (this.opened) {
      return false
    }
    const name = this.config.chainCommon.chainName()
    const chainId = this.config.chainCommon.chainId()
    const packageJSON = getPackageJSON()
    this.config.logger?.info(
      `Initializing Ethereumjs client version=v${packageJSON.version} network=${name} chainId=${chainId}`,
    )

    this.config.events.on(Event.SERVER_ERROR, (error) => {
      this.config.logger?.warn(`Server error: ${error.name} - ${error.message}`)
    })
    this.config.events.on(Event.SERVER_LISTENING, (details) => {
      this.config.logger?.info(
        `Server listener up transport=${details.transport} url=${details.url}`,
      )
    })

    await this.service.open()

    this.opened = true
  }

  /**
   * Starts node and all services and network servers.
   */
  async start() {
    if (this.started) {
      return false
    }
    this.config.logger?.info('Setup networking and services.')

    await this.service.start()
    this.config.server && (await this.config.server.start())
    // Only call bootstrap if servers are actually started
    this.config.server && this.config.server.started && (await this.config.server.bootstrap())

    this.started = true
  }

  /**
   * Stops node and all services and network servers.
   */
  async stop() {
    if (!this.started) {
      return false
    }
    this.config.events.emit(Event.CLIENT_SHUTDOWN)
    await this.service.stop()
    this.config.server && this.config.server.started && (await this.config.server.stop())
    this.started = false
  }

  /**
   *
   * @returns the RLPx server (if it exists)
   */
  server() {
    return this.config.server
  }
}
