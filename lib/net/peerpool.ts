const { EventEmitter } = require('events')
const { defaultLogger } = require('../logging')
const Peer = require('./peer/peer')

const defaultOptions = {
  logger: defaultLogger,
  servers: [],
  maxPeers: 25
}

/**
 * @module net
 */

/**
 * Pool of connected peers
 * @memberof module:net
 * @emits connected
 * @emits disconnected
 * @emits banned
 * @emits added
 * @emits removed
 * @emits message
 * @emits message:{protocol}
 * @emits error
 */
export = module.exports = class PeerPool extends EventEmitter {
  /**
   * Create new peer pool
   * @param {Object}   options constructor parameters
   * @param {Server[]} options.servers servers to aggregate peers from
   * @param {number}   [options.maxPeers=25] maximum peers allowed
   * @param {Logger}   [options.logger] logger instance
   */
  constructor (options: any) {
    super()

    options = { ...defaultOptions, ...options }

    this.servers = options.servers
    this.logger = options.logger
    this.maxPeers = options.maxPeers
    this.pool = new Map()
    this.noPeerPeriods = 0
    this.init()
  }

  init () {
    this.opened = false
  }

  /**
   * Open pool
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return false
    }
    this.servers.map((server: any) => {
      server.on('connected', (peer: any) => { this.connected(peer) })
      server.on('disconnected', (peer: any) => { this.disconnected(peer) })
    })
    this.opened = true
    this._statusCheckInterval = setInterval(await this._statusCheck.bind(this), 20000)
  }

  /**
   * Close pool
   * @return {Promise}
   */
  async close () {
    this.pool.clear()
    this.opened = false
    clearInterval(this._statusCheckInterval)
  }

  /**
   * Connected peers
   * @type {Peer[]}
   */
  get peers () {
    return Array.from(this.pool.values())
  }

  /**
   * Number of peers in pool
   * @type {number}
   */
  get size () {
    return this.peers.length
  }

  /**
   * Return true if pool contains the specified peer
   * @param {Peer|string} peer object or peer id
   */
  contains (peer: any): boolean {
    if (peer instanceof Peer) {
      peer = peer.id
    }
    return !!this.pool.get(peer)
  }

  /**
   * Returns a random idle peer from the pool
   * @param [filterFn] filter function to apply before finding idle peers
   * @return {Peer}
   */
  idle (filterFn = (peer: any) => true) {
    const idle = this.peers.filter((p: any) => p.idle && filterFn(p))
    const index = Math.floor(Math.random() * idle.length)
    return idle[index]
  }

  /**
   * Handler for peer connections
   * @private
   * @param  {Peer} peer
   */
  connected (peer: any) {
    if (this.size >= this.maxPeers) return
    peer.on('message', (message: any, protocol: string) => {
      if (this.pool.get(peer.id)) {
        this.emit('message', message, protocol, peer)
        this.emit(`message:${protocol}`, message, peer)
      }
    })
    peer.on('error', (error: Error, protocol: string) => {
      if (this.pool.get(peer.id)) {
        this.logger.warn(`Peer error: ${error} ${peer}`)
        this.ban(peer)
      }
    })
    this.add(peer)
  }

  /**
   * Handler for peer disconnections
   * @private
   * @param  {Peer} peer
   */
  disconnected (peer: any) {
    this.remove(peer)
  }

  /**
   * Ban peer from being added to the pool for a period of time
   * @param  {Peer} peer
   * @param  maxAge ban period in milliseconds
   * @emits  banned
   */
  ban (peer: any, maxAge?: number) {
    if (!peer.server) {
      return
    }
    peer.server.ban(peer.id, maxAge)
    this.remove(peer)
    this.emit('banned', peer)
  }

  /**
   * Add peer to pool
   * @param  {Peer} peer
   * @emits added
   * @emits message
   * @emits message:{protocol}
   */
  add (peer: any) {
    if (peer && peer.id && !this.pool.get(peer.id)) {
      this.pool.set(peer.id, peer)
      this.emit('added', peer)
    }
  }

  /**
   * Remove peer from pool
   * @param  {Peer} peer
   * @emits removed
   */
  remove (peer: any) {
    if (peer && peer.id) {
      if (this.pool.delete(peer.id)) {
        this.emit('removed', peer)
      }
    }
  }

  /**
   * Peer pool status check on a repeated interval
   */
  async _statusCheck () {
    if (this.size === 0) {
      this.noPeerPeriods += 1
      if (this.noPeerPeriods >= 3) {
        const promises = this.servers.map(async (server: any) => {
          if (server.bootstrap) {
            this.logger.info('Retriggering bootstrap.')
            await server.bootstrap()
          }
        })
        await Promise.all(promises)
        this.noPeerPeriods = 0
      } else {
        this.logger.info('Looking for suited peers...')
      }
    } else {
      this.noPeerPeriods = 0
    }
  }
}
