import { Account, Address, toType, TypeOutput } from '@ethereumjs/util'
import Blockchain from '@ethereumjs/blockchain'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { StateManager, DefaultStateManager } from '@ethereumjs/statemanager'
import { default as runTx } from './runTx'
import { default as runBlock } from './runBlock'
import { default as buildBlock, BlockBuilder } from './buildBlock'
import { RunTxOpts, RunTxResult, RunBlockOpts, RunBlockResult } from './types'
import AsyncEventEmitter = require('async-eventemitter')
import { promisify } from 'util'
import { VMEvents, VMOpts, BuildBlockOpts } from './types'

import EVM, { getActivePrecompiles, EEIInterface, EVMInterface } from '@ethereumjs/evm'
import EEI from './eei/eei'

/**
 * Execution engine which can be used to run a blockchain, individual
 * blocks, individual transactions, or snippets of EVM bytecode.
 *
 * This class is an AsyncEventEmitter, please consult the README to learn how to use it.
 */
export class VM extends AsyncEventEmitter<VMEvents> {
  /**
   * The StateManager used by the VM
   */
  readonly stateManager: StateManager

  /**
   * The blockchain the VM operates on
   */
  readonly blockchain: Blockchain

  readonly _common: Common

  /**
   * The EVM used for bytecode execution
   */
  readonly evm: EVMInterface
  readonly eei: EEIInterface

  protected readonly _opts: VMOpts
  protected _isInitialized: boolean = false

  protected readonly _hardforkByBlockNumber: boolean
  protected readonly _hardforkByTD?: bigint

  /**
   * Cached emit() function, not for public usage
   * set to public due to implementation internals
   * @hidden
   */
  public readonly _emit: (topic: string, data: any) => Promise<void>

  /**
   * VM is run in DEBUG mode (default: false)
   * Taken from DEBUG environment variable
   *
   * Safeguards on debug() calls are added for
   * performance reasons to avoid string literal evaluation
   * @hidden
   */
  readonly DEBUG: boolean = false

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
   *
   * @deprecated The direct usage of this constructor is discouraged since
   * non-finalized async initialization might lead to side effects. Please
   * use the async {@link VM.create} constructor instead (same API).
   * @param opts
   */
  protected constructor(opts: VMOpts = {}) {
    super()

    this._opts = opts

    if (opts.common) {
      // Supported EIPs
      const supportedEIPs = [
        1153, 1559, 2315, 2537, 2565, 2718, 2929, 2930, 3074, 3198, 3529, 3540, 3541, 3607, 3651,
        3670, 3855, 3860, 4399,
      ]
      for (const eip of opts.common.eips()) {
        if (!supportedEIPs.includes(eip)) {
          throw new Error(`EIP-${eip} is not supported by the VM`)
        }
      }
      this._common = opts.common
    } else {
      const DEFAULT_CHAIN = Chain.Mainnet
      this._common = new Common({ chain: DEFAULT_CHAIN })
    }

    const supportedHardforks = [
      Hardfork.Chainstart,
      Hardfork.Homestead,
      Hardfork.Dao,
      Hardfork.TangerineWhistle,
      Hardfork.SpuriousDragon,
      Hardfork.Byzantium,
      Hardfork.Constantinople,
      Hardfork.Petersburg,
      Hardfork.Istanbul,
      Hardfork.MuirGlacier,
      Hardfork.Berlin,
      Hardfork.London,
      Hardfork.ArrowGlacier,
      Hardfork.MergeForkIdTransition,
      Hardfork.Merge,
    ]
    if (!supportedHardforks.includes(this._common.hardfork() as Hardfork)) {
      throw new Error(
        `Hardfork ${this._common.hardfork()} not set as supported in supportedHardforks`
      )
    }

    if (opts.stateManager) {
      this.stateManager = opts.stateManager
    } else {
      this.stateManager = new DefaultStateManager({
        common: this._common,
      })
    }

    this.blockchain = opts.blockchain ?? new (Blockchain as any)({ common: this._common })

    // TODO tests
    if (opts.eei) {
      this.eei = opts.eei
    } else {
      this.eei = new EEI(this.stateManager, this._common, this.blockchain)
    }

    // TODO tests
    if (opts.evm) {
      this.evm = opts.evm
    } else {
      this.evm = new EVM({
        common: this._common,
        eei: this.eei,
      })
    }

    if (opts.hardforkByBlockNumber !== undefined && opts.hardforkByTD !== undefined) {
      throw new Error(
        `The hardforkByBlockNumber and hardforkByTD options can't be used in conjunction`
      )
    }

    this._hardforkByBlockNumber = opts.hardforkByBlockNumber ?? false
    this._hardforkByTD = toType(opts.hardforkByTD, TypeOutput.BigInt)

    // Safeguard if "process" is not available (browser)
    if (process !== undefined && process.env.DEBUG) {
      this.DEBUG = true
    }

    // We cache this promisified function as it's called from the main execution loop, and
    // promisifying each time has a huge performance impact.
    this._emit = <(topic: string, data: any) => Promise<void>>promisify(this.emit.bind(this))
  }

  async init(): Promise<void> {
    if (this._isInitialized) return
    await (this.blockchain as any)._init()

    if (!this._opts.stateManager) {
      if (this._opts.activateGenesisState) {
        await this.eei.state.generateCanonicalGenesis(this.blockchain.genesisState())
      }
    }

    if (this._opts.activatePrecompiles && !this._opts.stateManager) {
      await this.eei.state.checkpoint()
      // put 1 wei in each of the precompiles in order to make the accounts non-empty and thus not have them deduct `callNewAccount` gas.
      for (const [addressStr] of getActivePrecompiles(this._common)) {
        const address = new Address(Buffer.from(addressStr, 'hex'))
        const account = await this.eei.state.getAccount(address)
        // Only do this if it is not overridden in genesis
        // Note: in the case that custom genesis has storage fields, this is preserved
        if (account.isEmpty()) {
          const newAccount = Account.fromAccountData({ balance: 1, stateRoot: account.stateRoot })
          await this.eei.state.putAccount(address, newAccount)
        }
      }
      await this.eei.state.commit()
    }
    this._isInitialized = true
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
    return runTx.bind(this)(opts)
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
    return buildBlock.bind(this)(opts)
  }

  /**
   * Returns a copy of the {@link VM} instance.
   */
  async copy(): Promise<VM> {
    const stateCopy = this.stateManager.copy()
    const blockchainCopy = this.blockchain.copy()
    const commonCopy = this._common.copy()

    // Instantiate a new EEI and EVM using the copies of state, blockchain, and common
    // rather than deep copying the original ones since the copy of the `StateManager`
    // inside the EVM and EEI will be different than the `VM` level copy otherwise
    const eeiCopy = new EEI(stateCopy, commonCopy, blockchainCopy)
    const evmCopy = new EVM({ eei: eeiCopy, common: commonCopy })
    return VM.create({
      stateManager: stateCopy,
      blockchain: blockchainCopy,
      common: commonCopy,
      evm: evmCopy,
      eei: eeiCopy,
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
