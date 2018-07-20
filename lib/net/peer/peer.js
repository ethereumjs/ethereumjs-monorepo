'use strict'

const EventEmitter = require('events')
const { Protocol } = require('../protocol')
const assert = require('assert')
const { defaultLogger } = require('../../logging')

const defaultOptions = {
  logger: defaultLogger,
  server: null
}

/**
 * Network peer
 * @memberof module:net/peer
 */
class Peer extends EventEmitter {
  /**
   * Create new peer
   * @param {Object}     options constructor parameters
   * @param {string}     options.id peer id
   * @param {string}     options.address peer address
   * @param {Server}     [options.server] parent server
   * @param {Logger}     [options.logger] logger instance
   */
  constructor (options) {
    super()
    options = { ...defaultOptions, ...options }

    /**
     * [id description]
     * @property {string} id
     */
    this.id = options.id

    /**
     * @property {string} address
     */
    this.address = options.address

    /**
     * @property {Server} server
     */
    this.server = options.server

    /**
     * @property {Logger} logger
     */
    this.logger = options.logger

    /**
     * @property {Protocol[]} protocols
     */
    this.protocols = []

    this.init()
  }

  init () {
    this._idle = true
  }

  /**
   * Get idle state of peer
   * @type {boolean}
   */
  get idle () {
    return this._idle
  }

  /**
   * Set idle state of peer
   * @type {boolean}
   */
  set idle (value) {
    this._idle = value
  }

  /**
   * Add a new protocol to peer
   * @param {Protocol} protocol
   */
  addProtocol (protocol) {
    assert(protocol instanceof Protocol, 'protocol must be an instance of Protocol')
    Object.defineProperty(this, protocol.name, {
      get: () => protocol
    })
    protocol.on('message', message => {
      this.emit('message', message, protocol.name)
    })
    this.protocols.push(protocol)
  }

  /**
   * Return true if peer understand the specified protocol name
   * @param {string} protocolName
   */
  understands (protocolName) {
    return !!this.protocols.find(p => p.name === protocolName)
  }

  toString (fullId) {
    const properties = {
      id: fullId ? this.id : this.id.substr(0, 8),
      address: this.address,
      protocols: this.protocols.map(p => p.name)
    }
    return Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null && value.toString() !== '')
      .map(keyValue => keyValue.join('='))
      .join(' ')
  }
}

module.exports = Peer
