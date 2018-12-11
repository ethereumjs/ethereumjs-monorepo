'use strict'

const { Peer } = require('../../../lib/net/peer')
const MockSender = require('./mocksender')
const network = require('./network')
const EventEmitter = require('events')
const Pushable = require('pull-pushable')
const pull = require('pull-stream')

class MockPeer extends Peer {
  constructor (options) {
    super({ ...options, transport: 'mock', address: options.location })
    this.location = options.location
    this.connected = false
  }

  async connect () {
    if (this.connected) {
      return
    }
    await this.createConnection(this.location)
    this.emit('connected')
  }

  async accept (server) {
    if (this.connected) {
      return
    }
    await this.createConnection(server.location)
    this.server = server
    this.inbound = true
  }

  async createConnection (location) {
    const protocols = this.protocols.map(p => `${p.name}/${p.versions[0]}`)
    const connection = network.createConnection(this.id, location, protocols)
    await this.bindProtocols(connection)
  }

  async bindProtocols (connection) {
    const receiver = new EventEmitter()
    const pushable = new Pushable()
    pull(pushable, connection)
    pull(connection, pull.drain(data => receiver.emit('data', data)))
    await Promise.all(this.protocols.map(async (p) => {
      if (!connection.protocols.includes(`${p.name}/${p.versions[0]}`)) return
      await p.open()
      await this.bindProtocol(p, new MockSender(p.name, pushable, receiver))
    }))
    this.connected = true
  }
}

module.exports = MockPeer
