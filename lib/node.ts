import * as events from 'events'
import { FastEthereumService, LightEthereumService } from './service'
import { defaultLogger } from './logging'
import { Config } from './config'

const defaultOptions = {
  minPeers: 3,
  maxPeers: 25,
  logger: defaultLogger,
  servers: [],
}

/**
 * Represents the top-level ethereum node, and is responsible for managing the
 * lifecycle of included services.
 * @memberof module:node
 */
export default class Node extends events.EventEmitter {
  public config: Config
  
  public logger: any
  public servers: any
  public syncmode: any
  public services: any

  public opened: boolean
  public started: boolean

  /**
   * Create new node
   * @param {Object}   options constructor parameters
   * @param {Config}   [options.config] Client configuration
   * @param {Logger}   [options.logger] Logger instance
   * @param {LevelDB}  [options.db=null] blockchain database
   * @param {string}   [options.syncmode=light] synchronization mode ('fast' or 'light')
   * @param {boolean}  [options.lightserv=false] serve LES requests
   * @param {Server[]} [options.servers=[]] list of servers to use
   * @param {Object[]} [options.bootnodes] list of bootnodes to use for discovery
   * @param {number}   [options.minPeers=3] number of peers needed before syncing
   * @param {number}   [options.maxPeers=25] maximum peers allowed
   * @param {string[]} [options.clientFilter] list of supported clients
   * @param {number}   [options.refreshInterval] how often to discover new peers
   */
  constructor(options: any) {
    super()
    options = { ...defaultOptions, ...options }
    this.config = options.config || new Config()
    this.logger = options.logger
    this.servers = options.servers
    this.syncmode = options.syncmode
    this.services = [
      this.syncmode === 'fast'
        ? new FastEthereumService({
            servers: this.servers,
            logger: this.logger,
            lightserv: options.lightserv,
            config: this.config,
            minPeers: options.minPeers,
            maxPeers: options.maxPeers,
            db: options.db,
          })
        : new LightEthereumService({
            servers: this.servers,
            logger: this.logger,
            config: this.config,
            minPeers: options.minPeers,
            maxPeers: options.maxPeers,
            db: options.db,
          }),
    ]
    this.opened = false
    this.started = false
  }

  /**
   * Open node. Must be called before node is started
   * @return {Promise}
   */
  async open() {
    if (this.opened) {
      return false
    }
    this.servers.map((s: any) => {
      s.on('error', (error: Error) => {
        this.emit('error', error)
      })
      s.on('listening', (details: any) => {
        this.emit('listening', details)
      })
    })
    this.services.map((s: any) => {
      s.on('error', (error: any) => {
        this.emit('error', error)
      })
      s.on('synchronized', () => {
        this.emit('synchronized')
      })
    })
    await Promise.all(this.services.map((s: any) => s.open()))
    this.opened = true
  }

  /**
   * Starts node and all services and network servers.
   * @return {Promise}
   */
  async start() {
    if (this.started) {
      return false
    }
    await Promise.all(this.servers.map((s: any) => s.start()))
    await Promise.all(this.services.map((s: any) => s.start()))
    this.started = true
  }

  /**
   * Stops node and all services and network servers.
   * @return {Promise}
   */
  async stop() {
    if (!this.started) {
      return false
    }
    await Promise.all(this.services.map((s: any) => s.stop()))
    await Promise.all(this.servers.map((s: any) => s.stop()))
    this.started = false
  }

  /**
   * Returns the service with the specified name.
   * @param {string} name name of service
   * @return {Service}
   */
  service(name: string) {
    return this.services.find((s: any) => s.name === name)
  }

  /**
   * Returns the server with the specified name.
   * @param {string} name name of server
   * @return {Server}
   */
  server(name: string) {
    return this.servers.find((s: any) => s.name === name)
  }
}
