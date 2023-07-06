import { bytesToUnprefixedHex } from '@ethereumjs/util'
import { EventEmitter } from 'events'

import { KBucket as _KBucket } from '../ext/index.js'

import type { PeerInfo } from '../types.js'

const KBUCKET_SIZE = 16
const KBUCKET_CONCURRENCY = 3

export class KBucket extends EventEmitter {
  _peers: Map<string, PeerInfo> = new Map()
  _kbucket: _KBucket
  constructor(localNodeId: Uint8Array) {
    super()

    this._kbucket = new _KBucket({
      localNodeId,
      numberOfNodesPerKBucket: KBUCKET_SIZE,
      numberOfNodesToPing: KBUCKET_CONCURRENCY,
    })

    this._kbucket.on('added', (peer: PeerInfo) => {
      for (const key of KBucket.getKeys(peer)) {
        this._peers.set(key, peer)
      }
      this.emit('added', peer)
    })

    this._kbucket.on('removed', (peer: PeerInfo) => {
      for (const key of KBucket.getKeys(peer)) {
        this._peers.delete(key)
      }
      this.emit('removed', peer)
    })

    this._kbucket.on('ping', (oldPeers: PeerInfo[], newPeer: PeerInfo | undefined) => {
      this.emit('ping', oldPeers, newPeer)
    })
  }

  static getKeys(obj: Uint8Array | string | PeerInfo): string[] {
    if (obj instanceof Uint8Array) return [bytesToUnprefixedHex(obj)]
    if (typeof obj === 'string') return [obj]

    const keys = []
    if (obj.id instanceof Uint8Array) keys.push(bytesToUnprefixedHex(obj.id))
    if (obj.address !== undefined && typeof obj.tcpPort === 'number')
      keys.push(`${obj.address}:${obj.tcpPort}`)
    return keys
  }

  add(peer: PeerInfo): _KBucket | void {
    const isExists = KBucket.getKeys(peer).some((key) => this._peers.has(key))
    if (!isExists) this._kbucket.add(peer)
  }

  get(obj: Uint8Array | string | PeerInfo): PeerInfo | null {
    for (const key of KBucket.getKeys(obj)) {
      const peer = this._peers.get(key)
      if (peer !== undefined) return peer
    }

    return null
  }

  getAll(): Array<PeerInfo> {
    return this._kbucket.toArray()
  }

  closest(id: Uint8Array): PeerInfo[] {
    return this._kbucket.closest(id, KBUCKET_SIZE)
  }

  remove(obj: Uint8Array | string | PeerInfo) {
    const peer = this.get(obj)
    if (peer?.id !== undefined) this._kbucket.remove(peer.id)
  }
}
