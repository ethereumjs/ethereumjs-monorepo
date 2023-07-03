import { bytesToUnprefixedHex } from '@ethereumjs/util'
import { LRUCache } from 'lru-cache'

/**
 * Simple LRU Cache that allows for keys of type Uint8Array
 * @hidden
 */
export class Cache<V> {
  _cache: LRUCache<string, { value: V }, void>

  constructor(opts: LRUCache.Options<string, { value: V }, void>) {
    this._cache = new LRUCache(opts)
  }

  set(key: string | Uint8Array, value: V): void {
    if (key instanceof Uint8Array) {
      key = bytesToUnprefixedHex(key)
    }
    this._cache.set(key, { value })
  }

  get(key: string | Uint8Array): V | undefined {
    if (key instanceof Uint8Array) {
      key = bytesToUnprefixedHex(key)
    }
    const elem = this._cache.get(key)
    return elem !== undefined ? elem.value : undefined
  }

  del(key: string | Uint8Array): void {
    if (key instanceof Uint8Array) {
      key = bytesToUnprefixedHex(key)
    }
    this._cache.delete(key)
  }
}
