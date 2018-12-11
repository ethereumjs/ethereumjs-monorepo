'use strict'

const { Server } = require('../../../lib/net/server')
const MockPeer = require('./mockpeer')
const network = require('./network')

class MockServer extends Server {
  constructor (options = {}) {
    super(options)
    this.location = options.location || '127.0.0.1'
    this.server = null
    this.peers = {}
  }

  get name () {
    return 'mock'
  }

  async start () {
    if (this.started) {
      return
    }
    super.start()
    await this.wait(1)
    if (this.location) {
      this.server = network.createServer(this.location)
      this.server.on('listening', () => {
        this.emit('listening', {
          transport: this.name,
          url: `mock://${this.location}`
        })
      })
    }
    this.server.on('connection', connection => {
      this.connect(connection)
    })
  }

  async stop () {
    await new Promise(resolve => {
      setTimeout(() => {
        network.destroyServer(this.location)
        resolve()
      }, 20)
    })
    await super.stop()
  }

  async discover (id, location) {
    const peer = new MockPeer({id, location, protocols: Array.from(this.protocols)})
    await peer.connect()
    this.peers[id] = peer
    this.emit('connected', peer)
    return peer
  }

  async accept (id) {
    const peer = new MockPeer({id, protocols: Array.from(this.protocols)})
    await peer.accept(this)
    return peer
  }

  async connect (connection) {
    const id = connection.remoteId
    const peer = new MockPeer({id, inbound: true, server: this, protocols: Array.from(this.protocols)})
    await peer.bindProtocols(connection)
    this.peers[id] = peer
    this.emit('connected', peer)
  }

  disconnect (id) {
    const peer = this.peers[id]
    if (peer) this.emit('disconnected', peer)
  }

  async wait (delay) {
    await new Promise(resolve => setTimeout(resolve, delay || 100))
  }
}

module.exports = MockServer
