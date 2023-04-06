import { debug as createDebugLogger } from 'debug'
import { OrderedMap } from 'js-sdsl'

import { Cache } from './cache'

import type { CacheOpts } from './types'
import type { Address } from '@ethereumjs/util'

/**
 * account: undefined
 *
 * Account is known to not exist in the trie
 */
type StorageCacheElement = OrderedMap<string, Buffer | undefined>

export class StorageCache extends Cache<StorageCacheElement> {
  constructor(opts: CacheOpts) {
    super(opts)
    if (this.DEBUG) {
      this._debug = createDebugLogger('statemanager:cache:storage')
    }
  }

  _saveCachePreState(addressHex: string, keyHex: string) {
    const itAddress = this._diffCache[this._checkpoints].find(addressHex)
    let storageMap: StorageCacheElement
    if (itAddress.equals(this._diffCache[this._checkpoints].end())) {
      storageMap = new OrderedMap()
    } else {
      if (itAddress.pointer[1] !== undefined) {
        storageMap = itAddress.pointer[1]
      } else {
        storageMap = new OrderedMap()
      }
    }

    const itKey = storageMap.find(keyHex)
    if (itKey.equals(storageMap.end())) {
      let oldStorageMap: StorageCacheElement | undefined
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
      storageMap.setElement(keyHex, oldStorage)
      this._diffCache[this._checkpoints].setElement(addressHex, storageMap)
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
      storageMap.setElement(keyHex, value)
      this._lruCache!.set(addressHex, storageMap)
    } else {
      let storageMap = this._orderedMapCache!.getElementByKey(addressHex)
      if (!storageMap) {
        storageMap = new OrderedMap()
      }
      storageMap.setElement(keyHex, value)
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
      let storageMap
      if (this._lruCache) {
        storageMap = this._lruCache!.get(addressHex)
      } else {
        storageMap = this._orderedMapCache!.getElementByKey(addressHex)
      }

      if (storageMap !== undefined) {
        const itStorage = storageMap.begin()
        while (!itStorage.equals(storageMap.end())) {
          const keyHex = itStorage.pointer[0]
          const value = itStorage.pointer[1]
          items.push([addressHex, keyHex, value])
        }
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
      const elem = it.pointer[1]
      if (elem !== undefined) {
        const diffStorageMap = it.pointer[1]
      }

      if (elem === undefined) {
        if (this._lruCache) {
          this._lruCache!.delete(addressHex)
        } else {
          this._orderedMapCache!.eraseElementByKey(addressHex)
        }
      } else {
        if (this._lruCache) {
          this._lruCache!.set(addressHex, elem)
        } else {
          this._orderedMapCache!.setElement(addressHex, elem)
        }
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

    const it = diffMap.begin()
    while (!it.equals(diffMap.end())) {
      const addressHex = it.pointer[0]
      const element = it.pointer[1]
      const oldElem = this._diffCache[this._checkpoints].getElementByKey(addressHex)
      if (oldElem === undefined) {
        this._diffCache[this._checkpoints].setElement(addressHex, element)
      }
      it.next()
    }
  }
}
