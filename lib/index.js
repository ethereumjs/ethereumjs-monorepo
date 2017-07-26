const util = require('util')
const StateManager = require('./stateManager.js')
const Account = require('ethereumjs-account')
const AsyncEventEmitter = require('async-eventemitter')

// require the percomiled contracts
const num01 = require('./precompiled/01-ecrecover.js')
const num02 = require('./precompiled/02-sha256.js')
const num03 = require('./precompiled/03-ripemd160.js')
const num04 = require('./precompiled/04-identity.js')

module.exports = VM

VM.deps = {
  ethUtil: require('ethereumjs-util'),
  Account: require('ethereumjs-account'),
  Trie: require('merkle-patricia-tree'),
  rlp: require('ethereumjs-util').rlp
}

/**
 * @constructor
 * @param {Object} [opts]
 * @param {Trie} [opts.state] A merkle-patricia-tree instance for the state tree
 * @param {Blockchain} [opts.blockchain] A blockchain object for storing/retrieving blocks
 * @param {Boolean} [opts.activatePrecompiles] Create entries in the state tree for the precompiled contracts
 */
function VM (opts = {}) {
  this.stateManager = new StateManager({
    trie: opts.state,
    blockchain: opts.blockchain
  })

  // temporary
  // this is here for a gradual transition to StateManager
  this.blockchain = this.stateManager.blockchain
  this.trie = this.stateManager.trie
  this.opts = opts || {}

  // precompiled contracts
  this._precompiled = {}
  this._precompiled['0000000000000000000000000000000000000001'] = num01
  this._precompiled['0000000000000000000000000000000000000002'] = num02
  this._precompiled['0000000000000000000000000000000000000003'] = num03
  this._precompiled['0000000000000000000000000000000000000004'] = num04

  if (this.opts.activatePrecompiles) {
    for (var i = 1; i <= 4; i++) {
      this.trie.put(new Buffer('000000000000000000000000000000000000000' + i, 'hex'), new Account().serialize())
    }
  }

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
  return new VM({
    state: this.trie.copy(),
    blockchain: this.blockchain
  })
}

/**
 * Loads precompiled contracts into the state
 */
VM.prototype.loadCompiled = function (address, src, cb) {
  this.trie.db.put(address, src, cb)
}

VM.prototype.populateCache = function (addresses, cb) {
  this.stateManager.warmCache(addresses, cb)
}
