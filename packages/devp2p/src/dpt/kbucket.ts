import { EventEmitter } from 'events'
import _KBucket = require('k-bucket')
import { PeerInfo } from './dpt'

const KBUCKET_SIZE = 16
const KBUCKET_CONCURRENCY = 3

export interface CustomContact extends PeerInfo {
  id: Uint8Array | Buffer
  vectorClock: number
}

export class KBucket extends EventEmitter {
  _peers: Map<string, PeerInfo> = new Map()
  _kbucket: _KBucket
  constructor(localNodeId: Buffer) {
    super()

    this._kbucket = new _KBucket<CustomContact>({
      localNodeId,
      numberOfNodesPerKBucket: KBUCKET_SIZE,
      numberOfNodesToPing: KBUCKET_CONCURRENCY,
    })

    this._kbucket.on('added', (peer: PeerInfo) => {
      KBucket.getKeys(peer).forEach((key) => this._peers.set(key, peer))
      this.emit('added', peer)
    })

    this._kbucket.on('removed', (peer: PeerInfo) => {
      KBucket.getKeys(peer).forEach((key) => this._peers.delete(key))
      this.emit('removed', peer)
    })

    this._kbucket.on('ping', (oldPeers: PeerInfo[], newPeer: PeerInfo | undefined) => {
      this.emit('ping', oldPeers, newPeer)
    })
  }

  static getKeys(obj: Buffer | string | PeerInfo): string[] {
    if (Buffer.isBuffer(obj)) return [obj.toString('hex')]
    if (typeof obj === 'string') return [obj]

    const keys = []
    if (Buffer.isBuffer(obj.id)) keys.push(obj.id.toString('hex'))
    if (obj.address && obj.tcpPort) keys.push(`${obj.address}:${obj.tcpPort}`)
    return keys
  }

  add(peer: PeerInfo) {
    const isExists = KBucket.getKeys(peer).some((key) => this._peers.has(key))
    if (!isExists) this._kbucket.add(peer as CustomContact)
  }

  get(obj: Buffer | string | PeerInfo) {
    for (const key of KBucket.getKeys(obj)) {
      const peer = this._peers.get(key)
      if (peer !== undefined) return peer
    }

    return null
  }

  getAll(): Array<PeerInfo> {
    return this._kbucket.toArray()
  }

  closest(id: string): PeerInfo[] {
    return this._kbucket.closest(Buffer.from(id), KBUCKET_SIZE)
  }

  remove(obj: Buffer | string | PeerInfo) {
    const peer = this.get(obj)
    if (peer !== null) this._kbucket.remove((peer as CustomContact).id)
  }
}
