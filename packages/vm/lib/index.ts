import { SecureTrie as Trie } from 'merkle-patricia-tree'
import { Account, BN } from 'ethereumjs-util'
import Blockchain from '@ethereumjs/blockchain'
import Common from '@ethereumjs/common'
import { StateManager, DefaultStateManager } from './state/index'
import { default as runCode, RunCodeOpts } from './runCode'
import { default as runCall, RunCallOpts } from './runCall'
import { default as runTx, RunTxOpts, RunTxResult } from './runTx'
import { default as runBlock, RunBlockOpts, RunBlockResult } from './runBlock'
import { EVMResult, ExecResult } from './evm/evm'
import { OpcodeList, getOpcodesForHF } from './evm/opcodes'
import { precompiles } from './evm/precompiles'
import runBlockchain from './runBlockchain'
const AsyncEventEmitter = require('async-eventemitter')
const promisify = require('util.promisify')

const IS_BROWSER = typeof (<any>globalThis).window === 'object' // very ugly way to detect if we are running in a browser
let mcl: any
let mclInitPromise: any

if (!IS_BROWSER) {
  mcl = require('mcl-wasm')
  mclInitPromise = mcl.init(mcl.BLS12_381)
}

/**
 * Options for instantiating a [[VM]].
 */
export interface VMOpts {
  /**
   * Use a [common](https://github.com/ethereumjs/ethereumjs-vm/packages/common) instance
   * if you want to change the chain setup.
   *
   * ### Possible Values
   *
   * - `chain`: all chains supported by `Common` or a custom chain
   * - `hardfork`: `mainnet` hardforks up to the `MuirGlacier` hardfork
   * - `eips`: `2537` (usage e.g. `eips: [ 2537, ]`)
   *
   * ### Supported EIPs
   *
   * - [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) (`experimental`) - BLS12-381 precompiles
   *
   * *Annotations:*
   *
   * - `experimental`: behaviour can change on patch versions
   *
   * ### Default Setup
   *
   * Default setup if no `Common` instance is provided:
   *
   * - `chain`: `mainnet`
   * - `hardfork`: `istanbul`
   * - `eips`: `[]`
   */
  common?: Common
  /**
   * A [[StateManager]] instance to use as the state store (Beta API)
   */
  stateManager?: StateManager
  /**
   * A [merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree) instance for the state tree (ignored if stateManager is passed)
   * @deprecated
   */
  state?: any // TODO
  /**
   * A [blockchain](https://github.com/ethereumjs/ethereumjs-vm/packages/blockchain) object for storing/retrieving blocks
   */
  blockchain?: Blockchain
  /**
   * If true, create entries in the state tree for the precompiled contracts, saving some gas the
   * first time each of them is called.
   *
   * If this parameter is false, the first call to each of them has to pay an extra 25000 gas
   * for creating the account.
   *
   * Setting this to true has the effect of precompiled contracts' gas costs matching mainnet's from
   * the very first call, which is intended for testing networks.
   *
   * Default: `false`
   */
  activatePrecompiles?: boolean
  /**
   * Allows unlimited contract sizes while debugging. By setting this to `true`, the check for
   * contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed.
   *
   * Default: `false` [ONLY set to `true` during debugging]
   */
  allowUnlimitedContractSize?: boolean
}

/**
 * Execution engine which can be used to run a blockchain, individual
 * blocks, individual transactions, or snippets of EVM bytecode.
 *
 * This class is an AsyncEventEmitter, please consult the README to learn how to use it.
 */
export default class VM extends AsyncEventEmitter {
  opts: VMOpts
  _common: Common
  stateManager: StateManager
  blockchain: Blockchain
  allowUnlimitedContractSize: boolean
  _opcodes: OpcodeList
  public readonly _emit: (topic: string, data: any) => Promise<void>
  protected isInitialized: boolean = false
  public readonly _mcl: any // pointer to the mcl package

  /**
   * VM async constructor. Creates engine instance and initializes it.
   *
   * @param opts VM engine constructor options
   */
  static async create(opts: VMOpts = {}): Promise<VM> {
    const vm = new this(opts)
    await vm.init()
    return vm
  }

  /**
   * Instantiates a new [[VM]] Object.
   * @param opts
   */
  constructor(opts: VMOpts = {}) {
    super()

    this.opts = opts

    // Throw on chain or hardfork options removed in latest major release
    // to prevent implicit chain setup on a wrong chain
    if ('chain' in opts || 'hardfork' in opts) {
      throw new Error('Chain/hardfork options are not allowed any more on initialization')
    }

    if (opts.common) {
      //EIPs
      const supportedEIPs = [2537]
      for (const eip of opts.common.eips()) {
        if (!supportedEIPs.includes(eip)) {
          throw new Error(`${eip} is not supported by the VM`)
        }
      }

      this._common = opts.common
    } else {
      const DEFAULT_CHAIN = 'mainnet'
      const supportedHardforks = [
        'chainstart',
        'homestead',
        'dao',
        'tangerineWhistle',
        'spuriousDragon',
        'byzantium',
        'constantinople',
        'petersburg',
        'istanbul',
        'muirGlacier',
        'berlin',
      ]

      this._common = new Common({
        chain: DEFAULT_CHAIN,
        supportedHardforks,
      })
    }

    // Set list of opcodes based on HF
    // TODO: make this EIP-friendly
    this._opcodes = getOpcodesForHF(this._common)

    if (opts.stateManager) {
      this.stateManager = opts.stateManager
    } else {
      const trie = opts.state || new Trie()
      this.stateManager = new DefaultStateManager({ trie, common: this._common })
    }

    this.blockchain = opts.blockchain || new Blockchain({ common: this._common })

    this.allowUnlimitedContractSize =
      opts.allowUnlimitedContractSize === undefined ? false : opts.allowUnlimitedContractSize

    if (this._common.eips().includes(2537)) {
      if (IS_BROWSER) {
        throw new Error('EIP-2537 is currently not supported in browsers')
      } else {
        this._mcl = mcl
      }
    }

    // We cache this promisified function as it's called from the main execution loop, and
    // promisifying each time has a huge performance impact.
    this._emit = promisify(this.emit.bind(this))
  }

  _updateOpcodes() {
    this._opcodes = getOpcodesForHF(this._common)
  }

  async init(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    const { opts } = this

    if (opts.activatePrecompiles && !opts.stateManager) {
      this.stateManager.checkpoint()
      // put 1 wei in each of the precompiles in order to make the accounts non-empty and thus not have them deduct `callNewAccount` gas.
      await Promise.all(
        Object.keys(precompiles)
          .map((k: string): Buffer => Buffer.from(k, 'hex'))
          .map((address: Buffer) =>
            this.stateManager.putAccount(address, new Account(new BN(0), new BN(1))),
          ),
      )
      await this.stateManager.commit()
    }

    if (this._common.eips().includes(2537)) {
      if (IS_BROWSER) {
        throw new Error('EIP-2537 is currently not supported in browsers')
      } else {
        let mcl = this._mcl
        await mclInitPromise // ensure that mcl is initialized.
        mcl.setMapToMode(mcl.IRTF) // set the right map mode; otherwise mapToG2 will return wrong values.
        mcl.verifyOrderG1(1) // subgroup checks for G1
        mcl.verifyOrderG2(1) // subgroup checks for G2
      }
    }
    this.isInitialized = true
  }

  /**
   * Processes blocks and adds them to the blockchain.
   *
   * This method modifies the state.
   *
   * @param blockchain -  An [@ethereumjs/blockchain](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/blockchain) object to process
   */
  async runBlockchain(blockchain?: Blockchain): Promise<void> {
    await this.init()
    return runBlockchain.bind(this)(blockchain)
  }

  /**
   * Processes the `block` running all of the transactions it contains and updating the miner's account
   *
   * This method modifies the state. If `generate` is `true`, the state modifications will be
   * reverted if an exception is raised. If it's `false`, it won't revert if the block's header is
   * invalid. If an error is thrown from an event handler, the state may or may not be reverted.
   *
   * @param {RunBlockOpts} opts - Default values for options:
   *  - `generate`: false
   */
  async runBlock(opts: RunBlockOpts): Promise<RunBlockResult> {
    await this.init()
    return runBlock.bind(this)(opts)
  }

  /**
   * Process a transaction. Run the vm. Transfers eth. Checks balances.
   *
   * This method modifies the state. If an error is thrown, the modifications are reverted, except
   * when the error is thrown from an event handler. In the latter case the state may or may not be
   * reverted.
   *
   * @param {RunTxOpts} opts
   */
  async runTx(opts: RunTxOpts): Promise<RunTxResult> {
    await this.init()
    return runTx.bind(this)(opts)
  }

  /**
   * runs a call (or create) operation.
   *
   * This method modifies the state.
   *
   * @param {RunCallOpts} opts
   */
  async runCall(opts: RunCallOpts): Promise<EVMResult> {
    await this.init()
    return runCall.bind(this)(opts)
  }

  /**
   * Runs EVM code.
   *
   * This method modifies the state.
   *
   * @param {RunCodeOpts} opts
   */
  async runCode(opts: RunCodeOpts): Promise<ExecResult> {
    await this.init()
    return runCode.bind(this)(opts)
  }

  /**
   * Returns a copy of the [[VM]] instance.
   */
  copy(): VM {
    return new VM({
      stateManager: this.stateManager.copy(),
      blockchain: this.blockchain,
      common: this._common,
    })
  }
}
