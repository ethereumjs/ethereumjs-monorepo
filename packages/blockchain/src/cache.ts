import * as LRU from 'lru-cache'

/**
 * Simple LRU Cache that allows for keys of type Buffer
 * @hidden
 */
export default class Cache<V> {
  _cache: LRU<string, V>

  constructor(opts: LRU.Options<string, V>) {
    this._cache = new LRU(opts)
  }

  set(key: string | Buffer, value: V): void {
    if (key instanceof Buffer) {
      key = key.toString('hex')
    }
    this._cache.set(key, value)
  }

  get(key: string | Buffer): V | undefined {
    if (key instanceof Buffer) {
      key = key.toString('hex')
    }
    return this._cache.get(key)
  }

  del(key: string | Buffer): void {
    if (key instanceof Buffer) {
      key = key.toString('hex')
    }
    this._cache.del(key)
  }
}
