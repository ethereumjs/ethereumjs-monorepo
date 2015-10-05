const Trie = require('merkle-patricia-tree/secure.js')
const async = require('async')
const Account = require('ethereumjs-account')
const fakeBlockchain = require('./fakeBlockChain.js')
const Cache = require('./cache.js')

module.exports = StateManager

function StateManager (opts) {
  var self = this

  var trie = opts.trie
  if (!trie) {
    trie = new Trie(trie)
  }

  var blockchain = opts.blockchain
  if (!blockchain) {
    blockchain = fakeBlockchain
  }

  var cache = new Cache(trie)

  self.blockchain = blockchain
  self.trie = trie
  self._storageTries = {}
  self.cache = cache
}

var proto = StateManager.prototype

//
// account
//
proto._lookupAccount = function (address, cb) {
  var self = this
  self.trie.get(address, function (err, raw) {
    if (err) return cb(err)
    var account = new Account(raw)
    var exists = !!raw
    cb(null, account, exists)
  })
}

// gets the account from the cache, or triggers a lookup and stores
// the result in the cache
proto.getAccount = function (address, cb) {
  var self = this
  var cache = self.cache
  var account = cache.lookup(address)

  if (account) {
    var raw = account && account.isEmpty() ? null : account.raw
    cb(null, account, raw)
  } else {
    self._lookupAccount(address, function (err, account, exists) {
      if (err) return cb(err)
      // ugly manual cache insertion
      cache._cache = cache._cache.insert(address.toString('hex'), {
        val: account,
        modified: false
      })
      cb(null, account, exists)
    })
  }
}

// saves the account
proto._putAccount = function (address, account, cb) {
  var self = this
  var addressHex = new Buffer(address, 'hex')
  // TODO: dont save newly created accounts that have no balance
  // if (toAccount.balance.toString('hex') === '00') {
  // if they have money or a non-zero nonce or code, then write to tree
  self.cache.put(addressHex, account)
  // self.trie.put(addressHex, account.serialize(), cb)
  cb()
}

proto.getAccountBalance = function (address, cb) {
  var self = this
  self.getAccount(address, function (err, account) {
    if (err) return cb(err)
    cb(null, account.balance)
  })
}

proto.putAccountBalance = function (address, balance, cb) {
  var self = this
  self.getAccount(address, function (err, account) {
    account.balance = balance
    self._putAccount(address, account, cb)
  })
}

// sets the contract code on the account
proto.putContractCode = function (address, value, cb) {
  var self = this
  self.getAccount(address, function (err, account) {
    account.setCode(self.trie, value, function (err) {
      if (err) return cb(err)
      self._putAccount(address, account, cb)
    })
  })
}

// given an account object, returns the code
proto.getContractCode = function (address, cb) {
  var self = this
  self.getAccount(address, function (err, account) {
    if (err) return cb(err)
    account.getCode(self.trie, cb)
  })
}

// creates a storage trie from the primary storage trie
proto._lookupStorageTrie = function (address, cb) {
  var self = this
  // from state trie
  self.getAccount(address, function (err, account) {
    if (err) return cb(err)
    var storageTrie = self.trie.copy()
    storageTrie.root = account.stateRoot
    storageTrie._checkpoints = []
    cb(null, storageTrie)
  })
}

// gets the storage trie from the storage cache or does lookup
proto._getStorageTrie = function (address, cb) {
  var self = this
  var storageTrie = self._storageTries[address.toString('hex')]
  // from storage cache
  if (storageTrie) {
    cb(null, storageTrie)
    return
  }
  // lookup from state
  self._lookupStorageTrie(address, cb)
}

proto.getContractStorage = function (address, key, cb) {
  var self = this
  self._getStorageTrie(address, function (err, trie) {
    if (err) return cb(err)
    trie.get(key, cb)
  })
}

proto.putContractStorage = function (address, key, value, cb) {
  var self = this
  self._getStorageTrie(address, function (err, storageTrie) {
    if (err) return cb(err)

    if (value) {
      storageTrie.put(key, value, finalize)
    } else {
      storageTrie.del(key, finalize)
    }

    function finalize (err) {
      if (err) return cb(err)
      // update storage cache
      self._storageTries[address.toString('hex')] = storageTrie
      // update contract stateRoot
      var contract = self.cache.get(address)
      contract.stateRoot = storageTrie.root
      self._putAccount(address, contract, cb)
    }
  })
}

proto.commitContracts = function (cb) {
  var self = this
  async.each(Object.keys(self._storageTries), function (address, cb) {
    var trie = self._storageTries[address]
    delete self._storageTries[address]
    if (trie.isCheckpoint) {
      trie.commit(cb)
    } else {
      cb()
    }
  }, cb)
}

proto.revertContracts = function () {
  var self = this
  self._storageTries = {}
}

//
// blockchain
//

proto.getBlockHashByNumber = function (number, cb) {
  var self = this
  self.blockchain.getBlockByNumber(number, function (err, block) {
    if (err) return cb(err)
    var blockHash = block.hash()
    cb(null, blockHash)
  })
}

//
// revision history
//

proto.checkpoint = function () {
  var self = this
  self.trie.checkpoint()
  self.cache.checkpoint()
}

proto.commit = function (cb) {
  var self = this
  // setup trie checkpointing
  self.trie.commit(function () {
    // setup cache checkpointing
    self.cache.commit()
    cb()
  })
}

proto.revert = function (cb) {
  var self = this
  // setup trie checkpointing
  self.trie.revert()
  // setup cache checkpointing
  self.cache.revert()
  cb()
}

//
// cache stuff
//

proto.getStateRoot = function (cb) {
  var self = this
  self.cacheFlush(function (err) {
    if (err) return cb(err)
    var stateRoot = self.trie.root
    cb(null, stateRoot)
  })
}

/**
 * @param {Set} address
 * @param {cb} function
 */
proto.warmCache = function (addresses, cb) {
  var self = this

  // shim till async supports iterators
  var accountArr = []
  addresses.forEach(function (val) {
    if (val) accountArr.push(val)
  })

  async.eachSeries(accountArr, function (addressHex, done) {
    var address = new Buffer(addressHex, 'hex')
    self._lookupAccount(address, function (err, account) {
      self.cache.put(address, account, true)
      done(err)
    })
  }, cb)
}
