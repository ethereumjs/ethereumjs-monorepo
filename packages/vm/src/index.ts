import { SecureTrie as Trie } from 'merkle-patricia-tree'
import { Account, Address, BNLike } from 'ethereumjs-util'
import Blockchain from '@ethereumjs/blockchain'
import Common, { Chain } from '@ethereumjs/common'
import { StateManager, DefaultStateManager } from './state/index'
import { default as runCode, RunCodeOpts } from './runCode'
import { default as runCall, RunCallOpts } from './runCall'
import { default as runTx, RunTxOpts, RunTxResult } from './runTx'
import { default as runBlock, RunBlockOpts, RunBlockResult } from './runBlock'
import { default as buildBlock, BuildBlockOpts, BlockBuilder } from './buildBlock'
import { EVMResult, ExecResult } from './evm/evm'
import { OpcodeList, getOpcodesForHF, OpHandler } from './evm/opcodes'
import { precompiles } from './evm/precompiles'
import runBlockchain from './runBlockchain'
const AsyncEventEmitter = require('async-eventemitter')
import { promisify } from 'util'
import { CustomOpcode } from './evm/types'
import { AsyncDynamicGasHandler, SyncDynamicGasHandler } from './evm/opcodes/gas'

// very ugly way to detect if we are running in a browser
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')
let mcl: any
let mclInitPromise: any

if (!isBrowser()) {
  mcl = require('mcl-wasm')
  mclInitPromise = mcl.init(mcl.BLS12_381)
}

/**
 * Options for instantiating a {@link VM}.
 */
export interface VMOpts {
  /**
   * Use a {@link Common} instance
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
   * - [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - EIP-1559 Fee Market
   * - [EIP-2315](https://eips.ethereum.org/EIPS/eip-2315) - VM simple subroutines (`experimental`)
   * - [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles (`experimental`)
   * - [EIP-2565](https://eips.ethereum.org/EIPS/eip-2565) - ModExp Gas Cost
   * - [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) - Typed Transactions
   * - [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - Gas cost increases for state access opcodes
   * - [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) - Access List Transaction Type
   * - [EIP-3198](https://eips.ethereum.org/EIPS/eip-3198) - BASEFEE opcode
   * - [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) - Reduction in refunds
   * - [EIP-3540](https://eips.ethereum.org/EIPS/eip-3541) - EVM Object Format (EOF) v1 (`experimental`)
   * - [EIP-3541](https://eips.ethereum.org/EIPS/eip-3541) - Reject new contracts starting with the 0xEF byte
   * - [EIP-3670](https://eips.ethereum.org/EIPS/eip-3670) - EOF - Code Validation (`experimental`)
   * - [EIP-3855](https://eips.ethereum.org/EIPS/eip-3855) - PUSH0 instruction (`experimental`)
   * - [EIP-3860](https://eips.ethereum.org/EIPS/eip-3860) - Limit and meter initcode (`experimental`)
   * - [EIP-4399](https://eips.ethereum.org/EIPS/eip-4399) - Supplant DIFFICULTY opcode with PREVRANDAO (Merge) (`experimental`)
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
   * A {@link StateManager} instance to use as the state store (Beta API)
   */
  stateManager?: StateManager
  /**
   * A {@link SecureTrie} instance for the state tree (ignored if stateManager is passed)
   * @deprecated - will be removed in next major version release
   */
  state?: Trie
  /**
   * A {@link Blockchain} object for storing/retrieving blocks
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
   * If true, the state of the VM will add the genesis state given by {@link Common} to a new
   * created state manager instance. Note that if stateManager option is also passed as argument
   * this flag won't have any effect.
   *
   * Default: `false`
   */
  activateGenesisState?: boolean
  /**
   * Allows unlimited contract sizes while debugging. By setting this to `true`, the check for
   * contract size limit of 24KB (see [EIP-170](https://git.io/vxZkK)) is bypassed.
   *
   * Default: `false` [ONLY set to `true` during debugging]
   */
  allowUnlimitedContractSize?: boolean

  /**
   * Select hardfork based upon block number. This automatically switches to the right hard fork based upon the block number.
   *
   * Default: `false`
   */
  hardforkByBlockNumber?: boolean
  /**
   * Select the HF by total difficulty (Merge HF)
   *
   * This option is a superset of `hardforkByBlockNumber` (so only use one of both options)
   * and determines the HF by both the block number and the TD.
   *
   * Since the TD is only a threshold the block number will in doubt take precedence (imagine
   * e.g. both Merge and Shanghai HF blocks set and the block number from the block provided
   * pointing to a Shanghai block: this will lead to set the HF as Shanghai and not the Merge).
   */
  hardforkByTD?: BNLike

  /**
   * Override or add custom opcodes to the VM instruction set
   * These custom opcodes are EIP-agnostic and are always statically added
   * To delete an opcode, add an entry of format `{opcode: number}`. This will delete that opcode from the VM.
   * If this opcode is then used in the VM, the `INVALID` opcode would instead be used.
   * To add an opcode, add an entry of the following format:
   * {
   *    // The opcode number which will invoke the custom opcode logic
   *    opcode: number
   *    // The name of the opcode (as seen in the `step` event)
   *    opcodeName: string
   *    // The base fee of the opcode
   *    baseFee: number
   *    // If the opcode charges dynamic gas, add this here. To charge the gas, use the `i` methods of the BN, to update the charged gas
   *    gasFunction?: function(runState: RunState, gas: BN, common: Common)
   *    // The logic of the opcode which holds the logic of changing the current state
   *    logicFunction: function(runState: RunState)
   * }
   * Note: gasFunction and logicFunction can both be async or synchronous functions
   */

  customOpcodes?: CustomOpcode[]
}

/**
 * Execution engine which can be used to run a blockchain, individual
 * blocks, individual transactions, or snippets of EVM bytecode.
 *
 * This class is an AsyncEventEmitter, please consult the README to learn how to use it.
 */
export default class VM extends AsyncEventEmitter {
  /**
   * The StateManager used by the VM
   */
  readonly stateManager: StateManager
  /**
   * The blockchain the VM operates on
   */
  readonly blockchain: Blockchain

  readonly _common: Common

  protected readonly _opts: VMOpts
  protected _isInitialized: boolean = false
  protected readonly _allowUnlimitedContractSize: boolean
  // This opcode data is always set since `getActiveOpcodes()` is called in the constructor
  protected _opcodes!: OpcodeList
  protected _handlers!: Map<number, OpHandler>
  protected _dynamicGasHandlers!: Map<number, AsyncDynamicGasHandler | SyncDynamicGasHandler>

  protected readonly _hardforkByBlockNumber: boolean
  protected readonly _hardforkByTD?: BNLike
  protected readonly _customOpcodes?: CustomOpcode[]

  /**
   * Cached emit() function, not for public usage
   * set to public due to implementation internals
   * @hidden
   */
  public readonly _emit: (topic: string, data: any) => Promise<void>
  /**
   * Pointer to the mcl package, not for public usage
   * set to public due to implementation internals
   * @hidden
   */
  public readonly _mcl: any //

  /**
   * VM is run in DEBUG mode (default: false)
   * Taken from DEBUG environment variable
   *
   * Safeguards on debug() calls are added for
   * performance reasons to avoid string literal evaluation
   * @hidden
   */
  protected readonly DEBUG: boolean = false

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
   * Instantiates a new {@link VM} Object.
   * @param opts
   */
  constructor(opts: VMOpts = {}) {
    super()

    this._opts = opts
    this._customOpcodes = opts.customOpcodes

    // Throw on chain or hardfork options removed in latest major release
    // to prevent implicit chain setup on a wrong chain
    if ('chain' in opts || 'hardfork' in opts) {
      throw new Error('Chain/hardfork options are not allowed any more on initialization')
    }

    if (opts.common) {
      // Supported EIPs
      const supportedEIPs = [
        1559, 2315, 2537, 2565, 2718, 2929, 2930, 3198, 3529, 3540, 3541, 3607, 3670, 3855, 3860,
        4399,
      ]
      for (const eip of opts.common.eips()) {
        if (!supportedEIPs.includes(eip)) {
          throw new Error(`EIP-${eip} is not supported by the VM`)
        }
      }
      this._common = opts.common
    } else {
      const DEFAULT_CHAIN = Chain.Mainnet
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
        'london',
        'arrowGlacier',
        'preMerge',
        'merge',
      ]
      this._common = new Common({
        chain: DEFAULT_CHAIN,
        supportedHardforks,
      })
    }
    this._common.on('hardforkChanged', () => {
      this.getActiveOpcodes()
    })

    // Initialize the opcode data
    this.getActiveOpcodes()

    if (opts.stateManager) {
      this.stateManager = opts.stateManager
    } else {
      const trie = opts.state ?? new Trie()
      this.stateManager = new DefaultStateManager({
        trie,
        common: this._common,
      })
    }

    this.blockchain = opts.blockchain ?? new Blockchain({ common: this._common })

    this._allowUnlimitedContractSize = opts.allowUnlimitedContractSize ?? false

    if (opts.hardforkByBlockNumber !== undefined && opts.hardforkByTD !== undefined) {
      throw new Error(
        `The hardforkByBlockNumber and hardforkByTD options can't be used in conjunction`
      )
    }

    this._hardforkByBlockNumber = opts.hardforkByBlockNumber ?? false
    this._hardforkByTD = opts.hardforkByTD

    if (this._common.isActivatedEIP(2537)) {
      if (isBrowser()) {
        throw new Error('EIP-2537 is currently not supported in browsers')
      } else {
        this._mcl = mcl
      }
    }

    // Safeguard if "process" is not available (browser)
    if (process !== undefined && process.env.DEBUG) {
      this.DEBUG = true
    }

    // We cache this promisified function as it's called from the main execution loop, and
    // promisifying each time has a huge performance impact.
    this._emit = promisify(this.emit.bind(this))
  }

  async init(): Promise<void> {
    if (this._isInitialized) {
      return
    }

    await this.blockchain.initPromise

    if (!this._opts.stateManager) {
      if (this._opts.activateGenesisState) {
        await this.stateManager.generateCanonicalGenesis()
      }

      if (this._opts.activatePrecompiles) {
        await this.stateManager.checkpoint()
        // put 1 wei in each of the precompiles in order to make the accounts non-empty and thus not have them deduct `callNewAccount` gas.
        await Promise.all(
          Object.keys(precompiles)
            .map((k: string): Address => new Address(Buffer.from(k, 'hex')))
            .map(async (address: Address) => {
              const account = Account.fromAccountData({ balance: 1 })
              await this.stateManager.putAccount(address, account)
            })
        )
        await this.stateManager.commit()
      }
    }

    if (this._common.isActivatedEIP(2537)) {
      if (isBrowser()) {
        throw new Error('EIP-2537 is currently not supported in browsers')
      } else {
        const mcl = this._mcl
        await mclInitPromise // ensure that mcl is initialized.
        mcl.setMapToMode(mcl.IRTF) // set the right map mode; otherwise mapToG2 will return wrong values.
        mcl.verifyOrderG1(1) // subgroup checks for G1
        mcl.verifyOrderG2(1) // subgroup checks for G2
      }
    }
    this._isInitialized = true
  }

  /**
   * Processes blocks and adds them to the blockchain.
   *
   * This method modifies the state.
   *
   * @param blockchain -  A {@link Blockchain} object to process
   */
  async runBlockchain(blockchain?: Blockchain, maxBlocks?: number): Promise<void | number> {
    await this.init()
    return runBlockchain.bind(this)(blockchain, maxBlocks)
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
   * Build a block on top of the current state
   * by adding one transaction at a time.
   *
   * Creates a checkpoint on the StateManager and modifies the state
   * as transactions are run. The checkpoint is committed on {@link BlockBuilder.build}
   * or discarded with {@link BlockBuilder.revert}.
   *
   * @param {BuildBlockOpts} opts
   * @returns An instance of {@link BlockBuilder} with methods:
   * - {@link BlockBuilder.addTransaction}
   * - {@link BlockBuilder.build}
   * - {@link BlockBuilder.revert}
   */
  async buildBlock(opts: BuildBlockOpts): Promise<BlockBuilder> {
    await this.init()
    return buildBlock.bind(this)(opts)
  }

  /**
   * Returns a list with the currently activated opcodes
   * available for VM execution
   */
  getActiveOpcodes(): OpcodeList {
    const data = getOpcodesForHF(this._common, this._customOpcodes)
    this._opcodes = data.opcodes
    this._dynamicGasHandlers = data.dynamicGasHandlers
    this._handlers = data.handlers
    return data.opcodes
  }

  /**
   * Returns a copy of the {@link VM} instance.
   */
  copy(): VM {
    return new VM({
      stateManager: this.stateManager.copy(),
      blockchain: this.blockchain.copy(),
      common: this._common.copy(),
    })
  }

  /**
   * Return a compact error string representation of the object
   */
  errorStr() {
    let hf = ''
    try {
      hf = this._common.hardfork()
    } catch (e: any) {
      hf = 'error'
    }
    const errorStr = `vm hf=${hf}`
    return errorStr
  }
}
