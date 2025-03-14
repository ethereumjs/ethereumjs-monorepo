import { EventEmitter } from 'eventemitter3'
import { pipe } from 'it-pipe'
import { pushable } from 'it-pushable'

import { Peer } from '../../../src/net/peer/index.ts'
import { Event } from '../../../src/types.ts'

import { MockSender } from './mocksender.ts'
import { createStream } from './network.ts'

import type { PeerOptions } from '../../../src/net/peer/index.ts'
import type { MockServer } from './mockserver.ts'
import type { RemoteStream } from './network.ts'
import type { BlockHeader } from '@ethereumjs/block'

interface MockPeerOptions extends PeerOptions {
  location: string
}

export class MockPeer extends Peer {
  public location: string
  public connected: boolean

  constructor(options: MockPeerOptions) {
    super({ ...options, transport: 'mock', address: options.location })
    this.location = options.location
    this.connected = false
    this.pooled = true
  }

  async connect() {
    if (this.connected) {
      return
    }
    await this.createStream(this.location)
    this.config.events.emit(Event.PEER_CONNECTED, this)
  }

  async latest(): Promise<BlockHeader | undefined> {
    if (this.eth !== undefined) {
      this.eth.updatedBestHeader = undefined
    }
    return super.latest()
  }

  async accept(server: MockServer) {
    if (this.connected) {
      return
    }
    await this.createStream(server.location)
    this.server = server
    this.inbound = true
  }

  async createStream(location: string) {
    const protocols = this.protocols.map((p) => `${p.name}/${p.versions[0]}`)
    const stream = createStream(this.id, location, protocols)
    await this.bindProtocols(stream)
  }

  async bindProtocols(stream: RemoteStream) {
    const receiver = new EventEmitter()
    const pushableFn = pushable({ objectMode: true })
    void pipe(pushableFn, stream)
    void pipe(stream, async (source: any) => {
      for await (const data of source) {
        setTimeout(() => {
          receiver.emit('data', data)
        }, 100)
      }
    })
    await Promise.all(
      this.protocols.map(async (p) => {
        if (!(stream.protocols as string[]).includes(`${p.name}/${p.versions[0]}`)) return
        await p.open()
        await this.addProtocol(new MockSender(p.name, pushableFn, receiver), p)
      }),
    )
    this.connected = true
  }
}
