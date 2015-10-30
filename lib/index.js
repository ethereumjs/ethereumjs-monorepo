require('es6-shim')
const util = require('util')
const async = require('async')
const BN = require('bn.js')
const common = require('ethereum-common')
const StateManager = require('./stateManager.js')
var AsyncEventEmitter = require('async-eventemitter')

// require the percomiled contracts
const num01 = require('./precompiled/01-ecrecover.js')
const num02 = require('./precompiled/02-sha256.js')
const num03 = require('./precompiled/03-repemd160.js')
const num04 = require('./precompiled/04-identity.js')

module.exports = VM

VM.deps = {
  ethUtil: require('ethereumjs-util'),
  Account: require('ethereumjs-account'),
  Trie: require('merkle-patricia-tree'),
  rlp: require('rlp')
}

/**
 * @constructor
 */
function VM (trie, blockchain) {
  this.stateManager = new StateManager({
    trie: trie,
    blockchain: blockchain
  })

  // temporary
  // this is here for a gradual transition to StateManager
  this.blockchain = this.stateManager.blockchain
  this.trie = this.stateManager.trie

  // precompiled contracts
  this._precomiled = {}
  this._precomiled['0000000000000000000000000000000000000001'] = num01
  this._precomiled['0000000000000000000000000000000000000002'] = num02
  this._precomiled['0000000000000000000000000000000000000003'] = num03
  this._precomiled['0000000000000000000000000000000000000004'] = num04

  AsyncEventEmitter.call(this)
}

util.inherits(VM, AsyncEventEmitter)

VM.prototype.runCode = require('./runCode.js')
VM.prototype.runJIT = require('./runJit.js')
VM.prototype.runBlock = require('./runBlock.js')
VM.prototype.runTx = require('./runTx.js')
VM.prototype.runCall = require('./runCall.js')
VM.prototype.runBlockchain = require('./runBlockchain.js')

VM.prototype.copy = function () {
  var trie = this.trie.copy()
  return new VM(trie, this.blockchain)
}

/**
 * Loads precomiled contracts into the state
 */
VM.prototype.loadCompiled = function (address, src, cb) {
  this.trie.db.put(address, src, cb)
}

VM.prototype.populateCache = function (addresses, cb) {
  this.stateManager.warmCache(addresses, cb)
}
