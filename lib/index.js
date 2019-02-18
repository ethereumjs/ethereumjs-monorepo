const AsyncEventEmitter = require('async-eventemitter')

const MetaVM = require('./metaVM.js')

/**
 * VM Class, `new VM(opts)` creates a new VM object
 * @class VM
 * @implements MetaVM
 * @constructor
 * @param {Object} opts
 * @param {StateManager} opts.stateManager a [`StateManager`](stateManager.md) instance to use as the state store (Beta API)
 * @param {Trie} opts.state a merkle-patricia-tree instance for the state tree (ignored if stateManager is passed)
 * @param {Blockchain} opts.blockchain a blockchain object for storing/retrieving blocks (ignored if stateManager is passed)
 * @param {String|Number} opts.chain the chain the VM operates on [default: 'mainnet']
 * @param {String} opts.hardfork hardfork rules to be used [default: 'byzantium', supported: 'byzantium', 'constantinople', 'petersburg' (will throw on unsupported)]
 * @param {Boolean} opts.activatePrecompiles create entries in the state tree for the precompiled contracts
 * @param {Boolean} opts.allowUnlimitedContractSize allows unlimited contract sizes while debugging. By setting this to `true`, the check for contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed. (default: `false`; ONLY set to `true` during debugging)
 * @param {Boolean} opts.emitFreeLogs Changes the behavior of the LOG opcode, the gas cost of the opcode becomes zero and calling it using STATICCALL won't throw. (default: `false`; ONLY set to `true` during debugging)
 */
class VM extends MetaVM {
  constructor (opts = {}) {
    super(opts)

    AsyncEventEmitter.call(this)
  }
}

VM.prototype.runCode = require('./runCode.js')
VM.prototype.runJIT = require('./runJit.js')
VM.prototype.runBlock = require('./runBlock.js')
VM.prototype.runTx = require('./runTx.js')
VM.prototype.runCall = require('./runCall.js')
VM.prototype.runBlockchain = require('./runBlockchain.js')

VM.prototype.copy = function () {
  return new VM({ stateManager: this.stateManager.copy(), blockchain: this.blockchain })
}

// util.inherits(VM, AsyncEventEmitter) - destroys the prototype; do it manually
for (const k in AsyncEventEmitter.prototype) {
  VM.prototype[k] = AsyncEventEmitter.prototype[k]
}

VM.deps = {
  ethUtil: require('ethereumjs-util'),
  Account: require('ethereumjs-account'),
  Trie: require('merkle-patricia-tree'),
  rlp: require('ethereumjs-util').rlp
}
VM.MetaVM = MetaVM

module.exports = VM
