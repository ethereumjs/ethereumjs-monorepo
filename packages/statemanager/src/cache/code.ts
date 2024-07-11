import { bytesToUnprefixedHex } from '@ethereumjs/util'
import debugDefault from 'debug'
import { OrderedMap } from 'js-sdsl'
import { LRUCache } from 'lru-cache'

import { Cache } from './cache.js'
import { CacheType } from './types.js'

import type { CacheOpts } from './types.js'
import type { Address } from '@ethereumjs/util'

/**
 * Represents a cached code element.
 */
type CodeCacheElement = {
  code: Uint8Array | undefined
}

export class CodeCache extends Cache {
  _lruCache: LRUCache<string, CodeCacheElement> | undefined
  _orderedMapCache: OrderedMap<string, CodeCacheElement> | undefined

  /**
   * Diff cache collecting the state of the cache
   * at the beginning of checkpoint height
   * (respectively: before a first modification)
   *
   * If the whole cache element is undefined (in contrast
   * to the code), the element didn't exist in the cache
   * before.
   */
  _diffCache: Map<string, CodeCacheElement | undefined>[] = []

  constructor(opts: CacheOpts) {
    super()
    if (opts.type === CacheType.LRU) {
      this._lruCache = new LRUCache({
        max: opts.size,
        updateAgeOnGet: true,
      })
    } else {
      this._orderedMapCache = new OrderedMap()
    }

    this._diffCache.push(new Map<string, CodeCacheElement | undefined>())
    this._debug = debugDefault('statemanager:cache:code')
  }

  /**
   * Saves the state of the code cache before making changes to it.
   *
   * @param cacheKeyHex Account key for which code is being modified.
   */
  _saveCachePreState(cacheKeyHex: string) {
    const diffMap = this._diffCache[this._checkpoints]
    if (!diffMap.has(cacheKeyHex)) {
      let oldElem: CodeCacheElement | undefined
      if (this._lruCache) {
        oldElem = this._lruCache.get(cacheKeyHex)
      } else {
        oldElem = this._orderedMapCache!.getElementByKey(cacheKeyHex)
      }
      diffMap.set(cacheKeyHex, oldElem)
    }
  }

  /**
   * Puts code into the cache under its hash.
   *
   * @param address - Address of account code is being modified for.
   * @param code - Bytecode or undefined if code doesn't exist.
   */
  put(address: Address, code: Uint8Array | undefined): void {
    const addressHex = bytesToUnprefixedHex(address.bytes)
    this._saveCachePreState(addressHex)
    const elem = {
      code,
    }

    if (this.DEBUG) {
      this._debug(`Put code ${addressHex}`)
    }
    if (this._lruCache) {
      this._lruCache.set(addressHex, elem)
    } else {
      this._orderedMapCache!.setElement(addressHex, elem)
    }
    this._stats.writes += 1
  }

  /**
   * Returns the queried code or undefined if it doesn't exist.
   *
   * @param address - Account address for which code is being fetched.
   */
  get(address: Address): CodeCacheElement | undefined {
    const addressHex = bytesToUnprefixedHex(address.bytes)
    if (this.DEBUG) {
      this._debug(`Get code ${addressHex}`)
    }

    let elem: CodeCacheElement | undefined
    if (this._lruCache) {
      elem = this._lruCache.get(addressHex)
    } else {
      elem = this._orderedMapCache!.getElementByKey(addressHex)
    }
    this._stats.reads += 1
    if (elem) {
      this._stats.hits += 1
    }
    return elem
  }

  /**
   * Marks code as deleted in the cache.
   *
   * @param address - Account address for which code is being fetched.
   */
  del(address: Address): void {
    const addressHex = bytesToUnprefixedHex(address.bytes)
    this._saveCachePreState(addressHex)
    if (this.DEBUG) {
      this._debug(`Delete code ${addressHex}`)
    }
    if (this._lruCache) {
      this._lruCache.set(addressHex, {
        code: undefined,
      })
    } else {
      this._orderedMapCache!.setElement(addressHex, {
        code: undefined,
      })
    }

    this._stats.dels += 1
  }

  /**
   * Flushes the cache by returning codes that have been modified
   * or deleted and resetting the diff cache (at checkpoint height).
   */
  flush(): [string, CodeCacheElement][] {
    if (this.DEBUG) {
      this._debug(`Flushing cache on checkpoint ${this._checkpoints}`)
    }

    const diffMap = this._diffCache[this._checkpoints]

    const items: [string, CodeCacheElement][] = []

    for (const entry of diffMap.entries()) {
      const cacheKeyHex = entry[0]
      let elem: CodeCacheElement | undefined
      if (this._lruCache) {
        elem = this._lruCache.get(cacheKeyHex)
      } else {
        elem = this._orderedMapCache!.getElementByKey(cacheKeyHex)
      }

      if (elem !== undefined) {
        items.push([cacheKeyHex, elem])
      }
    }
    this._diffCache[this._checkpoints] = new Map<string, CodeCacheElement | undefined>()
    return items
  }

  /**
   * Revert changes to the cache to the last checkpoint (no effect on trie).
   */
  revert(): void {
    this._checkpoints -= 1
    if (this.DEBUG) {
      this._debug(`Revert to checkpoint ${this._checkpoints}`)
    }
    const diffMap = this._diffCache.pop()!
    for (const entry of diffMap.entries()) {
      const addressHex = entry[0]
      const elem = entry[1]
      if (elem === undefined) {
        if (this._lruCache) {
          this._lruCache.delete(addressHex)
        } else {
          this._orderedMapCache!.eraseElementByKey(addressHex)
        }
      } else {
        if (this._lruCache) {
          this._lruCache.set(addressHex, elem)
        } else {
          this._orderedMapCache!.setElement(addressHex, elem)
        }
      }
    }
  }

  /**
   * Commits the current state of the cache (no effect on trie).
   */
  commit(): void {
    this._checkpoints -= 1
    if (this.DEBUG) {
      this._debug(`Commit to checkpoint ${this._checkpoints}`)
    }
    const diffMap = this._diffCache.pop()!
    for (const entry of diffMap.entries()) {
      const addressHex = entry[0]
      const oldEntry = this._diffCache[this._checkpoints].has(addressHex)
      if (!oldEntry) {
        const elem = entry[1]
        this._diffCache[this._checkpoints].set(addressHex, elem)
      }
    }
  }

  /**
   * Marks the current state of the cache as a checkpoint, which can
   * later be reverted or committed.
   */
  checkpoint(): void {
    this._checkpoints += 1
    if (this.DEBUG) {
      this._debug(`New checkpoint ${this._checkpoints}`)
    }
    this._diffCache.push(new Map<string, CodeCacheElement | undefined>())
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
   * Returns a dictionary with cache statistics.
   *
   * @param reset - Whether to reset statistics after retrieval.
   * @returns A dictionary with cache statistics.
   */
  stats(reset = true): any {
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
   * Clears the cache.
   */
  clear(): void {
    if (this.DEBUG) {
      this._debug(`Clear cache`)
    }
    if (this._lruCache) {
      this._lruCache.clear()
    } else {
      this._orderedMapCache!.clear()
    }
  }
}
