const asyncLib = require('async')
const Tree = require('functional-red-black-tree')
import Account from 'ethereumjs-account'

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
   * @param cb - Callback with params (err, account)
   */
  _lookupAccount(address: Buffer, cb: any): void {
    this._trie.get(address, (err: Error, raw: Buffer) => {
      if (err) return cb(err)
      var account = new Account(raw)
      cb(null, account)
    })
  }

  /**
   * Looks up address in cache, if not found, looks it up
   * in the underlying trie.
   * @param key - Address of account
   * @param cb - Callback with params (err, account)
   */
  getOrLoad(key: Buffer, cb: any): void {
    const account = this.lookup(key)
    if (account) {
      asyncLib.nextTick(cb, null, account)
    } else {
      this._lookupAccount(key, (err: Error, account: Account) => {
        if (err) return cb(err)
        this._update(key, account, false, false)
        cb(null, account)
      })
    }
  }

  /**
   * Warms cache by loading their respective account from trie
   * and putting them in cache.
   * @param addresses - Array of addresses
   * @param cb - Callback
   */
  warm(addresses: string[], cb: any): void {
    // shim till async supports iterators
    const accountArr: string[] = []
    addresses.forEach(val => {
      if (val) accountArr.push(val)
    })

    asyncLib.eachSeries(
      accountArr,
      (addressHex: string, done: any) => {
        var address = Buffer.from(addressHex, 'hex')
        this._lookupAccount(address, (err: Error, account: Account) => {
          if (err) return done(err)
          this._update(address, account, false, false)
          done()
        })
      },
      cb,
    )
  }

  /**
   * Flushes cache by updating accounts that have been modified
   * and removing accounts that have been deleted.
   * @param cb - Callback
   */
  flush(cb: any): void {
    const it = this._cache.begin
    let next = true
    asyncLib.whilst(
      () => next,
      (done: any) => {
        if (it.value && it.value.modified) {
          it.value.modified = false
          it.value.val = it.value.val.serialize()
          this._trie.put(Buffer.from(it.key, 'hex'), it.value.val, (err: Error) => {
            if (err) return done(err)
            next = it.hasNext
            it.next()
            done()
          })
        } else if (it.value && it.value.deleted) {
          it.value.modified = false
          it.value.deleted = false
          it.value.val = new Account().serialize()
          this._trie.del(Buffer.from(it.key, 'hex'), (err: Error) => {
            if (err) return done(err)
            next = it.hasNext
            it.next()
            done()
          })
        } else {
          next = it.hasNext
          it.next()
          asyncLib.nextTick(done)
        }
      },
      cb,
    )
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
