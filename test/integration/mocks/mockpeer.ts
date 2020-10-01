'use strict'

const { Peer } = require('../../../lib/net/peer')
const MockSender = require('./mocksender')
const network = require('./network')
const EventEmitter = require('events')
const Pushable = require('pull-pushable')
const pull = require('pull-stream')

export = module.exports = class MockPeer extends Peer {
  public location: any
  public connected: boolean

  constructor (options: any) {
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

  async accept (server: any) {
    if (this.connected) {
      return
    }
    await this.createConnection(server.location)
    this.server = server
    this.inbound = true
  }

  async createConnection (location: any) {
    const protocols = this.protocols.map((p: any) => `${p.name}/${p.versions[0]}`)
    const connection = network.createConnection(this.id, location, protocols)
    await this.bindProtocols(connection)
  }

  async bindProtocols (connection: any) {
    const receiver = new EventEmitter()
    const pushable = new Pushable()
    pull(pushable, connection)
    pull(connection, pull.drain((data: any) => receiver.emit('data', data)))
    await Promise.all(this.protocols.map(async (p: any) => {
      if (!connection.protocols.includes(`${p.name}/${p.versions[0]}`)) return
      await p.open()
      await this.bindProtocol(p, new MockSender(p.name, pushable, receiver))
    }))
    this.connected = true
  }
}
