import BN = require('bn.js')
import { StateManager } from './state'
import Common from 'ethereumjs-common'
import Account from 'ethereumjs-account'
import { default as runCode, RunCodeOpts, RunCodeCb } from './runCode'
import { default as runCall, RunCallOpts, RunCallCb } from './runCall'
const promisify = require('util.promisify')
const AsyncEventEmitter = require('async-eventemitter')
const Blockchain = require('ethereumjs-blockchain')
const Trie = require('merkle-patricia-tree/secure.js')

export interface VMOpts {
  chain?: string
  hardfork?: string
  stateManager?: StateManager
  state?: any // TODO
  blockchain?: any // TODO
  activatePrecompiles?: boolean
  allowUnlimitedContractSize?: boolean
}

/**
 * VM Class, `new VM(opts)` creates a new VM object
 * @method VM
 * @param {Object} opts
 * @param {StateManager} opts.stateManager a [`StateManager`](stateManager.md) instance to use as the state store (Beta API)
 * @param {Trie} opts.state a merkle-patricia-tree instance for the state tree (ignored if stateManager is passed)
 * @param {Blockchain} opts.blockchain a blockchain object for storing/retrieving blocks (ignored if stateManager is passed)
 * @param {String|Number} opts.chain the chain the VM operates on [default: 'mainnet']
 * @param {String} opts.hardfork hardfork rules to be used [default: 'byzantium', supported: 'byzantium', 'constantinople', 'petersburg' (will throw on unsupported)]
 * @param {Boolean} opts.activatePrecompiles create entries in the state tree for the precompiled contracts
 * @param {Boolean} opts.allowUnlimitedContractSize allows unlimited contract sizes while debugging. By setting this to `true`, the check for contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed. (default: `false`; ONLY set to `true` during debugging)
 */
export default class VM extends AsyncEventEmitter {
  opts: VMOpts
  _common: Common
  stateManager: StateManager
  blockchain: any
  allowUnlimitedContractSize: boolean

  constructor (opts: VMOpts = {}) {
    super()

    this.opts = opts

    let chain = opts.chain ? opts.chain : 'mainnet'
    let hardfork = opts.hardfork ? opts.hardfork : 'byzantium'
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

    // @deprecated
    this.runJIT = require('./runJit.js').bind(this)
    this.runBlock = require('./runBlock.js').bind(this)
    this.runTx = require('./runTx.js').bind(this)
    this.runBlockchain = require('./runBlockchain.js').bind(this)
  }

  runCall (opts: RunCallOpts, cb: RunCallCb): void {
    runCall.bind(this)(opts, cb)
  }

  runCode (opts: RunCodeOpts, cb: RunCodeCb): void {
    runCode.bind(this)(opts, cb)
  }

  copy (): VM {
    return new VM({ stateManager: this.stateManager.copy(), blockchain: this.blockchain })
  }

  async _emit (topic: string, data: any) {
    return promisify(this.emit.bind(this))(topic, data)
  }
}
