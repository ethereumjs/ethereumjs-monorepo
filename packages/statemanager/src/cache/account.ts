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
