'use strict'

const EventEmitter = require('events')
const { defaultLogger } = require('../logging')
const { Peer } = require('./peer')

const defaultOptions = {
  logger: defaultLogger,
  servers: [],
  protocols: []
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
class PeerPool extends EventEmitter {
  /**
   * Create new peer pool
   * @param {Object}   options constructor parameters
   * @param {Server[]} options.servers servers to aggregate peers from
   * @param {string[]} [options.protocols=[]] peers must support all of these protocols
   * @param {Logger}   [options.logger] logger instance
   */
  constructor (options) {
    super()

    options = {...defaultOptions, ...options}

    this.servers = options.servers
    this.logger = options.logger
    this.protocols = options.protocols
    this.pool = new Map()
    this.init()
  }

  init () {
    this.opened = false
  }

  /**
   * Open pool and make sure all associated servers are also open
   * @return {Promise}
   */
  async open () {
    if (this.opened) {
      return
    }
    await Promise.all(this.servers.map(server => {
      server.on('connected', (peer) => { this.connected(peer) })
      server.on('disconnected', (peer) => { this.disconnected(peer) })
    }))
    this.opened = true
  }

  /**
   * Close pool
   * @return {Promise}
   */
  async close () {
    this.opened = false
  }

  /**
   * Connected peers
   * @type {Peer[]}
   */
  get peers () {
    return Array.from(this.pool.values())
  }

  /**
   * Return true if pool contains the specified peer
   * @param {Peer|string} peer object or peer id
   * @return {boolean}
   */
  contains (peer) {
    if (peer instanceof Peer) {
      peer = peer.id
    }
    return !!this.pool.get(peer)
  }

  /**
   * Returns a random idle peer from the pool
   * @param {Function} [filterFn] filter function to apply before finding idle peers
   * @return {Peer}
   */
  idle (filterFn = () => true) {
    const idle = this.peers.filter(p => p.idle && filterFn(p))
    const index = Math.floor(Math.random() * idle.length)
    return idle[index]
  }

  /**
   * Handler for peer connections
   * @private
   * @param  {Peer} peer
   */
  connected (peer) {
    // Ignore peers that don't support all the required pool protocols
    peer.on('message', (message, protocol) => {
      if (this.pool.get(peer.id)) {
        this.emit('message', message, protocol, peer)
        this.emit(`message:${protocol}`, message, peer)
      }
    })
    peer.on('error', (error, protocol) => {
      if (this.pool.get(peer.id)) {
        this.logger.warn(`Peer error: ${error} ${peer}`)
        this.ban(peer)
      }
    })
    if (this.protocols.find(p => !peer.understands(p.name))) {
      this.logger.debug(`Peer does not support required protocols: ${peer}`)
      return
    }
    this.add(peer)
  }

  /**
   * Handler for peer disconnections
   * @private
   * @param  {Peer} peer
   */
  disconnected (peer) {
    this.remove(peer)
  }

  /**
   * Ban peer from being added to the pool for a period of time
   * @param  {Peer} peer
   * @param  {number} maxAge ban period in milliseconds
   * @emits  banned
   */
  ban (peer, maxAge) {
    if (!peer.server) {
      return
    }
    peer.server.ban(peer.id, maxAge)
    this.remove(peer)
    this.emit('banned', peer)
  }

  /**
   * Handler for pool and peer errors
   * @private
   * @param  {Error} error
   * @param  {Peer} peer
   * @emits error
   */
  error (error, peer) {
    this.emit('error', error)
  }

  /**
   * Add peer to pool
   * @param  {Peer} peer
   * @emits added
   * @emits message
   * @emits message:{protocol}
   */
  add (peer) {
    if (peer && peer.id) {
      this.pool.set(peer.id, peer)
      this.emit('added', peer)
    }
  }

  /**
   * Remove peer from pool
   * @param  {Peer} peer
   * @emits removed
   */
  remove (peer) {
    if (peer && peer.id) {
      if (this.pool.delete(peer.id)) {
        this.emit('removed', peer)
      }
    }
  }

  /**
   * Specify which protocols the peer pool must support
   * @param {Protocol[]} protocols protocol classes
   */
  addProtocols (protocols) {
    if (this.opened) {
      this.logger.error('Cannot add protocols after peer pool has been opened')
      return false
    }
    this.protocols = this.protocols.concat(protocols)
  }
}

module.exports = PeerPool
