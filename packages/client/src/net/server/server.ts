import { parseKey, parseMultiaddrs } from '../../util/parse'

import type { Config } from '../../config'
import type { DnsNetwork, KeyLike, MultiaddrLike } from '../../types'
import type { Protocol } from '../protocol/protocol'
import type { Multiaddr } from 'multiaddr'

export interface ServerOptions {
  /* Config */
  config: Config

  /* How often (in ms) to discover new peers (default: 30000) */
  refreshInterval?: number

  /* Private key to use for server */
  key?: KeyLike

  /* List of bootnodes to use for discovery */
  bootnodes?: MultiaddrLike

  /* DNS record tree to search for discovery */
  dnsNetworks?: DnsNetwork[]
}

/**
 * Base class for transport specific server implementations.
 * @memberof module:net/server
 */
export class Server {
  public config: Config
  public key: Uint8Array
  public bootnodes: Multiaddr[] = []
  public dnsNetworks: DnsNetwork[]

  protected refreshInterval: number
  protected protocols: Set<Protocol>

  public started: boolean

  /**
   * Create new server
   */
  constructor(options: ServerOptions) {
    this.config = options.config
    this.key = options.key !== undefined ? parseKey(options.key) : this.config.key
    this.bootnodes = options.bootnodes !== undefined ? parseMultiaddrs(options.bootnodes) : []
    this.dnsNetworks = options.dnsNetworks ?? []
    this.refreshInterval = options.refreshInterval ?? 30000

    this.protocols = new Set()
    this.started = false
  }

  get name() {
    return this.constructor.name
  }

  /**
   * Check if server is running
   */
  get running() {
    return this.started
  }

  /**
   * Start server.
   * Returns a promise that resolves once server has been started.
   * @returns true if server successfully started
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
   * Server bootstrap.
   * In Libp2p this is done during server start.
   */
  async bootstrap(): Promise<void> {}

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
   * @returns true if protocol added successfully
   */
  addProtocols(protocols: Protocol[]) {
    if (this.started) {
      this.config.logger.error('Cannot require protocols after server has been started')
      return false
    }
    for (const p of protocols) {
      this.protocols.add(p)
    }
    return true
  }

  /**
   * Ban peer for a specified time
   * @param peerId id of peer
   * @param maxAge how long to ban peer
   */
  ban(_peerId: string, _maxAge: number) {
    // don't do anything by default
  }

  async connect(_peerId: string, _stream?: any) {}
}
