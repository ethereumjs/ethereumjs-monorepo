import { debug as createDebugLogger } from 'debug'
import { OrderedMap } from 'js-sdsl'

import type { Account, Address } from '@ethereumjs/util'
import type { Debugger } from 'debug'
import type LRUCache from 'lru-cache'

const LRU = require('lru-cache')

export interface CacheOpts {
  size: number
  type: CacheType
}

export enum CacheType {
  LRU = 'lru',
  ORDERED_MAP = 'ordered_map',
}

/**
 * account: undefined
 *
 * Account is known to not exist in the trie
 */
type CacheElement = {
  accountRLP: Buffer | undefined
}

/**
 * Diff cache collecting the state of the cache
 * at the beginning of checkpoint height
 * (respectively: before a first modification)
 *
 * If the whole cache element is undefined (in contrast
 * to the account), the element didn't exist in the cache
 * before.
 */
type DiffCache = OrderedMap<string, CacheElement | undefined>[]

/**
 * @ignore
 */
export class Cache {
  _debug: Debugger

  _lruCache: LRUCache<string, CacheElement> | undefined
  _orderedMapCache: OrderedMap<string, CacheElement> | undefined

  _diffCache: DiffCache = []
  _checkpoints = 0

  _stats = {
    size: 0,
    reads: 0,
    hits: 0,
    writes: 0,
    dels: 0,
  }

  constructor(opts: CacheOpts) {
    this._debug = createDebugLogger('statemanager:cache')

    if (opts.type === CacheType.LRU) {
      this._lruCache = new LRU({
        max: opts.size,
        updateAgeOnGet: true,
      })
    } else {
      this._orderedMapCache = new OrderedMap()
    }

    this._diffCache.push(new OrderedMap())
  }

  _saveCachePreState(addressHex: string) {
    const it = this._diffCache[this._checkpoints].find(addressHex)
    if (it.equals(this._diffCache[this._checkpoints].end())) {
      let oldElem
      if (this._lruCache) {
        oldElem = this._lruCache!.get(addressHex)
      } else {
        oldElem = this._orderedMapCache!.getElementByKey(addressHex)
      }
      this._debug(
        `Save pre cache state ${
          oldElem?.accountRLP ? 'as exists' : 'as non-existent'
        } for account ${addressHex}`
      )
      this._diffCache[this._checkpoints].setElement(addressHex, oldElem)
    }
  }

  /**
   * Puts account to cache under its address.
   * @param key - Address of account or undefined if account doesn't exist in the trie
   * @param val - Account
   */
  put(address: Address, account: Account | undefined): void {
    // TODO: deleted fromTrie parameter since I haven't found any calling
    // from any monorepo method, eventually re-evaluate the functionality
    // Holger Drewes, 2023-03-15
    const addressHex = address.buf.toString('hex')
    this._saveCachePreState(addressHex)
    const elem = {
      accountRLP: account !== undefined ? account.serialize() : undefined,
    }

    this._debug(`Put account ${addressHex}`)
    if (this._lruCache) {
      this._lruCache!.set(addressHex, elem)
    } else {
      this._orderedMapCache!.setElement(addressHex, elem)
    }
    this._stats.writes += 1
  }

  /**
   * Returns the queried account or undefined if account doesn't exist
   * @param key - Address of account
   */
  get(address: Address): CacheElement | undefined {
    const addressHex = address.buf.toString('hex')
    this._debug(`Get account ${addressHex}`)

    let elem
    if (this._lruCache) {
      elem = this._lruCache!.get(addressHex)
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
   * Marks address as deleted in cache.
   * @param key - Address
   */
  del(address: Address): void {
    const addressHex = address.buf.toString('hex')
    this._saveCachePreState(addressHex)
    this._debug(`Delete account ${addressHex}`)
    if (this._lruCache) {
      this._lruCache!.set(addressHex, {
        accountRLP: undefined,
      })
    } else {
      this._orderedMapCache!.setElement(addressHex, {
        accountRLP: undefined,
      })
    }

    this._stats.dels += 1
  }

  /**
   * Flushes cache by returning accounts that have been modified
   * or deleted and resetting the diff cache (at checkpoint height).
   */
  async flush(): Promise<[Buffer, CacheElement][]> {
    this._debug(`Flushing cache on checkpoint ${this._checkpoints}`)

    const diffMap = this._diffCache[this._checkpoints]!
    const it = diffMap.begin()

    const items: [Buffer, CacheElement][] = []

    while (!it.equals(diffMap.end())) {
      const addressHex = it.pointer[0]
      let elem
      if (this._lruCache) {
        elem = this._lruCache!.get(addressHex)
      } else {
        elem = this._orderedMapCache!.getElementByKey(addressHex)
      }

      if (elem) {
        items.push([Buffer.from(addressHex, 'hex'), elem])
      }
      it.next()
    }
    this._diffCache[this._checkpoints] = new OrderedMap()
    return items
  }

  /**
   * Marks current state of cache as checkpoint, which can
   * later on be reverted or committed.
   */
  checkpoint(): void {
    this._checkpoints += 1
    this._debug(`New checkpoint ${this._checkpoints}`)
    this._diffCache.push(new OrderedMap())
  }

  /**
   * Revert changes to cache last checkpoint (no effect on trie).
   */
  revert(): void {
    this._checkpoints -= 1
    this._debug(`Revert to checkpoint ${this._checkpoints}`)
    const diffMap = this._diffCache.pop()!

    const it = diffMap.begin()
    while (!it.equals(diffMap.end())) {
      const addressHex = it.pointer[0]
      const elem = it.pointer[1]
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
    this._debug(`Commit to checkpoint ${this._checkpoints}`)
    const diffMap = this._diffCache.pop()!

    const it = diffMap.begin()
    while (!it.equals(diffMap.end())) {
      const addressHex = it.pointer[0]
      const element = it.pointer[1]
      const oldElem = this._diffCache[this._checkpoints].getElementByKey(addressHex)
      if (!oldElem) {
        this._diffCache[this._checkpoints].setElement(addressHex, element)
      }
      it.next()
    }
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
    this._debug(`Clear cache`)
    if (this._lruCache) {
      this._lruCache!.clear()
    } else {
      this._orderedMapCache!.clear()
    }
  }
}
