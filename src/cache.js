const LRU = require('lru-cache')

// Simple LRU Cache that allows for keys of type Buffer
module.exports = class Cache {
  constructor (opts) {
    this._cache = new LRU(opts)
  }

  set (key, value) {
    if (key instanceof Buffer) {
      key = key.toString('hex')
    }
    this._cache.set(key, value)
  }

  get (key) {
    if (key instanceof Buffer) {
      key = key.toString('hex')
    }
    return this._cache.get(key)
  }

  del (key) {
    if (key instanceof Buffer) {
      key = key.toString('hex')
    }
    this._cache.del(key)
  }
}
