import { EventEmitter } from 'events'
import _KBucket = require('k-bucket')

const KBUCKET_SIZE = 16
const KBUCKET_CONCURRENCY = 3

export interface KObj {
  id?: string
  port?: string
  address?: string
}

export class KBucket extends EventEmitter {
  _peers: Map<string, any> = new Map()
  _kbucket: _KBucket
  constructor(id: string | Buffer) {
    super()

    this._kbucket = new _KBucket({
      localNodeId: typeof id === 'string' ? Buffer.from(id) : id,
      numberOfNodesPerKBucket: KBUCKET_SIZE,
      numberOfNodesToPing: KBUCKET_CONCURRENCY
    })

    this._kbucket.on('added', (peer: any) => {
      KBucket.getKeys(peer).forEach(key => this._peers.set(key, peer))
      this.emit('added', peer)
    })

    this._kbucket.on('removed', (peer: any) => {
      KBucket.getKeys(peer).forEach(key => this._peers.delete(key))
      this.emit('removed', peer)
    })

    this._kbucket.on('ping', (...args: any[]) => this.emit('ping', ...args))
  }

  static getKeys(obj: Buffer | string | KObj): string[] {
    if (Buffer.isBuffer(obj)) return [obj.toString('hex')]
    if (typeof obj === 'string') return [obj]

    const keys = []
    if (Buffer.isBuffer(obj.id)) keys.push(obj.id.toString('hex'))
    if (obj.address && obj.port) keys.push(`${obj.address}:${obj.port}`)
    return keys
  }

  add(peer: any) {
    const isExists = KBucket.getKeys(peer).some(key => this._peers.has(key))
    if (!isExists) this._kbucket.add(peer)
  }

  get(obj: Buffer | string | KObj) {
    for (const key of KBucket.getKeys(obj)) {
      const peer = this._peers.get(key)
      if (peer !== undefined) return peer
    }

    return null
  }

  getAll(): Array<any> {
    return this._kbucket.toArray()
  }

  closest(id: string): any {
    return this._kbucket.closest(Buffer.from(id), KBUCKET_SIZE)
  }

  remove(obj: Buffer | string | KObj) {
    const peer = this.get(obj)
    if (peer !== null) this._kbucket.remove(peer.id)
  }
}
