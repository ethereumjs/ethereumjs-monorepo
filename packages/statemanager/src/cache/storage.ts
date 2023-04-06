import { debug as createDebugLogger } from 'debug'
import { OrderedMap } from 'js-sdsl'

import { Cache } from './cache'
import { CacheType } from './types'

import type { CacheOpts } from './types'
import type { Address } from '@ethereumjs/util'
import type LRUCache from 'lru-cache'

const LRU = require('lru-cache')

/**
 * account: undefined
 *
 * Account is known to not exist in the trie
 */
type DiffStorageCacheMap = OrderedMap<string, Buffer | undefined>
type StorageCacheMap = OrderedMap<string, Buffer>

export class StorageCache extends Cache {
  _lruCache: LRUCache<string, StorageCacheMap> | undefined
  _orderedMapCache: OrderedMap<string, StorageCacheMap> | undefined

  /**
   * Diff cache collecting the state of the cache
   * at the beginning of checkpoint height
   * (respectively: before a first modification)
   *
   * If the whole cache element is undefined (in contrast
   * to the account), the element didn't exist in the cache
   * before.
   */
  _diffCache: OrderedMap<string, DiffStorageCacheMap>[] = []

  constructor(opts: CacheOpts) {
    super()
    if (opts.type === CacheType.LRU) {
      this._lruCache = new LRU({
        max: opts.size,
        updateAgeOnGet: true,
      })
    } else {
      this._orderedMapCache = new OrderedMap()
    }

    this._diffCache.push(new OrderedMap())

    if (this.DEBUG) {
      this._debug = createDebugLogger('statemanager:cache:storage')
    }
  }

  _saveCachePreState(addressHex: string, keyHex: string) {
    const itAddress = this._diffCache[this._checkpoints].find(addressHex)
    let diffStorageMap: DiffStorageCacheMap
    if (itAddress.equals(this._diffCache[this._checkpoints].end())) {
      diffStorageMap = new OrderedMap()
    } else {
      diffStorageMap = itAddress.pointer[1]
    }

    const itKey = diffStorageMap.find(keyHex)
    if (itKey.equals(diffStorageMap.end())) {
      let oldStorageMap: StorageCacheMap | undefined
      let oldStorage: Buffer | undefined = undefined
      if (this._lruCache) {
        oldStorageMap = this._lruCache!.get(addressHex)
        if (oldStorageMap) {
          oldStorage = oldStorageMap.getElementByKey(keyHex)
        }
      } else {
        oldStorageMap = this._orderedMapCache!.getElementByKey(addressHex)
        if (oldStorageMap) {
          oldStorage = oldStorageMap.getElementByKey(keyHex)
        }
      }
      if (oldStorage === undefined) {
        oldStorage = Buffer.from('80', 'hex')
      }
      diffStorageMap.setElement(keyHex, oldStorage)
      this._diffCache[this._checkpoints].setElement(addressHex, diffStorageMap)
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
    this._saveCachePreState(addressHex, keyHex)

    if (this.DEBUG) {
      this._debug(`Put storage for ${addressHex}: ${keyHex} -> ${value?.toString('hex')}`)
    }
    if (this._lruCache) {
      let storageMap = this._lruCache!.get(addressHex)
      if (!storageMap) {
        storageMap = new OrderedMap()
      }
      storageMap.setElement(keyHex, value ?? Buffer.from('80', 'hex'))
      this._lruCache!.set(addressHex, storageMap)
    } else {
      let storageMap = this._orderedMapCache!.getElementByKey(addressHex)
      if (!storageMap) {
        storageMap = new OrderedMap()
      }
      storageMap.setElement(keyHex, value ?? Buffer.from('80', 'hex'))
      this._orderedMapCache!.setElement(addressHex, storageMap)
    }
    this._stats.writes += 1
  }

  /**
   * Returns the queried slot
   * Buffer.from('80', 'hex'): slot is known to be empty
   * undefined: slot is not in cache
   * @param key - Address of account
   */
  get(address: Address, key: Buffer): Buffer | undefined {
    const addressHex = address.buf.toString('hex')
    const keyHex = key.toString('hex')
    if (this.DEBUG) {
      this._debug(`Get storage for ${addressHex}`)
    }

    let elem
    if (this._lruCache) {
      elem = this._lruCache!.get(addressHex)
    } else {
      elem = this._orderedMapCache!.getElementByKey(addressHex)
    }
    this._stats.reads += 1
    if (elem) {
      this._stats.hits += 1
      return elem.getElementByKey(keyHex)
    }
  }

  /**
   * Marks address as deleted in cache.
   * @param key - Address
   */
  del(address: Address, key: Buffer): void {
    const addressHex = address.buf.toString('hex')
    const keyHex = key.toString('hex')
    this._saveCachePreState(addressHex, keyHex)
    if (this.DEBUG) {
      this._debug(`Delete storage for ${addressHex}: ${keyHex}`)
    }
    if (this._lruCache) {
      let storageMap = this._lruCache!.get(addressHex)
      if (!storageMap) {
        storageMap = new OrderedMap()
      }
      storageMap.setElement(keyHex, Buffer.from('80', 'hex'))
      this._lruCache!.set(addressHex, storageMap)
    } else {
      let storageMap = this._orderedMapCache!.getElementByKey(addressHex)
      if (!storageMap) {
        storageMap = new OrderedMap()
      }
      storageMap.setElement(keyHex, Buffer.from('80', 'hex'))
      this._orderedMapCache!.setElement(addressHex, storageMap)
    }

    this._stats.dels += 1
  }

  /**
   * Flushes cache by returning storage slots that have been modified
   * or deleted and resetting the diff cache (at checkpoint height).
   */
  async flush(): Promise<[string, string, Buffer | undefined][]> {
    if (this.DEBUG) {
      this._debug(`Flushing cache on checkpoint ${this._checkpoints}`)
    }

    const diffMap = this._diffCache[this._checkpoints]!
    const it = diffMap.begin()

    const items: [string, string, Buffer | undefined][] = []

    while (!it.equals(diffMap.end())) {
      const addressHex = it.pointer[0]
      const diffStorageMap = it.pointer[1]
      let storageMap: StorageCacheMap | undefined
      if (this._lruCache) {
        storageMap = this._lruCache!.get(addressHex)
      } else {
        storageMap = this._orderedMapCache!.getElementByKey(addressHex)
      }

      if (storageMap !== undefined) {
        const itDiffStorage = diffStorageMap.begin()
        while (!itDiffStorage.equals(diffStorageMap.end())) {
          const keyHex = itDiffStorage.pointer[0]
          const value = storageMap.getElementByKey(keyHex)
          items.push([addressHex, keyHex, value])
          itDiffStorage.next()
        }
      } else {
        throw new Error('Inconsistent cache state')
      }
      it.next()
    }
    this._diffCache[this._checkpoints] = new OrderedMap()
    return items
  }

  /**
   * Revert changes to cache last checkpoint (no effect on trie).
   */
  revert(): void {
    this._checkpoints -= 1
    if (this.DEBUG) {
      this._debug(`Revert to checkpoint ${this._checkpoints}`)
    }
    const diffMap = this._diffCache.pop()!

    const it = diffMap.begin()
    while (!it.equals(diffMap.end())) {
      const addressHex = it.pointer[0]
      const diffStorageMap = it.pointer[1]

      const itStorage = diffStorageMap.begin()
      while (!itStorage.equals(diffStorageMap.end())) {
        const keyHex = itStorage.pointer[0]
        const value = itStorage.pointer[1]
        if (this._lruCache) {
          const storageMap = this._lruCache.get(addressHex) ?? new OrderedMap()
          if (!value) {
            storageMap.eraseElementByKey(keyHex)
          } else {
            storageMap.setElement(keyHex, value)
          }
          this._lruCache.set(addressHex, storageMap)
        } else {
          const storageMap = this._orderedMapCache!.getElementByKey(addressHex) ?? new OrderedMap()
          if (!value) {
            storageMap.eraseElementByKey(keyHex)
          } else {
            storageMap.setElement(keyHex, value)
          }
          this._orderedMapCache!.setElement(addressHex, storageMap)
        }
        itStorage.next()
      }
      it.next()
    }
  }

  /**
   * Commits to current state of cache (no effect on trie).
   */
  commit(): void {
    this._checkpoints -= 1
    if (this.DEBUG) {
      this._debug(`Commit to checkpoint ${this._checkpoints}`)
    }
    const diffMap = this._diffCache.pop()!
    const oldDiffMap = this._diffCache[this._checkpoints]

    const it = diffMap.begin()
    while (!it.equals(diffMap.end())) {
      const addressHex = it.pointer[0]
      const storageDiff = it.pointer[1]

      const itStorageDiff = storageDiff.begin()
      const oldStorageDiff = oldDiffMap.getElementByKey(addressHex) ?? new OrderedMap()

      while (!itStorageDiff.equals(storageDiff.end())) {
        const keyHex = itStorageDiff.pointer[0]
        const value = itStorageDiff.pointer[1]
        const oldDiffStorage = oldStorageDiff.getElementByKey(keyHex)
        if (!oldDiffStorage) {
          oldStorageDiff.setElement(keyHex, value)
        }
        itStorageDiff.next()
      }
      oldDiffMap.setElement(addressHex, oldStorageDiff)
      it.next()
    }
  }

  /**
   * Marks current state of cache as checkpoint, which can
   * later on be reverted or committed.
   */
  checkpoint(): void {
    this._checkpoints += 1
    if (this.DEBUG) {
      this._debug(`New checkpoint ${this._checkpoints}`)
    }
    this._diffCache.push(new OrderedMap())
  }

  /**
   * Returns the size of the cache
   * @returns
   */
  size() {
    if (this._lruCache) {
      return this._lruCache!.size
    } else {
      return this._orderedMapCache!.size()
    }
  }

  /**
   * Returns a dict with cache stats
   * @param reset
   */
  stats(reset = true) {
    const stats = { ...this._stats }
    stats.size = this.size()
    if (reset) {
      this._stats = {
        size: 0,
        reads: 0,
        hits: 0,
        writes: 0,
        dels: 0,
      }
    }
    return stats
  }

  /**
   * Clears cache.
   */
  clear(): void {
    if (this.DEBUG) {
      this._debug(`Clear cache`)
    }
    if (this._lruCache) {
      this._lruCache!.clear()
    } else {
      this._orderedMapCache!.clear()
    }
  }
}
