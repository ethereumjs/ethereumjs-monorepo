const Buffer = require('safe-buffer').Buffer
const ethUtil = require('ethereumjs-util')
const { StateManager } = require('./state')
const Common = require('ethereumjs-common').default
const Blockchain = require('ethereumjs-blockchain')
const Account = require('ethereumjs-account')
const AsyncEventEmitter = require('async-eventemitter')
const Trie = require('merkle-patricia-tree/secure.js')
const BN = ethUtil.BN

// require the precompiled contracts
const num01 = require('./evm/precompiles/01-ecrecover.js')
const num02 = require('./evm/precompiles/02-sha256.js')
const num03 = require('./evm/precompiles/03-ripemd160.js')
const num04 = require('./evm/precompiles/04-identity.js')
const num05 = require('./evm/precompiles/05-modexp.js')
const num06 = require('./evm/precompiles/06-ecadd.js')
const num07 = require('./evm/precompiles/07-ecmul.js')
const num08 = require('./evm/precompiles/08-ecpairing.js')

/**
 * VM Class, `new VM(opts)` creates a new VM object
 * @method VM
 * @param {Object} opts
 * @param {StateManager} opts.stateManager a [`StateManager`](stateManager.md) instance to use as the state store (Beta API)
 * @param {Trie} opts.state a merkle-patricia-tree instance for the state tree (ignored if stateManager is passed)
 * @param {Blockchain} opts.blockchain a blockchain object for storing/retrieving blocks (ignored if stateManager is passed)
 * @param {String|Number} opts.chain the chain the VM operates on [default: 'mainnet']
 * @param {String} opts.hardfork hardfork rules to be used [default: 'petersburg', supported: 'byzantium', 'constantinople', 'petersburg' (will throw on unsupported)]
 * @param {Boolean} opts.activatePrecompiles create entries in the state tree for the precompiled contracts
 * @param {Boolean} opts.allowUnlimitedContractSize allows unlimited contract sizes while debugging. By setting this to `true`, the check for contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed. (default: `false`; ONLY set to `true` during debugging)
 * @param {Boolean} opts.emitFreeLogs Changes the behavior of the LOG opcode, the gas cost of the opcode becomes zero and calling it using STATICCALL won't throw. (default: `false`; ONLY set to `true` during debugging)
 */
module.exports = class VM extends AsyncEventEmitter {
  constructor (opts = {}) {
    super()

    this.opts = opts

    let chain = opts.chain ? opts.chain : 'mainnet'
    let hardfork = opts.hardfork ? opts.hardfork : 'petersburg'
    let supportedHardforks = [
      'byzantium',
      'constantinople',
      'petersburg'
    ]
    this._common = new Common(chain, hardfork, supportedHardforks)

    if (opts.stateManager) {
      this.stateManager = opts.stateManager
    } else {
      var trie = opts.state || new Trie()
      if (opts.activatePrecompiles) {
        for (var i = 1; i <= 8; i++) {
          trie.put(new BN(i).toArrayLike(Buffer, 'be', 20), new Account().serialize())
        }
      }
      this.stateManager = new StateManager({ trie, common: this._common })
    }

    this.blockchain = opts.blockchain || new Blockchain({ common: this._common })

    this.allowUnlimitedContractSize = opts.allowUnlimitedContractSize === undefined ? false : opts.allowUnlimitedContractSize
    this.emitFreeLogs = opts.emitFreeLogs === undefined ? false : opts.emitFreeLogs

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

    this.runCode = require('./runCode.js').bind(this)
    this.runJIT = require('./runJit.js').bind(this)
    this.runBlock = require('./runBlock.js').bind(this)
    this.runTx = require('./runTx.js').bind(this)
    this.runCall = require('./runCall.js').bind(this)
    this.runBlockchain = require('./runBlockchain.js').bind(this)
  }

  copy () {
    return new VM({ stateManager: this.stateManager.copy(), blockchain: this.blockchain })
  }
}
