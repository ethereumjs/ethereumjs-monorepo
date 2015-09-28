/*

//
// BLOCKCHAIN STATE LOOKUPS
//

// block number -> hash (in BLOCKHASH)
self.blockchain.getBlockByNumber(number, function (err, block) {
  if (err) return done(err)
  stack.push(block.hash())
  done()
})

// code lookup
account.getCode(self.trie, function (err2, code, compiled) {...})

// cache read writes
self.cache.getOrLoad(address, function (err, account) {
self.cache.getOrLoad(to, function (err, account) {
self.cache.getOrLoad(suicideTo, function(err, toAccount){
self.cache.get(opts.address)
self.cache.put(suicideTo, toAccount)
self.cache.put(opts.address, opts.account)
self.cache.put(caller, account)
self.cache.get(toAddress)
self.cache.checkpoint()
self.cache.commit()
self.cache.del(createdAddress)
self.cache.revert()
self.cache.put(caller, account)
self.cache.commit()
self.cache.put(toAddress, toAccount)

primary goal of cache mechanism:
  - pre-fetch from state trie
  - materializing to accnt obj
  - hold uncommited state

// update storageTrie
opts.account = self.cache.get(opts.address)
storageTrie.root = opts.account.stateRoot

self
  cache
  trie
  blockchain
  _precomiled

??

- Account objects, do they have any recency guarantees?
should they?
are they best as snapshots of the time of serialization?

- for the cache, do we ever checkpoint at a time when we dont
checkpoint the stateTrie?
what is the purpose?
  synchronous lookups?
  serialized objects?

- when is `vm.loadCompiled` used?

- how the hell to generalize `results.vm.storageTries`??

*/
const Trie = require('merkle-patricia-tree/secure.js')
const async = require('async')
const BN = require('bn.js')
const Account = require('ethereumjs-account')
const HistoryTree = require('history-tree')
const fakeBlockchain = require('./fakeBlockChain.js')
const Cache = require('./cache.js')

module.exports = StateManager

function StateManager (opts) {
  var trie = opts.trie
  if (!trie || !(trie instanceof Trie)) {
    trie = new Trie(trie)
  }

  var blockchain = opts.blockchain
  if (!blockchain) {
    blockchain = fakeBlockchain
  }

  var cache = new Cache(trie)

  this.blockchain = blockchain
  this.trie = trie
  this._storageTries = {}
  this.cache = cache
  this.history = new HistoryTree()

  // setup trie checkpointing
  this.history.on('commit', trie.commit.bind(trie))
  this.history.on('revert', trie.revert.bind(trie))
  // setup cache checkpointing
  this.history.on('commit', cache.commit.bind(cache))
  this.history.on('revert', cache.revert.bind(cache))
}

var proto = StateManager.prototype

//
// account
//

proto.getAccount = function (address, cb) {
  var self = this
  self.cache.getOrLoad(new Buffer(address, 'hex'), cb)
}

// saves the account
proto._putAccount = function (address, account, cb) {
  var self = this
  var addressHex = new Buffer(address, 'hex')
  // TODO: dont save newly created accounts that have no balance
  // if (toAccount.balance.toString('hex') === '00') {
  // if they have money or a non-zero nonce or code, then write to tree
  self.cache.put(addressHex, account)
  self.trie.put(addressHex, account.serialize(), cb)
}

proto.getAccountBalance = function (address, cb) {
  var self = this
  self.getAccount(address, function (err, account) {
    if (err) return cb(err)
    cb(null, account.balance)
  })
}

proto.putAccountBalance = function (address, account, balance, cb) {
  var self = this
  account.balance = balance
  self._putAccount(address, account, cb)
}

// sets the contract code on the account
proto.putContractCode = function (address, account, value, cb) {
  var self = this
  account.setCode(self.trie, value, function (err) {
    if (err) return cb(err)
    self._putAccount(address, account, cb)
  })
}

// given an account object, returns the code
proto.getContractCode = function (account, cb) {
  var self = this
  account.getCode(self.trie, cb)
}

proto.getContractCodeByAddress = function (address, cb) {
  var self = this
  self.getAccount(address, function (err, account) {
    if (err) return cb(err)
    self.getContractCode(account, cb)
  })
}

proto.getContractStorage = function (contract, key, cb) {
  var self = this
  contract.getStorage(self.trie, key, cb)
}

proto.commitContracts = function (cb) {
  var self = this
  async.each(Object.keys(self._storageTries), function (address, cb) {
    var trie = self._storageTries[address]
    delete self._storageTries[address]
    try {
      trie.commit(cb)
    } catch (e) {
      console.log('unblanced checkpoints')
      cb()
    }
  }, cb)
}

proto.revertContracts = function () {
  var self = this
  self._storageTries = {}
}

proto.putContractStorage = function (address, contract, key, value, cb) {
  var self = this
  var checkpoint = self.history.getCurrentCheckpoint()
  var originalRoot = contract.stateRoot

  var storageTrie = self._storageTries[address.toString('hex')]
  if (!storageTrie) {
    storageTrie = self.trie.copy()
    storageTrie.root = contract.stateRoot
    storageTrie._checkpoints = []
    self._storageTries[address.toString('hex')] = storageTrie
  }

  // set account code to new value
  var updateContract = function (cb) {
    // create contract trie
    storageTrie.put(key, value, function (err) {
      if (err) return cb()
      contract.stateRoot = storageTrie.root
      self._putAccount(address, contract, cb)
    })
  }

  async.series([
    updateContract,
  ], cb)
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
  self.history.checkpoint()
}

proto.commit = function (cb) {
  var self = this
  self.history.commit(cb)
}

proto.revert = function (cb) {
  var self = this
  self.history.revert(cb)
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

  async.eachSeries(accountArr, function (acnt, done) {
    acnt = new Buffer(acnt, 'hex')
    self.trie.get(acnt, function (err, val) {
      val = new Account(val)
      self.cache.put(acnt, val, true)
      done()
    })
  }, cb)
}
