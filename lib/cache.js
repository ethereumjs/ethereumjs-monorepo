const Buffer = require('safe-buffer').Buffer
const Tree = require('functional-red-black-tree')
const Account = require('ethereumjs-account')
const async = require('async')

module.exports = class Cache {
  constructor (trie) {
    this._cache = Tree()
    this._checkpoints = []
    this._trie = trie
  }

  /**
   * Puts account to cache under its address.
   * @param {Buffer} key - Address of account
   * @param {Account} val - Account
   * @param {bool} [fromTrie]
   */
  put (key, val, fromTrie = false) {
    const modified = !fromTrie
    this._update(key, val, modified, false)
  }

  /**
   * Returns the queried account or an empty account.
   * @param {Buffer} key - Address of account
   */
  get (key) {
    let account = this.lookup(key)
    if (!account) {
      account = new Account()
    }
    return account
  }

  /**
   * Returns the queried account or undefined.
   * @param {buffer} key - Address of account
   */
  lookup (key) {
    key = key.toString('hex')

    const it = this._cache.find(key)
    if (it.node) {
      const account = new Account(it.value.val)
      return account
    }
  }

  /**
   * Looks up address in underlying trie.
   * @param {Buffer} address - Address of account
   * @param {Function} cb - Callback with params (err, account)
   */
  _lookupAccount (address, cb) {
    this._trie.get(address, (err, raw) => {
      if (err) return cb(err)
      var account = new Account(raw)
      cb(null, account)
    })
  }

  /**
   * Looks up address in cache, if not found, looks it up
   * in the underlying trie.
   * @param {Buffer} key - Address of account
   * @param {Function} cb - Callback with params (err, account)
   */
  getOrLoad (key, cb) {
    const account = this.lookup(key)
    if (account) {
      async.nextTick(cb, null, account)
    } else {
      this._lookupAccount(key, (err, account) => {
        if (err) return cb(err)
        this._update(key, account, false, false)
        cb(null, account)
      })
    }
  }

  /**
   * Warms cache by loading their respective account from trie
   * and putting them in cache.
   * @param {Array} addresses - Array of addresses
   * @param {Function} cb - Callback
   */
  warm (addresses, cb) {
    // shim till async supports iterators
    var accountArr = []
    addresses.forEach((val) => {
      if (val) accountArr.push(val)
    })

    async.eachSeries(accountArr, (addressHex, done) => {
      var address = Buffer.from(addressHex, 'hex')
      this._lookupAccount(address, (err, account) => {
        if (err) return done(err)
        this._update(address, account, false, false)
        done()
      })
    }, cb)
  }

  /**
   * Flushes cache by updating accounts that have been modified
   * and removing accounts that have been deleted.
   * @param {function} cb - Callback
   */
  flush (cb) {
    const it = this._cache.begin
    let next = true
    async.whilst(() => next, (done) => {
      if (it.value && it.value.modified) {
        it.value.modified = false
        it.value.val = it.value.val.serialize()
        this._trie.put(Buffer.from(it.key, 'hex'), it.value.val, () => {
          next = it.hasNext
          it.next()
          done()
        })
      } else if (it.value && it.value.deleted) {
        it.value.modified = false
        it.value.deleted = false
        it.value.val = (new Account()).serialize()
        this._trie.del(Buffer.from(it.key, 'hex'), () => {
          next = it.hasNext
          it.next()
          done()
        })
      } else {
        next = it.hasNext
        it.next()
        async.nextTick(done)
      }
    }, cb)
  }

  /**
   * Marks current state of cache as checkpoint, which can
   * later on be reverted or commited.
   */
  checkpoint () {
    this._checkpoints.push(this._cache)
  }

  /**
   * Revert changes to cache last checkpoint (no effect on trie).
   */
  revert () {
    this._cache = this._checkpoints.pop()
  }

  /**
   * Commits to current state of cache (no effect on trie).
   */
  commit () {
    this._checkpoints.pop()
  }

  /**
   * Clears cache.
   */
  clear () {
    this._cache = Tree()
  }

  /**
   * Marks address as deleted in cache.
   * @params {Buffer} key - Address
   */
  del (key) {
    this._update(key, new Account(), false, true)
  }

  _update (key, val, modified, deleted) {
    key = key.toString('hex')
    const it = this._cache.find(key)
    if (it.node) {
      this._cache = it.update({
        val: val,
        modified: modified,
        deleted: deleted
      })
    } else {
      this._cache = this._cache.insert(key, {
        val: val,
        modified: modified,
        deleted: deleted
      })
    }
  }
}
