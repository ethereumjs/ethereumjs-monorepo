'use strict'

const EventEmitter = require('events')
const Sender = require('./sender')
const assert = require('assert')

/**
 * Base class for all wire protocols
 * @memberof module:net/protocol
 */
class Protocol extends EventEmitter {
  /**
   * Create new protocol
   * @param {Sender} sender
   */
  constructor (sender) {
    super()

    assert(sender instanceof Sender, 'sender must be instance of Sender')
    this.sender = sender
    this.resolvers = new Map()
    this.timeout = 10000
    this.sender.on('message', message => this.handle(message))
  }

  /**
   * Handle incoming message
   * @private
   * @param  {Object} message message object
   * @param  {number} message.code message code
   * @param  {Buffer|Array} message.payload RLP encoded payload
   * @emits  message
   */
  handle (message) {
    const resolver = this.resolvers.get(message.code)
    if (resolver) {
      if (resolver.timeout) {
        clearTimeout(resolver.timeout)
      }
      this.resolvers.delete(message.code)
      resolver.resolve(message.payload)
    } else {
      this.emit('message', message)
    }
  }

  /**
   * Returns a promise that resolves with the message payload when the specified
   * message code is received
   * @param  {number}  code message code to wait for
   * @return {Promise}
   */
  async response (code) {
    const resolver = {
      timeout: null,
      resolve: null
    }
    if (this.resolvers.get(code)) {
      throw new Error(`Only one active request allowed per code (${code})`)
    }
    this.resolvers.set(code, resolver)
    return new Promise((resolve, reject) => {
      resolver.timeout = setTimeout(() => {
        resolver.timeout = null
        this.resolvers.delete(code)
        reject(new Error(`Request timed out after ${this.timeout}ms`))
      }, this.timeout)
      resolver.resolve = resolve
    })
  }
}

module.exports = Protocol
