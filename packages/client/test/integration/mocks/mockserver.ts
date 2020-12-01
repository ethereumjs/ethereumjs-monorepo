import { Server, ServerOptions } from '../../../lib/net/server'
import MockPeer from './mockpeer'
import * as network from './network'

interface MockServerOptions extends ServerOptions {
  location?: string
}

export default class MockServer extends Server {
  public location: string
  public server: Server | null
  public peers: { [key: string]: MockPeer }

  constructor(options: MockServerOptions) {
    super(options)
    this.location = options.location ?? '127.0.0.1'
    this.server = null
    this.peers = {}
  }

  get name() {
    return 'mock'
  }

  async start(): Promise<boolean> {
    if (this.started) {
      return false
    }
    await super.start()
    await this.wait(1)

    this.server = network.createServer(this.location)
    this.server!.on('listening', () => {
      this.emit('listening', {
        transport: this.name,
        url: `mock://${this.location}`,
      })
    })

    this.server!.on('connection', async (connection: any) => {
      await this.connect(connection)
    })
    return true
  }

  async stop(): Promise<boolean> {
    await new Promise((resolve) => {
      setTimeout(() => {
        network.destroyServer(this.location)
        resolve()
      }, 20)
    })
    await super.stop()
    return this.started
  }

  async discover(id: string, location: string) {
    const opts = { config: this.config, address: 'mock', transport: 'mock' }
    const peer = new MockPeer({ id, location, protocols: Array.from(this.protocols), ...opts })
    await peer.connect()
    this.peers[id] = peer
    this.emit('connected', peer)
    return peer
  }

  async accept(id: string) {
    const opts = { config: this.config, address: 'mock', transport: 'mock', location: 'mock' }
    const peer = new MockPeer({ id, protocols: Array.from(this.protocols), ...opts })
    await peer.accept(this)
    return peer
  }

  async connect(connection: any) {
    const opts = { config: this.config, address: 'mock', transport: 'mock', location: 'mock' }
    const id = connection.remoteId
    const peer = new MockPeer({
      id,
      inbound: true,
      server: this,
      protocols: Array.from(this.protocols),
      ...opts,
    })
    await peer.bindProtocols(connection)
    this.peers[id] = peer
    this.emit('connected', peer)
  }

  disconnect(id: string) {
    const peer = this.peers[id]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (peer) this.emit('disconnected', peer)
  }

  async wait(delay?: number) {
    await new Promise((resolve) => setTimeout(resolve, delay ?? 100))
  }
}
