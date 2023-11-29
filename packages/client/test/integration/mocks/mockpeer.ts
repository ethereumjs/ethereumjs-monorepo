import { EventEmitter } from 'events'
import { pipe } from 'it-pipe'
import pushable from 'it-pushable'

import { RlpxPeer } from '../../../src/net/peer'
import { Event } from '../../../src/types'

import { MockSender } from './mocksender'
import { createStream } from './network'

import type { RlpxPeerOptions } from '../../../src/net/peer'

// TypeScript doesn't have support yet for ReturnType
// with generic types, so this wrapper is used as a helper.
const wrapperPushable = () => pushable<Uint8Array>()
export type Pushable = ReturnType<typeof wrapperPushable>

interface MockPeerOptions extends RlpxPeerOptions {
  location: string
}

export class MockPeer extends RlpxPeer {
  public location: string
  public connected: boolean

  constructor(options: MockPeerOptions) {
    super({ ...options })
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

  /*async accept(server: MockServer) {
    if (this.connected) {
      return
    }
    await this.createStream(server.location)
    this.server = server
    this.inbound = true
  }*/

  async createStream(location: string) {
    const protocols = this.protocols.map((p) => `${p.name}/${p.versions[0]}`)
    const stream = createStream(this.id, location, protocols)
    const receiver = new EventEmitter()
    const pushableFn: Pushable = pushable()
    pipe(pushableFn, stream)
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
      })
    )
    this.connected = true
  }
}
