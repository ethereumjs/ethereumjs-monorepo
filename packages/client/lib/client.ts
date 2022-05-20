import { version as packageVersion } from '../package.json'
import { MultiaddrLike } from './types'
import { Config, SyncMode } from './config'
import { FullEthereumService, LightEthereumService } from './service'
import { Event } from './types'
import { Chain } from './blockchain'
// eslint-disable-next-line implicit-dependencies/no-implicit
import type { LevelUp } from 'levelup'

export interface EthereumClientOptions {
  /* Client configuration */
  config: Config

  /**
   * Database to store blocks and metadata.
   * Should be an abstract-leveldown compliant store.
   *
   * Default: Database created by the Blockchain class
   */
  chainDB?: LevelUp

  /**
   * Database to store the state.
   * Should be an abstract-leveldown compliant store.
   *
   * Default: Database created by the Trie class
   */
  stateDB?: LevelUp

  /**
   * Database to store tx receipts, logs, and indexes.
   * Should be an abstract-leveldown compliant store.
   *
   * Default: Database created in datadir folder
   */
  metaDB?: LevelUp

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
export default class EthereumClient {
  public config: Config
  public chain: Chain
  public services: (FullEthereumService | LightEthereumService)[]

  public opened: boolean
  public started: boolean

  /**
   * Create new node
   */
  constructor(options: EthereumClientOptions) {
    this.config = options.config
    this.chain = new Chain(options)

    if (this.config.syncmode === SyncMode.Full) {
      this.services = [
        new FullEthereumService({
          config: this.config,
          chainDB: options.chainDB,
          stateDB: options.stateDB,
          metaDB: options.metaDB,
          chain: this.chain,
        }),
      ]
    } else {
      this.services = [
        new LightEthereumService({
          config: this.config,
          chainDB: options.chainDB,
          chain: this.chain,
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
    this.config.logger.info(
      `Initializing Ethereumjs client version=v${packageVersion} network=${this.config.chainCommon.chainName()}`
    )

    this.config.events.on(Event.SERVER_ERROR, (error) => {
      this.config.logger.warn(`Server error: ${error.name} - ${error.message}`)
    })
    this.config.events.on(Event.SERVER_LISTENING, (details) => {
      this.config.logger.info(
        `Server listener up transport=${details.transport} url=${details.url}`
      )
    })
    this.config.events.on(Event.SYNC_SYNCHRONIZED, (height) => {
      this.config.logger.info(`Synchronized blockchain at height=${height}`)
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
    this.config.logger.info('Connecting to network and synchronizing blockchain...')

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
