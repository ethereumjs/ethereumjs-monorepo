import { EventEmitter } from 'events'
import { Protocol } from '../protocol/protocol'
import { Config } from '../../config'

const defaultOptions = {
  refreshInterval: 30000,
}

/**
 * Base class for transport specific server implementations.
 * @memberof module:net/server
 */
export class Server extends EventEmitter {
  public config: Config

  public key: Buffer | string = ''
  public bootnodes: any | string = ''

  protected refreshInterval: number
  protected protocols: Set<Protocol>

  public started: boolean

  constructor(options: any) {
    super()

    this.config = options.config

    options = { ...defaultOptions, ...options }

    this.refreshInterval = options.refreshInterval
    this.protocols = new Set()
    this.started = false
  }

  get name(): string {
    return this.constructor.name
  }

  /**
   * Check if server is running
   */
  get running(): boolean {
    return this.started
  }

  /**
   * Start server. Returns a promise that resolves once server has been started.
   * @return Resolves with true if server successfully started
   */
  async start(): Promise<boolean> {
    if (this.started) {
      return false
    }
    const protocols: Protocol[] = Array.from(this.protocols)
    await Promise.all(protocols.map((p) => p.open()))
    this.started = true
    this.config.logger.info(`Started ${this.name} server.`)

    return true
  }

  /**
   * Stop server. Returns a promise that resolves once server has been stopped.
   */
  async stop(): Promise<boolean> {
    this.started = false
    this.config.logger.info(`Stopped ${this.name} server.`)
    return this.started
  }

  /**
   * Specify which protocols the server must support
   * @param protocols protocol classes
   * @return True if protocol added successfully
   */
  addProtocols(protocols: Protocol[]): boolean {
    if (this.started) {
      this.config.logger.error('Cannot require protocols after server has been started')
      return false
    }
    protocols.forEach((p) => this.protocols.add(p))
    return true
  }

  /**
   * Ban peer for a specified time
   * @protected
   * @param  peerId id of peer
   * @param  maxAge how long to ban peer
   * @return {Promise}
   */
  ban(_peerId: string, _maxAge: number) {
    // don't do anything by default
  }
}
