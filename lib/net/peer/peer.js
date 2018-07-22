'use strict'

const EventEmitter = require('events')
const { defaultLogger } = require('../../logging')

const defaultOptions = {
  logger: defaultLogger,
  server: null,
  protocols: []
}

/**
 * Network peer
 * @memberof module:net/peer
 */
class Peer extends EventEmitter {
  /**
   * Create new peer
   * @param {Object}      options constructor parameters
   * @param {string}      options.id peer id
   * @param {string}      options.address peer address
   * @param {Protocols[]} [options.protocols=[]] supported protocols
   * @param {Logger}      [options.logger] logger instance
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
     * @property {Logger} logger
     */
    this.logger = options.logger

    /**
     * @property {Protocol[]} protocols supported protocols
     */
    this.protocols = options.protocols

    /**
     * @property {Protocol[]} bound bound protocols
     */
    this.bound = new Map()

    /**
     * @property {Server} server
     */
    this.server = null

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
   * Adds a protocol to this peer given a sender instance. Protocol methods
   * will be accessible via a field with the same name as protocol. New methods
   * will be added corresponding to each message defined by the protocol, in
   * addition to a send() method that takes a message name and message arguments.
   * @private
   * @param  {Protocol}  protocol protocol instance
   * @param  {Sender}    sender Sender instance provided by subclass
   * @return {Promise}
   */
  async bindProtocol (protocol, sender) {
    const bound = await protocol.bind(this, sender)
    bound.on('message', message => {
      this.emit('message', message, protocol.name)
    })
    bound.on('error', error => {
      this.emit('error', error, protocol.name)
    })
    this.bound.set(bound.name, bound)
  }

  /**
   * Return true if peer understand the specified protocol name
   * @param {string} protocolName
   */
  understands (protocolName) {
    return !!this.bound.get(protocolName)
  }

  toString (fullId) {
    const properties = {
      id: fullId ? this.id : this.id.substr(0, 8),
      address: this.address,
      protocols: Array.from(this.bound.keys())
    }
    return Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null && value.toString() !== '')
      .map(keyValue => keyValue.join('='))
      .join(' ')
  }
}

module.exports = Peer
