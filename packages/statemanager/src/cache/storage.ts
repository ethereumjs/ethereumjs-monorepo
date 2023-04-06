import { debug as createDebugLogger } from 'debug'

import { Cache } from './cache'

import type { CacheOpts } from './types'
import type { Address } from '@ethereumjs/util'

/**
 * account: undefined
 *
 * Account is known to not exist in the trie
 */
type StorageCacheElement = Buffer | undefined

export class StorageCache extends Cache<StorageCacheElement> {
  constructor(opts: CacheOpts) {
    super(opts)
    if (this.DEBUG) {
      this._debug = createDebugLogger('statemanager:cache:storage')
    }
  }

  /**
   * Puts storage value to cache under address_key cache key.
   * @param address - Account address
   * @param key - Storage key
   * @param val - Storage value
   */
  put(address: Address, key: Buffer, value: Buffer | undefined): void {
    const addressHex = address.buf.toString('hex')
    const keyHex = key.toString('hex')
    const cacheKeyHex = `${addressHex}_${keyHex}`
    this._saveCachePreState(cacheKeyHex)

    if (this.DEBUG) {
      this._debug(`Put storage for ${addressHex}: ${keyHex} -> ${value?.toString('hex')}`)
    }
    if (this._lruCache) {
      this._lruCache!.set(cacheKeyHex, value)
    } else {
      this._orderedMapCache!.setElement(cacheKeyHex, value)
    }
    this._stats.writes += 1
  }

  /**
   * Returns the queried account or undefined if account doesn't exist
   * @param key - Address of account
   */
  get(address: Address, key: Buffer): StorageCacheElement | undefined {
    const addressHex = address.buf.toString('hex')
    const keyHex = key.toString('hex')
    const cacheKeyHex = `${addressHex}_${keyHex}`
    if (this.DEBUG) {
      this._debug(`Get storage for ${addressHex}`)
    }

    let elem
    if (this._lruCache) {
      elem = this._lruCache!.get(cacheKeyHex)
    } else {
      elem = this._orderedMapCache!.getElementByKey(cacheKeyHex)
    }
    this._stats.reads += 1
    if (elem) {
      this._stats.hits += 1
    }
    return elem
  }

  /**
   * Marks address as deleted in cache.
   * @param key - Address
   */
  del(address: Address, key: Buffer): void {
    const addressHex = address.buf.toString('hex')
    const keyHex = key.toString('hex')
    const cacheKeyHex = `${addressHex}_${keyHex}`
    this._saveCachePreState(cacheKeyHex)
    if (this.DEBUG) {
      this._debug(`Delete storage for ${addressHex}: ${keyHex}`)
    }
    if (this._lruCache) {
      this._lruCache!.set(cacheKeyHex, Buffer.from('80', 'hex'))
    } else {
      this._orderedMapCache!.setElement(cacheKeyHex, Buffer.from('80', 'hex'))
    }

    this._stats.dels += 1
  }
}
