const { EventEmitter } = require('events')
const Buffer = require('safe-buffer').Buffer
const _KBucket = require('k-bucket')

const KBUCKET_SIZE = 16
const KBUCKET_CONCURRENCY = 3

class KBucket extends EventEmitter {
  constructor (id) {
    super()

    this._peers = new Map()

    this._kbucket = new _KBucket({
      localNodeId: id,
      numberOfNodesPerKBucket: KBUCKET_SIZE,
      numberOfNodesToPing: KBUCKET_CONCURRENCY
    })

    this._kbucket.on('added', (peer) => {
      KBucket.getKeys(peer).forEach((key) => this._peers.set(key, peer))
      this.emit('added', peer)
    })

    this._kbucket.on('removed', (peer) => {
      KBucket.getKeys(peer).forEach((key) => this._peers.delete(key, peer))
      this.emit('removed', peer)
    })

    this._kbucket.on('ping', (...args) => this.emit('ping', ...args))
  }

  static getKeys (obj) {
    if (Buffer.isBuffer(obj)) return [ obj.toString('hex') ]
    if (typeof obj === 'string') return [ obj ]

    const keys = []
    if (Buffer.isBuffer(obj.id)) keys.push(obj.id.toString('hex'))
    if (obj.address && obj.port) keys.push(`${obj.address}:${obj.port}`)
    return keys
  }

  add (peer) {
    const isExists = KBucket.getKeys(peer).some((key) => this._peers.has(key))
    if (!isExists) this._kbucket.add(peer)
  }

  get (obj) {
    for (let key of KBucket.getKeys(obj)) {
      const peer = this._peers.get(key)
      if (peer !== undefined) return peer
    }

    return null
  }

  getAll () {
    return this._kbucket.toArray()
  }

  closest (id) {
    return this._kbucket.closest(id, KBUCKET_SIZE)
  }

  remove (obj) {
    const peer = this.get(obj)
    if (peer !== null) this._kbucket.remove(peer.id)
  }
}

module.exports = KBucket
