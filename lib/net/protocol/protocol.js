'use strict'

const EventEmitter = require('events')
const { defaultLogger } = require('../../logging')

const defaultOptions = {
  logger: defaultLogger,
  timeout: 5000
}

/**
 * Protocol message
 * @typedef {Object} Protocol~Message
 * @property {string} name message name
 * @property {number} code message code
 * @property {response} response code of response message
 * @property {boolean} flow true if message includes flow control
 * @property {function(...*): *} encode encode message arguments
 * @property {function(*): *} decode decodes message payload
 */

/**
 * Binds a protocol implementation to the specified peer
 * @extends EventEmitter
 */
class BoundProtocol extends EventEmitter {
  /**
   * Create bound protocol
   * @param {Object}   options constructor parameters
   * @param {Protocol} options.protocol protocol to bind
   * @param {Peer}     options.peer peer that protocol is bound to
   * @param {Sender}   options.sender message sender
   */
  constructor (options) {
    super()

    this.protocol = options.protocol
    this.peer = options.peer
    this.sender = options.sender
    this.name = this.protocol.name
    this.versions = this.protocol.versions
    this.timeout = this.protocol.timeout
    this.logger = this.protocol.logger
    this._status = null
    this.resolvers = new Map()
    this.sender.on('message', message => {
      try {
        this.handle(message)
      } catch (error) {
        this.emit('error', error)
      }
    })
    this.addMethods()
  }

  get status () {
    return this._status
  }

  async handshake (sender) {
    this._status = await this.protocol.handshake(sender)
  }

  /**
   * Handle incoming message
   * @private
   * @param  {Object} message message object
   * @emits  message
   */
  handle (incoming) {
    const messages = this.protocol.messages
    const message = messages.find(m => m.code === incoming.code)
    if (!message) {
      return
    }

    let data
    let error
    try {
      data = this.protocol.decode(message, incoming.payload, this)
    } catch (e) {
      error = new Error(`Could not decode message ${message.name}: ${e}`)
    }
    const resolver = this.resolvers.get(incoming.code)
    if (resolver) {
      clearTimeout(resolver.timeout)
      this.resolvers.delete(incoming.code)
      if (error) {
        resolver.reject(error)
      } else {
        resolver.resolve(data)
      }
    } else {
      if (error) {
        this.emit('error', error)
      } else {
        this.emit('message', { name: message.name, data: data })
      }
    }
  }

  /**
   * Send message with name and the specified args
   * @param  {string} name message name
   * @param  {...*} args message arguments
   */
  send (name, args) {
    const messages = this.protocol.messages
    const message = messages.find(m => m.name === name)
    if (message) {
      const encoded = this.protocol.encode(message, args)
      this.sender.sendMessage(message.code, encoded)
      return message
    } else {
      throw new Error(`Unknown message: ${name}`)
    }
  }

  /**
   * Returns a promise that resolves with the message payload when a response
   * to the specified message is received
   * @param  {string}  name message to wait for
   * @param  {...*}    args message arguments
   * @return {Promise}
   */
  async request (name, args) {
    const message = this.send(name, args)
    const resolver = {
      timeout: null,
      resolve: null,
      reject: null
    }
    if (this.resolvers.get(message.response)) {
      throw new Error(`Only one active request allowed per message type (${name})`)
    }
    this.resolvers.set(message.response, resolver)
    return new Promise((resolve, reject) => {
      resolver.timeout = setTimeout(() => {
        resolver.timeout = null
        this.resolvers.delete(message.response)
        reject(new Error(`Request timed out after ${this.timeout}ms`))
      }, this.timeout)
      resolver.resolve = resolve
      resolver.reject = reject
    })
  }

  /**
   * Add a methods to the bound protocol for each protocol message that has a
   * corresponding response message
   */
  addMethods () {
    const messages = this.protocol.messages.filter(m => m.response)
    for (let message of messages) {
      const name = message.name
      const camel = name[0].toLowerCase() + name.slice(1)
      this[name] = async (...args) => this.request(name, args)
      this[camel] = async (...args) => this.request(name, args)
    }
  }
}

/**
 * Base class for all wire protocols
 * @memberof module:net/protocol
 */
class Protocol extends EventEmitter {
  /**
   * Create new protocol
   * @param {Object}   options constructor parameters
   * @param {number}   [options.timeout=5000] handshake timeout in ms
   * @param {Logger}   [options.logger] logger instance
   */
  constructor (options) {
    super()
    options = { ...defaultOptions, ...options }
    this.logger = options.logger
    this.timeout = options.timeout
    this.opened = false
  }

  /**
   * Opens protocol and any associated dependencies
   * @return {Promise}
   */
  async open () {
    this.opened = true
  }

  /**
   * Perform handshake given a sender from subclass.
   * @private
   * @return {Promise}
   */
  async handshake (sender) {
    const status = this.encodeStatus()
    sender.sendStatus(status)
    return new Promise((resolve, reject) => {
      let timeout = setTimeout(() => {
        timeout = null
        reject(new Error(`Handshake timed out after ${this.timeout}ms`))
      }, this.timeout)
      sender.once('status', (status) => {
        // make sure we don't resolve twice if already timed out
        if (timeout) {
          clearTimeout(timeout)
          resolve(this.decodeStatus(status))
        }
      })
    })
  }

  /**
   * Name of protocol
   * @type {string}
   */
  get name () {
    throw new Error('Unimplemented')
  }

  /**
   * Protocol versions supported
   * @type {number[]}
   */
  get versions () {
    throw new Error('Unimplemented')
  }

  /**
   * Messages defined by this protocol
   * @type {Protocol~Message[]}
   */
  get messages () {
    throw new Error('Unimplemented')
  }

  /**
   * Encodes status into status message payload. Must be implemented by subclass.
   * @return {Object}
   */
  encodeStatus () {
    throw new Error('Unimplemented')
  }

  /**
   * Decodes status message payload into a status object.  Must be implemented
   * by subclass.
   * @param {Object} status status message payload
   * @return {Object}
   */
  decodeStatus (status) {
    throw new Error('Unimplemented')
  }

  /**
   * Encodes message into proper format before sending
   * @protected
   * @param {Protocol~Message} message message definition
   * @param {...*} args message arguments
   * @return {*}
   */
  encode (message, args) {
    return message.encode(...args)
  }

  /**
   * Decodes message payload
   * @protected
   * @param {Protocol~Message} message message definition
   * @param {*} payload message payload
   * @param {BoundProtocol} bound reference to bound protocol
   * @return {*}
   */
  decode (message, payload, bound) {
    return message.decode(payload)
  }

  /**
   * Binds this protocol to a given peer using the specified sender to handle
   * message communication.
   * @param  {Peer}    peer peer
   * @param  {Sender}  sender sender
   * @return {Promise}
   */
  async bind (peer, sender) {
    const bound = new BoundProtocol({
      protocol: this,
      peer: peer,
      sender: sender
    })
    await bound.handshake(sender)
    peer[this.name] = bound
    return bound
  }
}

module.exports = Protocol
