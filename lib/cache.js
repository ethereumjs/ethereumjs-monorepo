const Tree = require('functional-red-black-tree')
const Account = require('ethereumjs-account')
const async = require('async')

var Cache = module.exports = function (trie) {
  this._cache = Tree()
  this._checkpoints = []
  this._deletes = []
  this._trie = trie
}

Cache.prototype.put = function (key, val, fromTrie) {
  var modified = !fromTrie
  key = key.toString('hex')
  var it = this._cache.find(key)
  if (it.node) {
    this._cache = it.update({
      val: val,
      modified: modified
    })
  } else {
    this._cache = this._cache.insert(key, {
      val: val,
      modified: modified
    })
  }
}

// returns the queried account or an empty account
Cache.prototype.get = function (key) {
  var account = this.lookup(key)
  return account || new Account()
}

// returns the queried account or undefined
Cache.prototype.lookup = function (key) {
  key = key.toString('hex')

  var it = this._cache.find(key)
  if (it.node) {
    return new Account(it.value.val)
  }
}

Cache.prototype.getOrLoad = function (key, cb) {
  var self = this

  var account = this.lookup(key)
  key = key.toString('hex')

  if (account) {
    var raw = account && account.isEmpty() ? null : account.raw
    cb(null, account, raw)
  } else {
    this._trie.get(new Buffer(key, 'hex'), function (err, raw) {
      var account = new Account(raw)
      self._cache = self._cache.insert(key, {
        val: account,
        modified: false
      })
      cb(err, account, raw)
    })
  }
}

Cache.prototype.flush = function (cb) {
  var it = this._cache.begin
  var self = this
  var next = true

  async.whilst(function () {
    return next
  }, function (done) {
    if (it.value.modified) {
      it.value.modified = false
      it.value.val = it.value.val.serialize()

      self._trie.put(new Buffer(it.key, 'hex'), it.value.val, function () {
        next = it.hasNext
        it.next()
        done()
      })
    } else {
      next = it.hasNext
      it.next()
      done()
    }
  }, function () {
    // self._cache = Tree()
    async.eachSeries(self._deletes, function (address, done) {
      self._trie.del(address, done)
    }, function () {
      self._deletes = []
      cb()
    })
  })
}

Cache.prototype.checkpoint = function () {
  this._checkpoints.push(this._cache)
}

Cache.prototype.revert = function () {
  this._cache = this._checkpoints.pop(this._cache)
}

Cache.prototype.commit = function () {
  this._checkpoints.pop()
}

Cache.prototype.del = function (key) {
  this._deletes.push(key)
  key = key.toString('hex')
  this._cache = this._cache.remove(key)
}
