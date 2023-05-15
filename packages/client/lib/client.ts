import { version as packageVersion } from '../package.json'

import { Chain } from './blockchain'
import { SyncMode } from './config'
import { FullEthereumService, LightEthereumService } from './service'
import { Event } from './types'

import type { Config } from './config'
import type { MultiaddrLike } from './types'
import type { Blockchain } from '@ethereumjs/blockchain'
import type { AbstractLevel } from 'abstract-level'

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
   * Default: Database created by the Trie class
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
}

/**
 * Represents the top-level ethereum node, and is responsible for managing the
 * lifecycle of included services.
 * @memberof module:node
 */
export class EthereumClient {
  public config: Config
  public chain: Chain
  public services: (FullEthereumService | LightEthereumService)[] = []

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

    if (this.config.syncmode === SyncMode.Full || this.config.syncmode === SyncMode.None) {
      this.services = [
        new FullEthereumService({
          config: this.config,
          chainDB: options.chainDB,
          stateDB: options.stateDB,
          metaDB: options.metaDB,
          chain,
        }),
      ]
    }
    if (this.config.syncmode === SyncMode.Light) {
      this.services = [
        new LightEthereumService({
          config: this.config,
          chainDB: options.chainDB,
          chain,
        }),
      ]
    }

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
    this.config.logger.info(
      `Initializing Ethereumjs client version=v${packageVersion} network=${name} chainId=${chainId}`
    )

    this.config.events.on(Event.SERVER_ERROR, (error) => {
      this.config.logger.warn(`Server error: ${error.name} - ${error.message}`)
    })
    this.config.events.on(Event.SERVER_LISTENING, (details) => {
      this.config.logger.info(
        `Server listener up transport=${details.transport} url=${details.url}`
      )
    })

    await Promise.all(this.services.map((s) => s.open()))

    this.opened = true
  }

  /**
   * Starts node and all services and network servers.
   */
  async start() {
    if (this.started) {
      return false
    }
    this.config.logger.info('Setup networking and services.')

    await Promise.all(this.services.map((s) => s.start()))
    await Promise.all(this.config.servers.map((s) => s.start()))
    await Promise.all(this.config.servers.map((s) => s.bootstrap()))
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
    await Promise.all(this.services.map((s) => s.stop()))
    await Promise.all(this.config.servers.map((s) => s.stop()))
    this.started = false
  }

  /**
   * Returns the service with the specified name.
   * @param name name of service
   */
  service(name: string) {
    return this.services.find((s) => s.name === name)
  }

  /**
   * Returns the server with the specified name.
   * @param name name of server
   */
  server(name: string) {
    return this.config.servers.find((s) => s.name === name)
  }
}
