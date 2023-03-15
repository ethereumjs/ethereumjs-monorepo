import { Account } from '@ethereumjs/util'
import { debug as createDebugLogger } from 'debug'
import { OrderedMap } from 'js-sdsl'

import type { Address } from '@ethereumjs/util'
import type { Debugger } from 'debug'

export type getCb = (address: Address) => Promise<Account | undefined>
export type putCb = (keyBuf: Buffer, accountRlp: Buffer) => Promise<void>
export type deleteCb = (keyBuf: Buffer) => Promise<void>

export interface CacheOpts {
  getCb: getCb
  putCb: putCb
  deleteCb: deleteCb
}

type CacheElement = {
  account: Buffer
}

type DiffCacheElement =
  | {
      account: Buffer
    }
  | undefined

/**
 * Diff cache collecting modified or deleted
 * account pre states per checkpoint height
 */
type DiffCache = OrderedMap<string, DiffCacheElement>[]

/**
 * @ignore
 */
export class Cache {
  _debug: Debugger

  _cache: OrderedMap<string, CacheElement>
  _diffCache: DiffCache = []
  _checkpoints = 0

  _getCb: getCb
  _putCb: putCb
  _deleteCb: deleteCb

  constructor(opts: CacheOpts) {
    this._debug = createDebugLogger('statemanager:cache')

    this._cache = new OrderedMap()

    this._diffCache.push(new OrderedMap())

    this._getCb = opts.getCb
    this._putCb = opts.putCb
    this._deleteCb = opts.deleteCb
  }

  _saveCachePreState(addressHex: string) {
    if (!this._diffCache[this._checkpoints].getElementByKey(addressHex)) {
      const oldElem = this._cache.getElementByKey(addressHex)
      this._debug(
        `Save pre cache state ${
          oldElem ? 'as exists' : 'as non-existent'
        } for account ${addressHex}`
      )
      this._diffCache[this._checkpoints].setElement(addressHex, oldElem)
    }
  }

  /**
   * Puts account to cache under its address.
   * @param key - Address of account
   * @param val - Account
   */
  put(address: Address, account: Account): void {
    // TODO: deleted fromTrie parameter since I haven't found any calling
    // from any monorepo method, eventually re-evaluate the functionality
    // Holger Drewes, 2023-03-15
    const addressHex = address.buf.toString('hex')
    this._saveCachePreState(addressHex)

    this._debug(`Put account ${addressHex}`)
    this._cache.setElement(addressHex, { account: account.serialize() })
  }

  /**
   * Returns the queried account or an empty account.
   * @param key - Address of account
   */
  get(address: Address): Account {
    const addressHex = address.buf.toString('hex')
    this._debug(`Get account ${addressHex}`)

    const elem = this._cache.getElementByKey(addressHex)
    if (elem) {
      return Account.fromRlpSerializedAccount(elem['account'])
    } else {
      return new Account()
    }
  }

  /**
   * Marks address as deleted in cache.
   * @param key - Address
   */
  del(address: Address): void {
    const addressHex = address.buf.toString('hex')
    this._saveCachePreState(addressHex)
    this._debug(`Delete account ${addressHex}`)
    this._cache.eraseElementByKey(addressHex)
  }

  /**
   * Returns true if the key was deleted and thus existed in the cache earlier
   * @param key - trie key to lookup
   */
  keyIsDeleted(address: Address): boolean {
    const account = this.get(address)

    if (account.isEmpty()) {
      return false
    } else {
      return true
    }
  }

  /**
   * Looks up address in cache, if not found, looks it up
   * in the underlying trie.
   * @param key - Address of account
   */
  async getOrLoad(address: Address): Promise<Account> {
    let account: Account | undefined = this.get(address)

    if (account.isEmpty()) {
      const addressHex = address.buf.toString('hex')
      account = await this._getCb(address)
      this._debug(`Get account ${addressHex} from DB (${account ? 'exists' : 'non-existent'})`)
      if (account) {
        this._cache.setElement(addressHex, { account: account.serialize() })
      } else {
        account = new Account()
        ;(account as any).virtual = true
      }
    }

    return account
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
      if (!elem) {
        await this._deleteCb(addressBuf)
      } else {
        await this._putCb(addressBuf, elem.account)
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
      const element = it.pointer[1]
      if (element === undefined) {
        this._cache.eraseElementByKey(addressHex)
      } else {
        this._cache.setElement(addressHex, element)
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
      this._diffCache[this._checkpoints].setElement(addressHex, element)
      it.next()
    }
  }

  /**
   * Clears cache.
   */
  clear(): void {
    this._debug(`Clear cache`)
    this._cache.clear()
  }
}
