const Tree = require('functional-red-black-tree')
import Account from '@ethereumjs/account'

/**
 * @ignore
 */
export default class Cache {
  _cache: any
  _checkpoints: any[]
  _trie: any

  constructor(trie: any) {
    this._cache = Tree()
    this._checkpoints = []
    this._trie = trie
  }

  /**
   * Puts account to cache under its address.
   * @param key - Address of account
   * @param val - Account
   */
  put(key: Buffer, val: Account, fromTrie: boolean = false): void {
    const modified = !fromTrie
    this._update(key, val, modified, false)
  }

  /**
   * Returns the queried account or an empty account.
   * @param key - Address of account
   */
  get(key: Buffer): Account {
    let account = this.lookup(key)
    if (!account) {
      account = new Account()
    }
    return account
  }

  /**
   * Returns the queried account or undefined.
   * @param key - Address of account
   */
  lookup(key: Buffer): Account | undefined {
    const keyStr = key.toString('hex')

    const it = this._cache.find(keyStr)
    if (it.node) {
      const account = new Account(it.value.val)
      return account
    }
  }

  /**
   * Looks up address in underlying trie.
   * @param address - Address of account
   * @param create - Create emtpy account if non-existent
   */
  async _lookupAccount(address: Buffer, create: boolean = true): Promise<Account | undefined> {
    const raw = await this._trie.get(address)
    if (raw || create) {
      const account = new Account(raw)
      return account
    }
  }

  /**
   * Looks up address in cache, if not found, looks it up
   * in the underlying trie.
   * @param key - Address of account
   * @param create - Create emtpy account if non-existent
   */
  async getOrLoad(key: Buffer, create: boolean = true): Promise<Account | undefined> {
    let account = this.lookup(key)

    if (!account) {
      account = await this._lookupAccount(key, create)
      if (account) {
        this._update(key, account as Account, false, false)
      }
    }

    return account
  }

  /**
   * Warms cache by loading their respective account from trie
   * and putting them in cache.
   * @param addresses - Array of addresses
   */
  async warm(addresses: string[]): Promise<void> {
    for (const addressHex of addresses) {
      if (addressHex) {
        const address = Buffer.from(addressHex, 'hex')
        const account = await this._lookupAccount(address)
        this._update(address, account as Account, false, false)
      }
    }
  }

  /**
   * Flushes cache by updating accounts that have been modified
   * and removing accounts that have been deleted.
   */
  async flush(): Promise<void> {
    const it = this._cache.begin
    let next = true
    while (next) {
      if (it.value && it.value.modified) {
        it.value.modified = false
        it.value.val = it.value.val.serialize()
        await this._trie.put(Buffer.from(it.key, 'hex'), it.value.val)
        next = it.hasNext
        it.next()
      } else if (it.value && it.value.deleted) {
        it.value.modified = false
        it.value.deleted = false
        it.value.val = new Account().serialize()
        await this._trie.del(Buffer.from(it.key, 'hex'))
        next = it.hasNext
        it.next()
      } else {
        next = it.hasNext
        it.next()
      }
    }
  }

  /**
   * Marks current state of cache as checkpoint, which can
   * later on be reverted or commited.
   */
  checkpoint(): void {
    this._checkpoints.push(this._cache)
  }

  /**
   * Revert changes to cache last checkpoint (no effect on trie).
   */
  revert(): void {
    this._cache = this._checkpoints.pop()
  }

  /**
   * Commits to current state of cache (no effect on trie).
   */
  commit(): void {
    this._checkpoints.pop()
  }

  /**
   * Clears cache.
   */
  clear(): void {
    this._cache = Tree()
  }

  /**
   * Marks address as deleted in cache.
   * @param key - Address
   */
  del(key: Buffer): void {
    this._update(key, new Account(), false, true)
  }

  _update(key: Buffer, val: Account, modified: boolean, deleted: boolean): void {
    const keyHex = key.toString('hex')
    const it = this._cache.find(keyHex)
    if (it.node) {
      this._cache = it.update({
        val: val,
        modified: modified,
        deleted: deleted,
      })
    } else {
      this._cache = this._cache.insert(keyHex, {
        val: val,
        modified: modified,
        deleted: deleted,
      })
    }
  }
}
