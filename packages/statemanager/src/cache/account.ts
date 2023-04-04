import { debug as createDebugLogger } from 'debug'

import { Cache } from './cache'

import type { CacheOpts } from './types'
import type { Account, Address } from '@ethereumjs/util'

/**
 * account: undefined
 *
 * Account is known to not exist in the trie
 */
type AccountCacheElement = {
  accountRLP: Buffer | undefined
}

export class AccountCache extends Cache<AccountCacheElement> {
  constructor(opts: CacheOpts) {
    super(opts)
    this._debug = createDebugLogger('statemanager:cache:account')
  }

  /**
   * Puts account to cache under its address.
   * @param key - Address of account or undefined if account doesn't exist in the trie
   * @param val - Account
   */
  put(address: Address, account: Account | undefined): void {
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
  get(address: Address): AccountCacheElement | undefined {
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
}
