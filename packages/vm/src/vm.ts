import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common } from '@ethereumjs/common'
import { EVM, getActivePrecompiles } from '@ethereumjs/evm'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Account, Address, AsyncEventEmitter, unprefixedHexToBytes } from '@ethereumjs/util'

import { buildBlock } from './buildBlock.js'
import { runBlock } from './runBlock.js'
import { runTx } from './runTx.js'

import type { BlockBuilder } from './buildBlock.js'
import type {
  BuildBlockOpts,
  RunBlockOpts,
  RunBlockResult,
  RunTxOpts,
  RunTxResult,
  VMEvents,
  VMOpts,
} from './types.js'
import type { BlockchainInterface } from '@ethereumjs/blockchain'
import type { EVMStateManagerInterface } from '@ethereumjs/common'
import type { EVMInterface, EVMPerformanceLogOutput } from '@ethereumjs/evm'
import type { BigIntLike } from '@ethereumjs/util'

/**
 * Execution engine which can be used to run a blockchain, individual
 * blocks, individual transactions, or snippets of EVM bytecode.
 *
 * This class is an AsyncEventEmitter, please consult the README to learn how to use it.
 */
export class VM {
  /**
   * The StateManager used by the VM
   */
  readonly stateManager: EVMStateManagerInterface

  /**
   * The blockchain the VM operates on
   */
  readonly blockchain: BlockchainInterface

  readonly common: Common

  readonly events: AsyncEventEmitter<VMEvents>
  /**
   * The EVM used for bytecode execution
   */
  readonly evm: EVMInterface

  protected readonly _opts: VMOpts
  protected _isInitialized: boolean = false

  protected readonly _setHardfork: boolean | BigIntLike

  /**
   * Cached emit() function, not for public usage
   * set to public due to implementation internals
   * @hidden
   */
  public _emit(topic: keyof VMEvents, data: any): Promise<void> {
    return new Promise((resolve) => this.events.emit(topic, data, resolve))
  }

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
    // Save if a `StateManager` was passed (for activatePrecompiles)
    const didPassStateManager = opts.stateManager !== undefined

    // Add common, SM, blockchain, EVM here
    if (opts.common === undefined) {
      opts.common = new Common({ chain: Chain.Mainnet })
    }

    if (opts.stateManager === undefined) {
      opts.stateManager = new DefaultStateManager({ common: opts.common })
    }

    if (opts.blockchain === undefined) {
      opts.blockchain = await Blockchain.create({ common: opts.common })
    }

    const genesisState = opts.genesisState ?? {}
    if (opts.genesisState !== undefined) {
      await opts.stateManager.generateCanonicalGenesis(genesisState)
    }

    if (opts.profilerOpts !== undefined) {
      const profilerOpts = opts.profilerOpts
      if (profilerOpts.reportAfterBlock === true && profilerOpts.reportAfterTx === true) {
        throw new Error(
          'Cannot have `reportProfilerAfterBlock` and `reportProfilerAfterTx` set to `true` at the same time'
        )
      }
    }

    if (opts.evm !== undefined && opts.evmOpts !== undefined) {
      throw new Error('the evm and evmOpts options cannot be used in conjunction')
    }

    if (opts.evm === undefined) {
      let enableProfiler = false
      if (
        opts.profilerOpts?.reportAfterBlock === true ||
        opts.profilerOpts?.reportAfterTx === true
      ) {
        enableProfiler = true
      }
      const evmOpts = opts.evmOpts ?? {}
      opts.evm = await EVM.create({
        common: opts.common,
        stateManager: opts.stateManager,
        blockchain: opts.blockchain,
        profiler: {
          enabled: enableProfiler,
        },
        ...evmOpts,
      })
    }

    if (opts.activatePrecompiles === true && !didPassStateManager) {
      await opts.evm.journal.checkpoint()
      // put 1 wei in each of the precompiles in order to make the accounts non-empty and thus not have them deduct `callNewAccount` gas.
      for (const [addressStr] of getActivePrecompiles(opts.common)) {
        const address = new Address(unprefixedHexToBytes(addressStr))
        let account = await opts.evm.stateManager.getAccount(address)
        // Only do this if it is not overridden in genesis
        // Note: in the case that custom genesis has storage fields, this is preserved
        if (account === undefined) {
          account = new Account()
          const newAccount = Account.fromAccountData({
            balance: 1,
            storageRoot: account.storageRoot,
          })
          await opts.evm.stateManager.putAccount(address, newAccount)
        }
      }
      await opts.evm.journal.commit()
    }

    return new VM(opts)
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
    this.common = opts.common!
    this.stateManager = opts.stateManager!
    this.blockchain = opts.blockchain!
    this.evm = opts.evm!

    this.events = new AsyncEventEmitter<VMEvents>()

    this._opts = opts

    this._setHardfork = opts.setHardfork ?? false

    // Skip DEBUG calls unless 'ethjs' included in environmental DEBUG variables
    // Additional window check is to prevent vite browser bundling (and potentially other) to break
    this.DEBUG =
      typeof window === 'undefined' ? process?.env?.DEBUG?.includes('ethjs') ?? false : false
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
   *
   * Note that the returned copy will share the same db as the original for the blockchain and the statemanager.
   *
   * Associated caches will be deleted and caches will be re-initialized for a more short-term focused
   * usage, being less memory intense (the statemanager caches will switch to using an ORDERED_MAP cache
   * datastructure more suitable for short-term usage, the trie node LRU cache will not be activated at all).
   * To fine-tune this behavior (if the shallow-copy-returned object has a longer life span e.g.) you can set
   * the `downlevelCaches` option to `false`.
   *
   * @param downlevelCaches Downlevel (so: adopted for short-term usage) associated state caches (default: true)
   */
  async shallowCopy(downlevelCaches = true): Promise<VM> {
    const common = this.common.copy()
    common.setHardfork(this.common.hardfork())
    const blockchain = this.blockchain.shallowCopy()
    const stateManager = this.stateManager.shallowCopy(downlevelCaches)
    const evmOpts = {
      ...(this.evm as any)._optsCached,
      common: this._opts.evmOpts?.common?.copy() ?? common,
      blockchain: this._opts.evmOpts?.blockchain?.shallowCopy() ?? blockchain,
      stateManager: this._opts.evmOpts?.stateManager?.shallowCopy(downlevelCaches) ?? stateManager,
    }
    const evmCopy = await EVM.create(evmOpts) // TODO fixme (should copy the EVMInterface, not default EVM)
    return VM.create({
      stateManager,
      blockchain: this.blockchain,
      common,
      evm: evmCopy,
      setHardfork: this._setHardfork,
      profilerOpts: this._opts.profilerOpts,
    })
  }

  /**
   * Return a compact error string representation of the object
   */
  errorStr() {
    let hf = ''
    try {
      hf = this.common.hardfork()
    } catch (e: any) {
      hf = 'error'
    }
    const errorStr = `vm hf=${hf}`
    return errorStr
  }

  /**
   * Emit EVM profile logs
   * @param logs
   * @param profileTitle
   * @hidden
   */
  emitEVMProfile(logs: EVMPerformanceLogOutput[], profileTitle: string) {
    if (logs.length === 0) {
      return
    }

    // Track total calls / time (ms) / gas

    let calls = 0
    let totalMs = 0
    let totalGas = 0

    // Order of columns to report (see `EVMPerformanceLogOutput` type)

    const colOrder: (keyof EVMPerformanceLogOutput)[] = [
      'tag',
      'calls',
      'avgTimePerCall',
      'totalTime',
      'staticGasUsed',
      'dynamicGasUsed',
      'gasUsed',
      'staticGas',
      'millionGasPerSecond',
      'blocksPerSlot',
    ]

    // The name of this column to report (saves space)
    const colNames = [
      'tag',
      'calls',
      'ms/call',
      'total (ms)',
      'sgas',
      'dgas',
      'total (s+d)',
      'static fee',
      'Mgas/s',
      'BpS',
    ]

    // Special padStr method which inserts whitespace left and right
    // This ensures that there is at least one whitespace between the columns (denoted by pipe `|` chars)
    function padStr(str: string | number, leftpad: number) {
      return ' ' + str.toString().padStart(leftpad, ' ') + ' '
    }
    // Returns the string length of this column. Used to calculate how big the header / footer should be
    function strLen(str: string | number) {
      return padStr(str, 0).length - 2
    }

    // Step one: calculate the length of each colum
    const colLength: number[] = []

    for (const entry of logs) {
      let ins = 0
      colLength[ins] = Math.max(colLength[ins] ?? 0, strLen(colNames[ins]))
      for (const key of colOrder) {
        if (entry[key] !== undefined) {
          // If entry is available, max out the current column length (this will be the longest string of this column)
          colLength[ins] = Math.max(colLength[ins] ?? 0, strLen(entry[key]!))
          ins++
          // In this switch statement update the total calls / time / gas used
          switch (key) {
            case 'calls':
              calls += entry[key]
              break
            case 'totalTime':
              totalMs += entry[key]
              break
            case 'gasUsed':
              totalGas += entry[key]
              break
          }
        }
      }
    }

    // Ensure that the column names also fit on the column length
    for (const i in colLength) {
      colLength[i] = Math.max(colLength[i] ?? 0, strLen(colNames[i]))
    }

    // Calculate the total header length
    // This is done by summing all columns together, plus adding three extra chars per column (two whitespace, one pipe)
    // Remove the final pipe character since this is included in the header string (so subtract one)
    const headerLength = colLength.reduce((pv, cv) => pv + cv, 0) + colLength.length * 3 - 1

    const blockGasLimit = 30_000_000 // Block gas limit
    const slotTime = 12000 // Time in milliseconds (!) per slot

    // Normalize constant to check if execution time is above one block per slot (>=1) or not (<1)
    const bpsNormalizer = blockGasLimit / slotTime

    const avgGas = totalGas / totalMs // Gas per millisecond
    const mGasSAvg = Math.round(avgGas) / 1e3
    const bpSAvg = Math.round((avgGas / bpsNormalizer) * 1e3) / 1e3

    // Write the profile title
    // eslint-disable-next-line
    console.log('+== ' + profileTitle + ' ==+')
    // Write the summary of this profile
    // eslint-disable-next-line
    console.log(
      `+== Calls: ${calls}, Total time: ${
        Math.round(totalMs * 1e3) / 1e3
      }ms, Total gas: ${totalGas}, MGas/s: ${mGasSAvg}, Blocks per Slot (BpS): ${bpSAvg} ==+`
    )

    // Generate and write the header
    const header = '|' + '-'.repeat(headerLength) + '|'
    // eslint-disable-next-line
    console.log(header)

    // Write the columns
    let str = ''
    for (const i in colLength) {
      str += '|' + padStr(colNames[i], colLength[i])
    }
    str += '|'

    // eslint-disable-next-line
    console.log(str)

    // Write each profile entry
    for (const entry of logs) {
      let str = ''
      let i = 0
      for (const key of colOrder) {
        if (entry[key] !== undefined) {
          str += '|' + padStr(entry[key]!, colLength[i])
          i++
        }
      }
      str += '|'
      // eslint-disable-next-line
      console.log(str)
    }

    // Finally, write the footer
    const footer = '+' + '-'.repeat(headerLength) + '+'
    // eslint-disable-next-line
    console.log(footer)
  }
}
