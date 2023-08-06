import { PeerPool } from '../net/peerpool'
import { Event } from '../types'

import type { Config } from '../config'
import type { Peer } from '../net/peer/peer'
import type { Protocol } from '../net/protocol'

export interface ServiceOptions {
  /* Config */
  config: Config
}

/**
 * Base class for all services
 * @memberof module:service
 */
export class Service {
  public config: Config
  public opened: boolean
  public running: boolean
  public pool: PeerPool

  /**
   * Create new service and associated peer pool
   */
  constructor(options: ServiceOptions) {
    this.config = options.config

    this.opened = false
    this.running = false

    this.pool = new PeerPool({
      config: this.config,
    })

    this.config.events.on(Event.PROTOCOL_MESSAGE, async (message, protocol, peer) => {
      if (this.running) {
        try {
          await this.handle(message, protocol, peer)
        } catch (error: any) {
          this.config.logger.debug(
            `Error handling message (${protocol}:${message.name}): ${error.message}`
          )
        }
      }
    })

    this.opened = false
    this.running = false
  }

  /**
   * Service name
   */
  get name() {
    return ''
    //throw new Error('Unimplemented')
  }

  /**
   * Returns all protocols required by this service
   */
  get protocols(): Protocol[] {
    return []
  }

  /**
   * Open service. Must be called before service is running
   */
  async open() {
    if (this.opened) {
      return false
    }
    const protocols = this.protocols
    this.config.servers.map((s) => s.addProtocols(protocols))

    this.config.events.on(Event.POOL_PEER_BANNED, (peer) =>
      this.config.logger.debug(`Peer banned: ${peer}`)
    )
    this.config.events.on(Event.POOL_PEER_ADDED, (peer) =>
      this.config.logger.debug(`Peer added: ${peer}`)
    )
    this.config.events.on(Event.POOL_PEER_REMOVED, (peer) =>
      this.config.logger.debug(`Peer removed: ${peer}`)
    )

    await this.pool.open()
    this.opened = true
    return true
  }

  /**
   * Close service.
   */
  async close() {
    if (this.opened) {
      await this.pool.close()
    }
    this.opened = false
  }

  /**
   * Start service
   */
  async start(): Promise<boolean> {
    if (this.running) {
      return false
    }
    await this.pool.start()
    this.running = true
    this.config.logger.info(`Started ${this.name} service.`)
    return true
  }

  /**
   * Stop service
   */
  async stop(): Promise<boolean> {
    if (this.opened) {
      await this.close()
    }
    await this.pool.stop()
    this.running = false
    this.config.logger.info(`Stopped ${this.name} service.`)
    return true
  }

  /**
   * Handles incoming request from connected peer
   * @param message message object
   * @param protocol protocol name
   * @param peer peer
   */
  async handle(_message: any, _protocol: string, _peer: Peer): Promise<any> {}
}
