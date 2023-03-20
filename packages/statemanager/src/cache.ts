import { Account } from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'
import { OrderedMap } from 'js-sdsl'

import type { Address } from '@ethereumjs/util'
import type { Debugger } from 'debug'

export type getCb = (address: Address) => Promise<Buffer | undefined>
export type putCb = (keyBuf: Buffer, accountRlp: Buffer) => Promise<void>
export type deleteCb = (keyBuf: Buffer) => Promise<void>

export interface CacheOpts {
  getCb: getCb
  putCb: putCb
  deleteCb: deleteCb
}

export const DEFAULT_CACHE_CLEARING_OPTS: CacheClearingOpts = {
  clear: true,
}

export type CacheClearingOpts = {
  /**
   * Full cache clearing
   * (overrides the useThreshold option)
   *
   * default: true
   */
  clear: boolean
  /**
   * Clean up the cache by deleting cache elements
   * where stored comparand is below the given
   * threshold.
   */
  useThreshold?: bigint
  /**
   * Comparand stored along a cache element with a
   * read or write access.
   *
   * This can be a block number, timestamp,
   * consecutive number or any other bigint
   * which makes sense as a comparison value.
   */
  comparand?: bigint
}

/**
 * account: undefined
 *
 * Account is known to not exist in the trie
 */
type CacheElement = {
  accountRLP: Buffer | undefined
  comparand: bigint
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

  _cache: OrderedMap<string, CacheElement>
  _diffCache: DiffCache = []
  _checkpoints = 0

  /**
   * Comparand for cache clearing.
   *
   * This value is stored along each cache element along
   * a write or get operation.
   *
   * Cache elements with a comparand lower than a certain
   * threshold can be deleted by using the clear() operation.
   */
  _comparand = BigInt(0)

  _getCb: getCb
  _putCb: putCb
  _deleteCb: deleteCb

  _stats = {
    cache: {
      size: 0,
      reads: 0,
      hits: 0,
      writes: 0,
      dels: 0,
    },
    trie: {
      reads: 0,
      writes: 0,
      dels: 0,
    },
  }

  constructor(opts: CacheOpts) {
    this._debug = createDebugLogger('statemanager:cache')

    this._cache = new OrderedMap()

    this._diffCache.push(new OrderedMap())

    this._getCb = opts.getCb
    this._putCb = opts.putCb
    this._deleteCb = opts.deleteCb
  }

  _saveCachePreState(addressHex: string) {
    const it = this._diffCache[this._checkpoints].find(addressHex)
    if (it.equals(this._diffCache[this._checkpoints].end())) {
      const oldElem = this._cache.getElementByKey(addressHex)
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
      comparand: this._comparand,
    }

    this._debug(`Put account ${addressHex}`)
    this._cache.setElement(addressHex, elem)
    this._stats.cache.writes += 1
  }

  /**
   * Returns the queried account or undefined if account doesn't exist
   * @param key - Address of account
   */
  get(address: Address): CacheElement | undefined {
    const addressHex = address.buf.toString('hex')
    this._debug(`Get account ${addressHex}`)

    const elem = this._cache.getElementByKey(addressHex)
    this._stats.cache.reads += 1
    if (elem) {
      this._stats.cache.hits += 1
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
    this._cache.setElement(addressHex, {
      accountRLP: undefined,
      comparand: this._comparand,
    })
    this._stats.cache.dels += 1
  }

  /**
   * Returns true if the key was deleted and thus existed in the cache earlier
   * @param key - trie key to lookup
   */
  keyIsDeleted(address: Address): boolean {
    const elem = this.get(address)

    if (elem !== undefined && elem.accountRLP === undefined) {
      return true
    } else {
      return false
    }
  }

  /**
   * Looks up address in cache, if not found, looks it up
   * in the underlying trie.
   * @param key - Address of account
   */
  async getOrLoad(address: Address): Promise<Account | undefined> {
    const addressHex: string = address.buf.toString('hex')
    const elem = this.get(address)

    if (!elem) {
      const accountRLP = await this._getCb(address)
      this._stats.trie.reads += 1
      this._debug(`Get account ${addressHex} from DB (${accountRLP ? 'exists' : 'non-existent'})`)
      this._cache.setElement(addressHex, {
        accountRLP,
        comparand: this._comparand,
      })
      return accountRLP ? Account.fromRlpSerializedAccount(accountRLP) : undefined
    } else {
      return elem.accountRLP ? Account.fromRlpSerializedAccount(elem.accountRLP) : undefined
    }
  }

  /**
   * Flushes cache by updating accounts that have been modified
   * and removing accounts that have been deleted.
   */
  async flush(): Promise<void> {
    this._debug(`Flushing cache on checkpoint ${this._checkpoints}`)

    const diffMap = this._diffCache[this._checkpoints]!
    const it = diffMap.begin()

    while (!it.equals(diffMap.end())) {
      const addressHex = it.pointer[0]
      const addressBuf = Buffer.from(addressHex, 'hex')
      const elem = this._cache.getElementByKey(addressHex)
      if (elem) {
        if (elem.accountRLP === undefined) {
          await this._deleteCb(addressBuf)
          this._stats.trie.dels += 1
        } else {
          await this._putCb(addressBuf, elem.accountRLP)
          this._stats.trie.writes += 1
        }
      }
      it.next()
    }
    this._diffCache[this._checkpoints] = new OrderedMap()
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
        this._cache.eraseElementByKey(addressHex)
      } else {
        this._cache.setElement(addressHex, elem)
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
    return this._cache.size()
  }

  /**
   * Returns a dict with cache stats
   * @param reset
   */
  stats(reset = true) {
    const stats = { ...this._stats }
    stats.cache.size = this.size()
    if (reset) {
      this._stats = {
        cache: {
          size: 0,
          reads: 0,
          hits: 0,
          writes: 0,
          dels: 0,
        },
        trie: {
          reads: 0,
          writes: 0,
          dels: 0,
        },
      }
    }
    return stats
  }

  /**
   * Clears cache.
   */
  clear(cacheClearingOpts: CacheClearingOpts = DEFAULT_CACHE_CLEARING_OPTS): void {
    this._debug(`Clear cache`)
    if (cacheClearingOpts.comparand !== undefined) {
      // Set new comparand value
      this._comparand = cacheClearingOpts.comparand
    }
    if (cacheClearingOpts.clear) {
      this._cache.clear()
      return
    }
    if (cacheClearingOpts.useThreshold !== undefined) {
      const threshold = cacheClearingOpts.useThreshold
      const it = this._cache.begin()
      while (!it.equals(this._cache.end())) {
        if (it.pointer[1].comparand < threshold) {
          this._cache.eraseElementByKey(it.pointer[0])
        }
        it.next()
      }
    }
  }
}
