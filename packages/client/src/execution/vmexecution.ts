import {
  DBSaveLookups,
  DBSetBlockOrHeader,
  DBSetHashToNumber,
  DBSetTD,
} from '@ethereumjs/blockchain'
import { ConsensusType, Hardfork } from '@ethereumjs/common'
import { MCLBLS, RustBN254 } from '@ethereumjs/evm'
import { getGenesis } from '@ethereumjs/genesis'
import { createMPT } from '@ethereumjs/mpt'
import { CacheType, Caches, MerkleStateManager } from '@ethereumjs/statemanager'
import {
  BIGINT_0,
  BIGINT_1,
  EthereumJSErrorWithoutCode,
  Lock,
  ValueEncoding,
  bytesToHex,
  equalsBytes,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runBlock, runTx } from '@ethereumjs/vm'
import * as mcl from 'mcl-wasm'
import { initRustBN } from 'rustbn-wasm'

import { Event } from '../types.ts'
import { debugCodeReplayBlock } from '../util/debug.ts'
import { short } from '../util/index.ts'

import { Execution } from './execution.ts'
import { LevelDB } from './level.ts'
import { PreimagesManager } from './preimage.ts'
import { ReceiptsManager } from './receipt.ts'
import { IndexOperation, IndexType, TxIndex } from './txIndex.ts'

import type { Block } from '@ethereumjs/block'
import type { PrefixedHexString } from '@ethereumjs/util'
import type { RunBlockOpts, TxReceipt, VM } from '@ethereumjs/vm'
import type { ExecutionOptions } from './execution.ts'

export type ExecStatus = (typeof ExecStatus)[keyof typeof ExecStatus]

export const ExecStatus = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  IGNORE_INVALID: 'IGNORE_INVALID',
} as const

type ChainStatus = {
  height: bigint
  status: ExecStatus
  hash: Uint8Array
  root: Uint8Array
}

export class VMExecution extends Execution {
  private _lock = new Lock()

  public vm!: VM
  public merkleVM: VM | undefined
  public hardfork: string = ''
  /* Whether canonical chain execution has stayed valid or ran into an invalid block */
  public chainStatus: ChainStatus | null = null

  public receiptsManager?: ReceiptsManager
  public preimagesManager?: PreimagesManager
  public txIndex?: TxIndex
  private pendingReceipts?: Map<string, TxReceipt[]>
  private vmPromise?: Promise<number | null>

  /** Maximally tolerated block time before giving a warning on console */
  private MAX_TOLERATED_BLOCK_TIME = 12

  /**
   * Interval for client execution stats output (in ms)
   * for debug log level
   *
   */
  private STATS_INTERVAL = 1000 * 90 // 90 seconds

  private _statsInterval: NodeJS.Timeout | undefined /* global NodeJS */
  private _statsVM: VM | undefined

  /**
   * Run a function after acquiring a lock. It is implied that we have already
   * initialized the module (or we are calling this from the init function, like
   * `_setCanonicalGenesisBlock`)
   * @param action - function to run after acquiring a lock
   * @hidden
   */
  private async runWithLock<T>(action: () => Promise<T>): Promise<T> {
    try {
      await this._lock.acquire()
      const value = await action()
      return value
    } finally {
      this._lock.release()
    }
  }

  /**
   * Create new VM execution module
   */
  constructor(options: ExecutionOptions) {
    super(options)

    if (this.config.vm !== undefined) {
      this.vm = this.config.vm
      // @ts-expect-error -- Assigning to read-only property
      this.vm.blockchain = this.chain.blockchain
    }

    if (this.metaDB) {
      this.txIndex = new TxIndex({
        metaDB: this.metaDB,
        chain: this.chain,
        config: this.config,
      })
      if (this.config.saveReceipts) {
        this.receiptsManager = new ReceiptsManager({
          chain: this.chain,
          config: this.config,
          metaDB: this.metaDB,
        })
        this.pendingReceipts = new Map()
        this.chain.blockchain.events.addListener(
          'deletedCanonicalBlocks',
          async (blocks, resolve) => {
            // Once a block gets deleted from the chain, delete the receipts also
            for (const block of blocks) {
              await this.receiptsManager?.deleteReceipts(block)
              void this.txIndex?.updateIndex(IndexOperation.Delete, IndexType.TxHash, block)
            }
            if (resolve !== undefined) {
              resolve()
            }
          },
        )
      }
      if (this.config.savePreimages) {
        this.preimagesManager = new PreimagesManager({
          chain: this.chain,
          config: this.config,
          metaDB: this.metaDB,
        })
      }
    }
  }

  async setupMerkleVM() {
    if (this.merkleVM !== undefined) {
      return
    }
    const trie = await createMPT({
      db: new LevelDB(this.stateDB),
      useKeyHashing: true,
      common: this.config.chainCommon,
      cacheSize: this.config.trieCache,
      valueEncoding: this.config.useStringValueTrieDB ? ValueEncoding.String : ValueEncoding.Bytes,
    })

    this.config.logger?.info(`Setting up merkleVM`)
    this.config.logger?.info(`Initializing account cache size=${this.config.accountCache}`)
    this.config.logger?.info(`Initializing storage cache size=${this.config.storageCache}`)
    this.config.logger?.info(`Initializing code cache size=${this.config.codeCache}`)
    this.config.logger?.info(`Initializing trie cache size=${this.config.trieCache}`)

    const stateManager = new MerkleStateManager({
      trie,
      prefixStorageTrieKeys: this.config.prefixStorageTrieKeys,
      caches: new Caches({
        account: {
          type: CacheType.LRU,
          size: this.config.accountCache,
        },
        storage: {
          type: CacheType.LRU,
          size: this.config.storageCache,
        },
        code: {
          type: CacheType.LRU,
          size: this.config.codeCache,
        },
      }),
      common: this.config.chainCommon,
    })

    await mcl.init(mcl.BLS12_381)
    const rustBN = await initRustBN()
    this.merkleVM = await createVM({
      common: this.config.execCommon,
      blockchain: this.chain.blockchain,
      stateManager,
      evmOpts: {
        bls: new MCLBLS(mcl),
        bn254: new RustBN254(rustBN),
      },
      profilerOpts: this.config.vmProfilerOpts,
    })
    this.vm = this.merkleVM
  }

  /**
   * Initializes VM execution. Must be called before run() is called
   */
  async open(): Promise<void> {
    return this.runWithLock<void>(async () => {
      // if already opened or stopping midway
      if (this.started || this.vmPromise !== undefined) {
        return
      }

      const blockchain = this.chain.blockchain
      if (typeof blockchain.getIteratorHead !== 'function') {
        throw EthereumJSErrorWithoutCode(
          'cannot get iterator head: blockchain has no getIteratorHead function',
        )
      }
      const headBlock = await blockchain.getIteratorHead()
      const { number, timestamp, stateRoot } = headBlock.header
      this.chainStatus = {
        height: number,
        status: ExecStatus.VALID,
        root: stateRoot,
        hash: headBlock.hash(),
      }

      if (typeof blockchain.getTotalDifficulty !== 'function') {
        throw EthereumJSErrorWithoutCode(
          'cannot get iterator head: blockchain has no getTotalDifficulty function',
        )
      }
      this.config.execCommon.setHardforkBy({ blockNumber: number, timestamp })
      this.hardfork = this.config.execCommon.hardfork()

      this.config.logger?.info(
        `Initializing VM merkle statemanager genesis hardfork=${this.hardfork}`,
      )
      await this.setupMerkleVM()
      this.vm = this.merkleVM!

      if (number === BIGINT_0) {
        const genesisState =
          this.chain['_customGenesisState'] ?? getGenesis(Number(blockchain.common.chainId()))
        if (!genesisState && !('generateCanonicalGenesis' in this.vm.stateManager)) {
          throw EthereumJSErrorWithoutCode('genesisState not available')
        } else {
          await this.vm.stateManager.generateCanonicalGenesis!(genesisState)
        }
      }
      await super.open()
      // TODO: Should a run be started to execute any left over blocks?
      // void this.run()
    })
  }

  /**
   * Reset the execution after the chain has been reset back
   */
  async checkAndReset(headBlock: Block): Promise<void> {
    if (
      this.chainStatus !== null &&
      (headBlock.header.number > this.chainStatus.height ||
        equalsBytes(headBlock.hash(), this.chainStatus?.hash))
    ) {
      return
    }

    const { number, timestamp, stateRoot } = headBlock.header
    this.chainStatus = {
      height: number,
      status: ExecStatus.VALID,
      root: stateRoot,
      hash: headBlock.hash(),
    }

    // there could to be checks here that the resetted head is a parent of the chainStatus
    // but we can skip it for now trusting the chain reset has been correctly performed
    this.hardfork = this.config.execCommon.setHardforkBy({
      blockNumber: number,
      timestamp,
    })

    await this.setupMerkleVM()
    this.vm = this.merkleVM!

    await this.vm.stateManager.setStateRoot(stateRoot)
  }

  /**
   * Executes the block, runs the necessary verification on it,
   * and persists the block and the associate state into the database.
   * The key difference is it won't do the canonical chain updating.
   * It relies on the additional {@link VMExecution.setHead} call to finalize
   * the entire procedure.
   * @param receipts If we built this block, pass the receipts to not need to run the block again
   * @param optional param if runWithoutSetHead should block for execution
   * @param optional param if runWithoutSetHead should skip putting block into chain
   * @returns if the block was executed or not, throws on block execution failure
   */
  async runWithoutSetHead(
    opts: RunBlockOpts & { parentBlock?: Block },
    receipts?: TxReceipt[],
    blocking: boolean = false,
    skipBlockchain: boolean = false,
  ): Promise<boolean> {
    // if its not blocking request then return early if its already running else wait to grab the lock
    if ((!blocking && this.running) || !this.started || this.config.shutdown) return false

    await this.runWithLock<void>(async () => {
      try {
        const vmHeadBlock = await this.chain.blockchain.getIteratorHead()
        await this.checkAndReset(vmHeadBlock)

        // running should be false here because running is always changed inside the lock and switched
        // to false before the lock is released
        this.running = true
        const { block, root } = opts

        if (receipts === undefined) {
          // Check if we need to pass flag to clear statemanager cache or not
          const prevVMStateRoot = await this.vm.stateManager.getStateRoot()
          // If root is not provided its mean to be run on the same set state
          const parentState = root ?? prevVMStateRoot
          const clearCache = !equalsBytes(prevVMStateRoot, parentState)

          const vm = this.vm

          const hasParentStateRoot = await vm.stateManager.hasStateRoot(parentState)
          // we can also return false to say that the block wasn't executed but we should throw
          // because we shouldn't have entered this function if this block wasn't executable
          if (!hasParentStateRoot) {
            throw Error(`Missing parent stateRoot for execution`)
          }

          const skipHeaderValidation = this.chain.headers.height < block.header.number - BIGINT_1
          // Also skip adding this block into blockchain for now
          if (skipHeaderValidation) {
            skipBlockchain = true
          }
          const reportPreimages = this.config.savePreimages

          const result = await runBlock(vm, {
            clearCache,
            ...opts,
            skipHeaderValidation,
            reportPreimages,
          })

          if (this.config.savePreimages && result.preimages !== undefined) {
            await this.savePreimages(result.preimages)
          }
          receipts = result.receipts
        }
        if (receipts !== undefined) {
          // Save receipts
          this.pendingReceipts?.set(bytesToHex(block.hash()), receipts)
        }

        if (!skipBlockchain) {
          // Bypass updating head by using blockchain db directly
          const [hash, num] = [block.hash(), block.header.number]
          const td =
            (await this.chain.getTd(block.header.parentHash, block.header.number - BIGINT_1)) +
            block.header.difficulty

          await this.chain.blockchain.dbManager.batch([
            DBSetTD(td, num, hash),
            ...DBSetBlockOrHeader(block),
            DBSetHashToNumber(hash, num),
            // Skip the op for number to hash to not alter canonical chain
            ...DBSaveLookups(hash, num, true),
          ])
        }
      } finally {
        this.running = false
      }
    })
    return true
  }

  async savePreimages(preimages: Map<PrefixedHexString, Uint8Array>) {
    if (this.preimagesManager !== undefined) {
      for (const [key, preimage] of preimages) {
        await this.preimagesManager.savePreimage(hexToBytes(key), preimage)
      }
    }
  }

  /**
   * Sets the chain to a new head block.
   * Should only be used after {@link VMExecution.runWithoutSetHead}
   * @param blocks Array of blocks to save pending receipts and set the last block as the head
   */
  async setHead(
    blocks: Block[],
    { finalizedBlock, safeBlock }: { finalizedBlock?: Block; safeBlock?: Block } = {},
  ): Promise<boolean> {
    if (!this.started || this.config.shutdown) return false

    return this.runWithLock<boolean>(async () => {
      const vmHeadBlock = blocks[blocks.length - 1]
      const chainPointers: [string, Block][] = [['vmHeadBlock', vmHeadBlock]]

      // instead of checking for the previous roots of safe,finalized, we will contend
      // ourselves with just vmHead because in snap sync we might not have the safe
      // finalized blocks executed
      if (!(await this.vm.stateManager.hasStateRoot(vmHeadBlock.header.stateRoot))) {
        // If we set blockchain iterator to somewhere where we don't have stateroot
        // execution run will always fail
        throw Error(
          `vmHeadBlock's stateRoot not found number=${vmHeadBlock.header.number} root=${short(
            vmHeadBlock.header.stateRoot,
          )}`,
        )
      }

      // skip emitting the chain update event as we will manually do it
      await this.chain.putBlocks(blocks, true, true)
      for (const block of blocks) {
        const receipts = this.pendingReceipts?.get(bytesToHex(block.hash()))
        if (receipts) {
          await this.receiptsManager?.saveReceipts(block, receipts)
          this.pendingReceipts?.delete(bytesToHex(block.hash()))
        }
        if (this.txIndex) {
          void this.txIndex.updateIndex(IndexOperation.Save, IndexType.TxHash, block)
        }
      }

      // check if the head, safe and finalized are now canonical
      for (const [blockName, block] of chainPointers) {
        if (block === null) {
          continue
        }
        const blockByNumber = await this.chain.getBlock(block.header.number)
        if (!equalsBytes(blockByNumber.hash(), block.hash())) {
          throw Error(`${blockName} not in canonical chain`)
        }
      }

      const oldVmHead = await this.chain.blockchain.getIteratorHead()
      await this.checkAndReset(oldVmHead)

      await this.chain.blockchain.setIteratorHead('vm', vmHeadBlock.hash())
      this.chainStatus = {
        height: vmHeadBlock.header.number,
        root: vmHeadBlock.header.stateRoot,
        hash: vmHeadBlock.hash(),
        status: ExecStatus.VALID,
      }

      if (safeBlock !== undefined) {
        await this.chain.blockchain.setIteratorHead('safe', safeBlock.hash())
      }
      if (finalizedBlock !== undefined) {
        await this.chain.blockchain.setIteratorHead('finalized', finalizedBlock.hash())
      }
      await this.chain.update(true)
      return true
    })
  }

  async jumpVmHead(jumpToHash: Uint8Array, jumpToNumber?: bigint): Promise<void> {
    return this.runWithLock<void>(async () => {
      // check if the block is canonical in chain
      this.config.logger?.warn(
        `Setting execution head to hash=${short(jumpToHash)} number=${jumpToNumber}`,
      )
      await this.chain.blockchain.setIteratorHead('vm', jumpToHash)
    })
  }

  /**
   * Runs the VM execution
   * @param loop Whether to continue iterating until vm head equals chain head (default: true)
   * @returns number of blocks executed
   */
  async run(loop = true, runOnlyBatched = false): Promise<number> {
    if (this.running || !this.started || !this.config.execution || this.config.shutdown) return 0

    return this.runWithLock<number>(async () => {
      try {
        // 1. await the run so as to switch this.running to false even in case of errors
        // 2. run inside a lock so as to not be entangle with runWithoutSetHead or setHead
        this.running = true
        let numExecuted: number | null | undefined = undefined

        let startHeadBlock = await this.chain.blockchain.getIteratorHead()
        await this.checkAndReset(startHeadBlock)
        let canonicalHead = await this.chain.blockchain.getCanonicalHeadBlock()

        this.config.logger?.debug(
          `Running execution startHeadBlock=${startHeadBlock?.header.number} canonicalHead=${canonicalHead?.header.number} loop=${loop}`,
        )

        let headBlock: Block | undefined
        let parentState: Uint8Array | undefined
        let errorBlock: Block | undefined

        // flag for vm to clear statemanager cache on runBlock
        //  i) If on start of iterator the last run state is not same as the block's parent
        //  ii) If reorg happens on the block iterator
        let clearCache = false

        while (
          this.started &&
          !this.config.shutdown &&
          (!runOnlyBatched ||
            (runOnlyBatched &&
              canonicalHead.header.number - startHeadBlock.header.number >=
                BigInt(this.config.numBlocksPerIteration))) &&
          (numExecuted === undefined ||
            (loop && numExecuted === this.config.numBlocksPerIteration)) &&
          equalsBytes(startHeadBlock.hash(), canonicalHead.hash()) === false
        ) {
          let txCounter = 0
          headBlock = undefined
          parentState = undefined
          errorBlock = undefined
          this.vmPromise = this.chain.blockchain
            .iterator(
              'vm',
              async (block: Block, reorg: boolean) => {
                // determine starting state for block run
                // if we are just starting or if a chain reorg has happened
                if (headBlock === undefined || reorg) {
                  headBlock = await this.chain.blockchain.getBlock(block.header.parentHash)
                  parentState = headBlock.header.stateRoot

                  if (reorg) {
                    clearCache = true
                    this.config.logger?.info(
                      `VM run: Chain reorged, setting new head to block number=${headBlock.header.number} clearCache=${clearCache}.`,
                    )
                  } else {
                    const prevVMStateRoot = await this.vm.stateManager.getStateRoot()
                    clearCache = !equalsBytes(prevVMStateRoot, parentState)
                  }
                } else {
                  // Continuation of last vm run, no need to clearCache
                  clearCache = false
                }

                // run block, update head if valid
                try {
                  const { number, timestamp } = block.header

                  const hardfork = this.config.execCommon.getHardforkBy({
                    blockNumber: number,
                    timestamp,
                  })
                  if (hardfork !== this.hardfork) {
                    const hash = short(block.hash())
                    this.config.superMsg(
                      `Execution hardfork switch on block number=${number} hash=${hash} old=${this.hardfork} new=${hardfork}`,
                    )
                    this.hardfork = this.config.execCommon.setHardforkBy({
                      blockNumber: number,
                      timestamp,
                    })
                  }

                  let skipBlockValidation = false
                  if (this.config.execCommon.consensusType() === ConsensusType.ProofOfAuthority) {
                    // Block validation is redundant here and leads to consistency problems
                    // on PoA clique along blockchain-including validation checks
                    // (signer states might have moved on when sync is ahead)
                    skipBlockValidation = true
                  }

                  // we are skipping header validation because the block has been picked from the
                  // blockchain and header should have already been validated while putBlock
                  if (!this.started) {
                    throw Error('Execution stopped')
                  }

                  this._statsVM = this.vm
                  const beforeTS = Date.now()
                  const result = await runBlock(this.vm, {
                    block,
                    root: parentState,
                    clearCache,
                    skipBlockValidation,
                    skipHeaderValidation: true,
                    reportPreimages: this.config.savePreimages,
                  })
                  const afterTS = Date.now()
                  const diffSec = Math.round((afterTS - beforeTS) / 1000)

                  if (diffSec > this.MAX_TOLERATED_BLOCK_TIME) {
                    const msg = `Slow block execution for block num=${
                      block.header.number
                    } hash=${bytesToHex(block.hash())} txs=${block.transactions.length} gasUsed=${
                      result.gasUsed
                    } time=${diffSec}secs`
                    this.config.logger?.warn(msg)
                  }

                  await this.receiptsManager?.saveReceipts(block, result.receipts)
                  if (this.txIndex) {
                    void this.txIndex.updateIndex(IndexOperation.Save, IndexType.TxHash, block)
                  }
                  if (this.config.savePreimages && result.preimages !== undefined) {
                    await this.savePreimages(result.preimages)
                  }

                  txCounter += block.transactions.length
                  // set as new head block
                  headBlock = block
                  parentState = block.header.stateRoot
                } catch (error: any) {
                  // only marked the block as invalid if it was an actual execution error
                  // for e.g. absence of executionWitness doesn't make a block invalid
                  if (!`${error.message}`.includes('Invalid executionWitness=null')) {
                    errorBlock = block
                  }
                  throw error
                }
              },
              this.config.numBlocksPerIteration,
              // release lock on this callback so other blockchain ops can happen while this block is being executed
              true,
            )
            // Ensure to catch and not throw as this would lead to unCaughtException with process exit
            .catch(async (error) => {
              if (errorBlock !== undefined) {
                const { number } = errorBlock.header
                const hash = short(errorBlock.hash())
                const errorMsg = `Execution of block number=${number} hash=${hash} hardfork=${this.hardfork} failed`

                // check if the vmHead 's backstepping can resolve this issue, headBlock is parent of the
                // current block which is trying to be executed and should equal current vmHead
                if (
                  `${error}`.toLowerCase().includes('does not contain state root') &&
                  number > BIGINT_1
                ) {
                  // this is a weird case which has been observed, could be because of a forking scenario
                  // or some race condition, but if this happens for now we can try to handle it by
                  // backstepping to the parent. if the parent isn't there, it can recursively go back
                  // to parent's parent and so on...
                  //
                  // There can also be a better way to backstep vm to but lets naively step back
                  let backStepTo,
                    backStepToHash,
                    backStepToRoot,
                    hasParentStateRoot = false
                  if (headBlock !== undefined) {
                    hasParentStateRoot = await this.vm.stateManager.hasStateRoot(
                      headBlock.header.stateRoot,
                    )
                    backStepTo = headBlock.header.number ?? BIGINT_0 - BIGINT_1
                    backStepToHash = headBlock.header.parentHash
                    backStepToRoot = headBlock.header.stateRoot
                  }

                  if (hasParentStateRoot === true && backStepToHash !== undefined) {
                    this.config.logger?.warn(
                      `${errorMsg}, backStepping vmHead to number=${backStepTo} hash=${short(
                        backStepToHash ?? 'na',
                      )} hasParentStateRoot=${short(backStepToRoot ?? 'na')}:\n${error}`,
                    )
                    await this.chain.blockchain.setIteratorHead('vm', backStepToHash)
                  } else {
                    this.config.logger?.error(
                      `${errorMsg}, couldn't back step to vmHead number=${backStepTo} hash=${short(
                        backStepToHash ?? 'na',
                      )} hasParentStateRoot=${hasParentStateRoot} backStepToRoot=${short(
                        backStepToRoot ?? 'na',
                      )}:\n${error}`,
                    )
                  }
                } else {
                  this.chainStatus = {
                    height: errorBlock.header.number,
                    root: errorBlock.header.stateRoot,
                    hash: errorBlock.hash(),
                    status: ExecStatus.INVALID,
                  }

                  this.config.logger?.warn(`${errorMsg}:\n${error}`)
                }

                if (this.config.debugCode) {
                  await debugCodeReplayBlock(this, errorBlock)
                }
                this.config.events.emit(Event.SYNC_EXECUTION_VM_ERROR, error)
                const actualExecuted = Number(
                  errorBlock.header.number - startHeadBlock.header.number,
                )
                return actualExecuted
              } else {
                this.config.logger?.error(`VM execution failed with error`, error)
                return null
              }
            })

          numExecuted = await this.vmPromise
          if (numExecuted !== null) {
            const endHeadBlock = await this.chain.blockchain.getIteratorHead('vm')

            if (typeof numExecuted === 'number' && numExecuted > 0) {
              const firstNumber = startHeadBlock.header.number
              const firstHash = short(startHeadBlock.hash())
              const lastNumber = endHeadBlock.header.number
              const lastHash = short(endHeadBlock.hash())
              const baseFeeAdd = this.config.execCommon.gteHardfork(Hardfork.London)
                ? `baseFee=${endHeadBlock.header.baseFeePerGas} `
                : ''

              const tdAdd = this.config.execCommon.gteHardfork(Hardfork.Paris)
                ? ''
                : `td=${this.chain.blocks.td} `

              const msg = `Executed blocks count=${numExecuted} first=${firstNumber} hash=${firstHash} ${tdAdd}${baseFeeAdd}hardfork=${this.hardfork} last=${lastNumber} hash=${lastHash} txs=${txCounter}`
              if (this.config.execCommon.gteHardfork(Hardfork.Paris)) {
                this.config.logger?.debug(msg)
              } else {
                this.config.logger?.info(msg)
              }

              await this.chain.update(false)
            } else {
              this.config.logger?.debug(
                `No blocks executed past chain head hash=${short(endHeadBlock.hash())} number=${
                  endHeadBlock.header.number
                }`,
              )
            }
            startHeadBlock = endHeadBlock
            canonicalHead = await this.chain.blockchain.getCanonicalHeadBlock()
          }
        }

        return numExecuted ?? 0
      } finally {
        this.running = false
      }
    })
  }

  /**
   * Start execution
   */
  async start(): Promise<boolean> {
    this._statsInterval = setInterval(await this.stats.bind(this), this.STATS_INTERVAL)

    if (this.running || !this.started) {
      return false
    }

    const vmHeadBlock = await this.chain.blockchain.getIteratorHead()
    const canonicalHead = await this.chain.blockchain.getCanonicalHeadBlock()

    const infoStr = `vmHead=${vmHeadBlock.header.number} canonicalHead=${
      canonicalHead.header.number
    } hardfork=${this.config.execCommon.hardfork()} execution=${this.config.execution}`
    if (
      !this.config.execCommon.gteHardfork(Hardfork.Paris) &&
      this.config.execution &&
      vmHeadBlock.header.number < canonicalHead.header.number
    ) {
      this.config.logger?.info(`Starting execution run ${infoStr}`)
      void this.run(true, true)
    } else {
      this.config.logger?.info(`Skipped execution run ${infoStr}`)
    }
    return true
  }

  /**
   * Stop VM execution. Returns a promise that resolves once its stopped.
   */
  async stop(): Promise<boolean> {
    clearInterval(this._statsInterval)
    // Stop with the lock to be concurrency safe and flip started flag so that
    // vmPromise can resolve early
    await this.runWithLock<void>(async () => {
      await super.stop()
    })
    // Resolve this promise outside lock since promise also acquires the lock while
    // running the iterator
    if (this.vmPromise) {
      // ensure that we wait that the VM finishes executing the block (and flushing the trie cache)
      await this.vmPromise
    }
    // Since we don't allow open unless vmPromise is undefined, no opens can happen
    // midway and we can safely close
    await this.runWithLock<void>(async () => {
      this.vmPromise = undefined
      await this.stateDB?.close()
    })
    return true
  }

  /**
   * Execute a range of blocks on a copy of the VM
   * without changing any chain or client state
   *
   * Possible input formats:
   *
   * - Single block, '5'
   * - Range of blocks, '5-10'
   */
  async executeBlocks(first: number, last: number, txHashes: string[]) {
    this.config.logger?.info('Preparing for block execution (debug mode, no services started)...')

    const vm = await this.vm.shallowCopy(false)

    for (let blockNumber = first; blockNumber <= last; blockNumber++) {
      const block = await this.chain.blockchain.getBlock(blockNumber)
      const parentBlock = await this.chain.blockchain.getBlock(block.header.parentHash)
      // Set the correct state root
      const root = parentBlock.header.stateRoot
      vm.common.setHardforkBy({
        blockNumber,
        timestamp: block.header.timestamp,
      })

      if (txHashes.length === 0) {
        this._statsVM = vm

        // we are skipping header validation because the block has been picked from the
        // blockchain and header should have already been validated while putBlock
        const beforeTS = Date.now()
        const res = await runBlock(vm, {
          block,
          root,
          clearCache: false,
          skipHeaderValidation: true,
        })
        const afterTS = Date.now()
        const diffSec = Math.round((afterTS - beforeTS) / 1000)
        const msg = `Executed block num=${blockNumber} hash=${bytesToHex(block.hash())} txs=${
          block.transactions.length
        } gasUsed=${res.gasUsed} time=${diffSec}secs`
        if (diffSec <= this.MAX_TOLERATED_BLOCK_TIME) {
          this.config.logger?.info(msg)
        } else {
          this.config.logger?.warn(msg)
        }
      } else {
        let count = 0
        // Special verbose tx execution mode triggered by BLOCK_NUMBER[*]
        // Useful e.g. to trace slow txs
        const allTxs = txHashes.length === 1 && txHashes[0] === '*' ? true : false
        for (const tx of block.transactions) {
          const txHash = bytesToHex(tx.hash())
          if (allTxs || txHashes.includes(txHash)) {
            const res = await runTx(vm, { block, tx })
            this.config.logger?.info(
              `Executed tx hash=${txHash} gasUsed=${res.totalGasSpent} from block num=${blockNumber}`,
            )
            count += 1
          }
        }
        if (count === 0) {
          if (!allTxs) {
            this.config.logger?.warn(`Block number ${first} contains no txs with provided hashes`)
          } else {
            this.config.logger?.info(`Block has 0 transactions (no execution)`)
          }
        }
      }
    }
  }

  stats() {
    if (this._statsVM instanceof MerkleStateManager) {
      const sm = this._statsVM.stateManager as MerkleStateManager
      const deactivatedStats = { size: 0, reads: 0, hits: 0, writes: 0 }
      let stats
      stats = sm['_caches']?.account?.stats() ?? deactivatedStats
      this.config.logger?.info(
        `Account cache stats size=${stats.size} reads=${stats.reads} hits=${stats.hits} writes=${stats.writes}`,
      )
      stats = sm['_caches']?.storage?.stats() ?? deactivatedStats
      this.config.logger?.info(
        `Storage cache stats size=${stats.size} reads=${stats.reads} hits=${stats.hits} writes=${stats.writes}`,
      )
      stats = sm['_caches']?.code?.stats() ?? deactivatedStats
      this.config.logger?.info(
        `Code cache stats size=${stats.size} reads=${stats.reads} hits=${stats.hits} writes=${stats.writes}`,
      )
      const tStats = sm['_trie'].database().stats()
      this.config.logger?.info(
        `Trie cache stats size=${tStats.size} reads=${tStats.cache.reads} hits=${tStats.cache.hits} ` +
          `writes=${tStats.cache.writes} readsDB=${tStats.db.reads} hitsDB=${tStats.db.hits} writesDB=${tStats.db.writes}`,
      )
    }
  }
}
