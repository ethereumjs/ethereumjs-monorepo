import {Buffer} from 'safe-buffer'
import util from 'util'
import ethUtil from 'ethereumjs-util'
import StateManager from './stateManager.js'
import Account from 'ethereumjs-account'
import AsyncEventEmitter from 'async-eventemitter'

// import the vm components
import runCode from './runCode'
import runJIT from './runJit'
import runBlock from './runBlock'
import runTx from './runTx'
import runCall from './runCall'
import runBlockchain from './runBlockchain'

// import the precompiled contracts
import num01 from './precompiled/01-ecrecover.js'
import num02 from './precompiled/02-sha256.js'
import num03 from './precompiled/03-ripemd160.js'
import num04 from './precompiled/04-identity.js'
import num05 from './precompiled/05-modexp.js'
import num06 from './precompiled/06-ecadd.js'
import num07 from './precompiled/07-ecmul.js'
import num08 from './precompiled/08-ecpairing.js'

const BN = ethUtil.BN
VM.deps = {
  ethUtil: ethUtil,
  Account: require('ethereumjs-account'),
  Trie: require('merkle-patricia-tree'),
  rlp: require('ethereumjs-util').rlp
}

/**
 * @constructor
 * @param {Object} [opts]
 * @param {StateManager} [opts.stateManager] A state manager instance (EXPERIMENTAL - unstable API)
 * @param {Trie} [opts.state] A merkle-patricia-tree instance for the state tree (ignored if stateManager is passed)
 * @param {Blockchain} [opts.blockchain] A blockchain object for storing/retrieving blocks (ignored if stateManager is passed)
 * @param {Boolean} [opts.activatePrecompiles] Create entries in the state tree for the precompiled contracts
 */
function VM (opts = {}) {
  this.opts = opts

  if (opts.stateManager) {
    this.stateManager = opts.stateManager
  } else {
    this.stateManager = new StateManager({
      trie: opts.state,
      blockchain: opts.blockchain
    })
  }

  // temporary
  // this is here for a gradual transition to StateManager
  this.blockchain = this.stateManager.blockchain
  this.trie = this.stateManager.trie

  // precompiled contracts
  this._precompiled = {}
  this._precompiled['0000000000000000000000000000000000000001'] = num01
  this._precompiled['0000000000000000000000000000000000000002'] = num02
  this._precompiled['0000000000000000000000000000000000000003'] = num03
  this._precompiled['0000000000000000000000000000000000000004'] = num04
  this._precompiled['0000000000000000000000000000000000000005'] = num05
  this._precompiled['0000000000000000000000000000000000000006'] = num06
  this._precompiled['0000000000000000000000000000000000000007'] = num07
  this._precompiled['0000000000000000000000000000000000000008'] = num08

  if (this.opts.activatePrecompiles) {
    for (var i = 1; i <= 7; i++) {
      this.trie.put(new BN(i).toArrayLike(Buffer, 'be', 20), new Account().serialize())
    }
  }

  AsyncEventEmitter.call(this)
}

util.inherits(VM, AsyncEventEmitter)

VM.prototype.runCode = runCode
VM.prototype.runJIT = runJIT
VM.prototype.runBlock = runBlock
VM.prototype.runTx = runTx
VM.prototype.runCall = runCall
VM.prototype.runBlockchain = runBlockchain

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

export default VM
