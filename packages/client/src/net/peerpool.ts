import { Hardfork } from '@ethereumjs/common'

import { Event } from '../types'

import { RlpxServer } from './server'

import type { Config } from '../config'
import type { Peer } from './peer'

export interface PeerPoolOptions {
  /* Config */
  config: Config
}

/**
 * @module net
 */

/**
 * Pool of connected peers
 * @memberof module:net
 */
export class PeerPool {
  public config: Config

  private pool: Map<string, Peer>
  private noPeerPeriods: number
  private opened: boolean
  public running: boolean

  /**
   * Default status check interval (in ms)
   */
  private DEFAULT_STATUS_CHECK_INTERVAL = 20000

  private _statusCheckInterval: NodeJS.Timeout | undefined /* global NodeJS */
  private _reconnectTimeout: NodeJS.Timeout | undefined

  /**
   * Create new peer pool
   */
  constructor(options: PeerPoolOptions) {
    this.config = options.config

    this.pool = new Map<string, Peer>()
    this.noPeerPeriods = 0
    this.opened = false
    this.running = false

    this.init()
  }

  init() {
    this.opened = false
  }

  /**
   * Open pool
   */
  async open(): Promise<boolean | void> {
    if (this.opened) {
      return false
    }
    this.config.events.on(Event.PEER_CONNECTED, (peer) => {
      this.connected(peer)
    })
    this.config.events.on(Event.PEER_DISCONNECTED, (peer) => {
      this.disconnected(peer)
    })
    this.config.events.on(Event.PEER_ERROR, (error, peer) => {
      if (this.pool.get(peer.id)) {
        this.config.logger.warn(`Peer error: ${error} ${peer}`)
        this.ban(peer)
      }
    })
    this.opened = true
  }

  /**
   * Start peer pool
   */
  async start(): Promise<boolean> {
    if (this.running) {
      return false
    }
    this._statusCheckInterval = setInterval(
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await this._statusCheck.bind(this),
      this.DEFAULT_STATUS_CHECK_INTERVAL
    )

    this.running = true
    return true
  }

  /**
   * Stop peer pool
   */
  async stop(): Promise<boolean> {
    if (this.opened) {
      await this.close()
    }
    clearInterval(this._statusCheckInterval as NodeJS.Timeout)
    clearTimeout(this._reconnectTimeout as NodeJS.Timeout)
    this.running = false
    return true
  }

  /**
   * Close pool
   */
  async close() {
    this.config.events.removeAllListeners(Event.PEER_CONNECTED)
    this.config.events.removeAllListeners(Event.PEER_DISCONNECTED)
    this.config.events.removeAllListeners(Event.PEER_ERROR)
    this.pool.clear()
    this.opened = false
  }

  /**
   * Connected peers
   */
  get peers(): Peer[] {
    const connectedPeers: Peer[] = Array.from(this.pool.values())
    return connectedPeers
  }

  /**
   * Number of peers in pool
   */
  get size() {
    return this.peers.length
  }

  /**
   * Return true if pool contains the specified peer
   * @param peer peer object or id
   */
  contains(peer: Peer | string): boolean {
    if (typeof peer !== 'string') {
      peer = peer.id
    }
    return !!this.pool.get(peer)
  }

  /**
   * Returns a random idle peer from the pool
   * @param filterFn filter function to apply before finding idle peers
   */
  idle(filterFn = (_peer: Peer) => true): Peer | undefined {
    const idle = this.peers.filter((p) => p.idle && filterFn(p))
    if (idle.length > 0) {
      const index = Math.floor(Math.random() * idle.length)
      return idle[index]
    }
    return
  }

  /**
   * Handler for peer connections
   * @param peer peer
   */
  private connected(peer: Peer) {
    if (this.size >= this.config.maxPeers) return
    this.add(peer)
    peer.handleMessageQueue()
  }

  /**
   * Handler for peer disconnections
   * @param peer peer
   */
  private disconnected(peer: Peer) {
    this.remove(peer)
  }

  /**
   * Ban peer from being added to the pool for a period of time
   * @param peer peer
   * @param maxAge ban period in ms
   * @emits {@link Event.POOL_PEER_BANNED}
   */
  ban(peer: Peer, maxAge: number = 60000) {
    if (!peer.server) {
      return
    }
    peer.server.ban(peer.id, maxAge)
    this.remove(peer)
    this.config.events.emit(Event.POOL_PEER_BANNED, peer)

    // Reconnect to peer after ban period if pool is empty
    this._reconnectTimeout = setTimeout(async () => {
      if (this.running && this.size === 0) {
        await peer.server?.connect(peer.id)
        this.connected(peer)
      }
    }, maxAge + 1000)
  }

  /**
   * Add peer to pool
   * @param peer peer
   * @emits {@link Event.POOL_PEER_ADDED}
   */
  add(peer?: Peer) {
    if (peer && peer.id && !this.pool.get(peer.id)) {
      this.pool.set(peer.id, peer)
      peer.pooled = true
      this.config.events.emit(Event.POOL_PEER_ADDED, peer)
    }
  }

  /**
   * Remove peer from pool
   * @param peer peer
   * @emits {@link Event.POOL_PEER_REMOVED}
   */
  remove(peer?: Peer) {
    if (peer && peer.id) {
      if (this.pool.delete(peer.id)) {
        peer.pooled = false
        this.config.events.emit(Event.POOL_PEER_REMOVED, peer)
      }
    }
  }

  /**
   * Peer pool status check on a repeated interval
   */
  async _statusCheck() {
    let NO_PEER_PERIOD_COUNT = 3
    if (this.config.chainCommon.gteHardfork(Hardfork.Paris)) {
      NO_PEER_PERIOD_COUNT = 6
    }
    if (this.size === 0 && this.config.maxPeers > 0) {
      this.noPeerPeriods += 1
      if (this.noPeerPeriods >= NO_PEER_PERIOD_COUNT) {
        this.noPeerPeriods = 0
        const promises = this.config.servers.map(async (server) => {
          if (server instanceof RlpxServer) {
            this.config.logger.info('Restarting RLPx server')
            await server.stop()
            await server.start()
            this.config.logger.info('Reinitiating server bootstrap')
            await server.bootstrap()
          }
        })
        await Promise.all(promises)
      } else {
        let tablesize: number | undefined = 0
        for (const server of this.config.servers) {
          if (server instanceof RlpxServer && server.discovery) {
            tablesize = server.dpt?.getPeers().length
            this.config.logger.info(`Looking for suited peers: peertablesize=${tablesize}`)
          }
        }
      }
    } else {
      this.noPeerPeriods = 0
    }
  }
}
