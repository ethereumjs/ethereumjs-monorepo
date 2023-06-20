import { bytesToHex } from 'ethereum-cryptography/utils.js'

import type LRUCache from 'lru-cache'

const LRU = require('lru-cache')

/**
 * Simple LRU Cache that allows for keys of type Uint8Array
 * @hidden
 */
export class Cache<V> {
  _cache: LRUCache<string, V>

  constructor(opts: LRUCache.Options<string, V>) {
    this._cache = new LRU(opts)
  }

  set(key: string | Uint8Array, value: V): void {
    if (key instanceof Uint8Array) {
      key = bytesToHex(key)
    }
    this._cache.set(key, value)
  }

  get(key: string | Uint8Array): V | undefined {
    if (key instanceof Uint8Array) {
      key = bytesToHex(key)
    }
    return this._cache.get(key)
  }

  del(key: string | Uint8Array): void {
    if (key instanceof Uint8Array) {
      key = bytesToHex(key)
    }
    this._cache.del(key)
  }
}
