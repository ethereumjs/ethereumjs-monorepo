import {
  DBSaveLookups,
  DBSetBlockOrHeader,
  DBSetHashToNumber,
  DBSetTD,
} from '@ethereumjs/blockchain/dist/db/helpers'
import { ConsensusType, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Trie } from '@ethereumjs/trie'
import { bufferToHex } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'

import { Event } from '../types'
import { short } from '../util'
import { debugCodeReplayBlock } from '../util/debug'

import { Execution } from './execution'
import { LevelDB } from './level'
import { ReceiptsManager } from './receipt'

import type { ExecutionOptions } from './execution'
import type { Block } from '@ethereumjs/block'
import type { RunBlockOpts, TxReceipt } from '@ethereumjs/vm'

export class VMExecution extends Execution {
  public vm: VM
  public hardfork: string = ''

  public receiptsManager?: ReceiptsManager
  private pendingReceipts?: Map<string, TxReceipt[]>
  private vmPromise?: Promise<number>

  /** Number of maximum blocks to run per iteration of {@link VMExecution.run} */
  private NUM_BLOCKS_PER_ITERATION = 50

  /**
   * Create new VM execution module
   */
  constructor(options: ExecutionOptions) {
    super(options)

    if (this.config.vm === undefined) {
      const trie = new Trie({
        db: new LevelDB(this.stateDB),
        useKeyHashing: true,
      })

      const stateManager = new DefaultStateManager({
        trie,
      })

      this.vm = new (VM as any)({
        common: this.config.execCommon,
        blockchain: this.chain.blockchain,
        stateManager,
      })
    } else {
      this.vm = this.config.vm
      ;(this.vm as any).blockchain = this.chain.blockchain
    }

    if (this.metaDB && this.config.saveReceipts) {
      this.receiptsManager = new ReceiptsManager({
        chain: this.chain,
        config: this.config,
        metaDB: this.metaDB,
      })
      this.pendingReceipts = new Map()
    }
  }

  /**
   * Initializes VM execution. Must be called before run() is called
   */
  async open(): Promise<void> {
    await this.vm.init()
    if (typeof this.vm.blockchain.getIteratorHead !== 'function') {
      throw new Error('cannot get iterator head: blockchain has no getIteratorHead function')
    }
    const headBlock = await this.vm.blockchain.getIteratorHead()
    const { number } = headBlock.header
    if (typeof this.vm.blockchain.getTotalDifficulty !== 'function') {
      throw new Error('cannot get iterator head: blockchain has no getTotalDifficulty function')
    }
    const td = await this.vm.blockchain.getTotalDifficulty(headBlock.header.hash())
    this.config.execCommon.setHardforkByBlockNumber(number, td)
    this.hardfork = this.config.execCommon.hardfork()
    this.config.logger.info(`Initializing VM execution hardfork=${this.hardfork}`)
    if (number === BigInt(0)) {
      if (typeof this.vm.blockchain.genesisState !== 'function') {
        throw new Error('cannot get iterator head: blockchain has no genesisState function')
      }
      await this.vm.eei.generateCanonicalGenesis(this.vm.blockchain.genesisState())
    }
    // TODO: Should a run be started to execute any left over blocks?
    // void this.run()
  }

  /**
   * Executes the block, runs the necessary verification on it,
   * and persists the block and the associate state into the database.
   * The key difference is it won't do the canonical chain updating.
   * It relies on the additional {@link VMExecution.setHead} call to finalize
   * the entire procedure.
   * @param receipts If we built this block, pass the receipts to not need to run the block again
   */
  async runWithoutSetHead(opts: RunBlockOpts, receipts?: TxReceipt[]): Promise<void> {
    const { block } = opts
    if (receipts === undefined) {
      const result = await this.vm.runBlock(opts)
      receipts = result.receipts
    }
    if (receipts !== undefined) {
      // Save receipts
      this.pendingReceipts?.set(block.hash().toString('hex'), receipts)
    }
    // Bypass updating head by using blockchain db directly
    const [hash, num] = [block.hash(), block.header.number]
    const td =
      (await this.chain.getTd(block.header.parentHash, block.header.number - BigInt(1))) +
      block.header.difficulty

    await this.chain.blockchain.dbManager.batch([
      DBSetTD(td, num, hash),
      ...DBSetBlockOrHeader(block),
      DBSetHashToNumber(hash, num),
      ...DBSaveLookups(hash, num),
    ])
  }

  /**
   * Sets the chain to a new head block.
   * Should only be used after {@link VMExecution.runWithoutSetHead}
   * @param blocks Array of blocks to save pending receipts and set the last block as the head
   */
  async setHead(blocks: Block[]): Promise<void> {
    const vmHeadBlock = blocks[blocks.length - 1]
    if (!(await this.vm.stateManager.hasStateRoot(vmHeadBlock.header.stateRoot))) {
      // If we set blockchain iterator to somewhere where we don't have stateroot
      // execution run will always fail
      throw Error(
        `vmHeadBlock's stateRoot not found number=${vmHeadBlock.header.number} root=${short(
          vmHeadBlock.header.stateRoot
        )}`
      )
    }
    await this.chain.blockchain.setIteratorHead('vm', vmHeadBlock.hash())
    await this.chain.putBlocks(blocks, true)
    for (const block of blocks) {
      const receipts = this.pendingReceipts?.get(block.hash().toString('hex'))
      if (receipts) {
        void this.receiptsManager?.saveReceipts(block, receipts)
        this.pendingReceipts?.delete(block.hash().toString('hex'))
      }
    }
  }

  /**
   * Runs the VM execution
   * @param loop Whether to continue iterating until vm head equals chain head (default: true)
   * @returns number of blocks executed
   */
  async run(loop = true, runOnlybatched = false): Promise<number> {
    if (this.running) return 0
    this.running = true
    let numExecuted: number | undefined

    const { blockchain } = this.vm
    if (typeof blockchain.getIteratorHead !== 'function') {
      throw new Error('cannot get iterator head: blockchain has no getIteratorHead function')
    }
    let startHeadBlock = await blockchain.getIteratorHead()
    if (typeof blockchain.getCanonicalHeadBlock !== 'function') {
      throw new Error('cannot get iterator head: blockchain has no getCanonicalHeadBlock function')
    }
    let canonicalHead = await blockchain.getCanonicalHeadBlock()

    this.config.logger.debug(
      `Running execution startHeadBlock=${startHeadBlock?.header.number} canonicalHead=${canonicalHead?.header.number} loop=${loop}`
    )

    let headBlock: Block | undefined
    let parentState: Buffer | undefined
    let errorBlock: Block | undefined

    while (
      (!runOnlybatched ||
        (runOnlybatched &&
          canonicalHead.header.number - startHeadBlock.header.number >=
            BigInt(this.NUM_BLOCKS_PER_ITERATION))) &&
      (numExecuted === undefined || (loop && numExecuted === this.NUM_BLOCKS_PER_ITERATION)) &&
      startHeadBlock.hash().equals(canonicalHead.hash()) === false
    ) {
      let txCounter = 0
      headBlock = undefined
      parentState = undefined
      errorBlock = undefined
      this.vmPromise = blockchain.iterator(
        'vm',
        async (block: Block, reorg: boolean) => {
          if (errorBlock) return
          // determine starting state for block run
          // if we are just starting or if a chain reorg has happened
          if (!headBlock || reorg) {
            const headBlock = await blockchain.getBlock(block.header.parentHash)
            if (headBlock === null) throw new Error('No parent block found')
            parentState = headBlock.header.stateRoot
          }
          // run block, update head if valid
          try {
            const { number } = block.header
            if (typeof blockchain.getTotalDifficulty !== 'function') {
              throw new Error(
                'cannot get iterator head: blockchain has no getTotalDifficulty function'
              )
            }
            const td = await blockchain.getTotalDifficulty(block.header.parentHash)

            const hardfork = this.config.execCommon.getHardforkByBlockNumber(number, td)
            if (hardfork !== this.hardfork) {
              const hash = short(block.hash())
              this.config.logger.info(
                `Execution hardfork switch on block number=${number} hash=${hash} old=${this.hardfork} new=${hardfork}`
              )
              this.hardfork = this.config.execCommon.setHardforkByBlockNumber(number, td)
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
            const result = await this.vm.runBlock({
              block,
              root: parentState,
              skipBlockValidation,
              skipHeaderValidation: true,
            })
            void this.receiptsManager?.saveReceipts(block, result.receipts)
            txCounter += block.transactions.length
            // set as new head block
            headBlock = block
            parentState = block.header.stateRoot
          } catch (error: any) {
            // TODO: determine if there is a way to differentiate between the cases
            // a) a bad block is served by a bad peer -> delete the block and restart sync
            //    sync from parent block
            // b) there is a consensus error in the VM -> stop execution until the
            //    consensus error is fixed
            //
            // For now only option b) is implemented, atm this is a very likely case
            // and the implemented behavior helps on debugging.
            // Option a) would likely need some block comparison of the same blocks
            // received by different peer to decide on bad blocks
            // (minimal solution: receive block from 3 peers and take block if there is
            // is equally served from at least 2 peers)
            /*try {
            // remove invalid block
              await blockchain!.delBlock(block.header.hash())
            } catch (error: any) {
              this.config.logger.error(
                `Error deleting block number=${blockNumber} hash=${hash} on failed execution`
              )
            }
            this.config.logger.warn(
              `Deleted block number=${blockNumber} hash=${hash} on failed execution`
            )

            const hardfork = this.config.execCommon.getHardforkByBlockNumber(blockNumber)
            if (hardfork !== this.hardfork) {
              this.config.logger.warn(
                `Set back hardfork along block deletion number=${blockNumber} hash=${hash} old=${this.hardfork} new=${hardfork}`
              )
              this.config.execCommon.setHardforkByBlockNumber(blockNumber, td)
            }*/
            // Option a): set iterator head to the parent block so that an
            // error can repeatedly processed for debugging
            const { number } = block.header
            const hash = short(block.hash())
            this.config.logger.warn(
              `Execution of block number=${number} hash=${hash} hardfork=${this.hardfork} failed:\n${error}`
            )
            if (this.config.debugCode) {
              await debugCodeReplayBlock(this, block)
            }
            this.config.events.emit(Event.SYNC_EXECUTION_VM_ERROR, error)
            errorBlock = block
          }
        },
        this.NUM_BLOCKS_PER_ITERATION,
        // release lock on this callback so other blockchain ops can happen while this block is being executed
        true
      )
      numExecuted = await this.vmPromise

      if (errorBlock !== undefined) {
        await this.chain.blockchain.setIteratorHead(
          'vm',
          (errorBlock as unknown as Block).header.parentHash
        )
        return 0
      }
      let endHeadBlock
      if (typeof this.vm.blockchain.getIteratorHead === 'function') {
        endHeadBlock = await this.vm.blockchain.getIteratorHead('vm')
      } else {
        throw new Error('cannot get iterator head: blockchain has no getIteratorHead function')
      }

      if (typeof numExecuted === 'number' && numExecuted > 0) {
        const firstNumber = startHeadBlock.header.number
        const firstHash = short(startHeadBlock.hash())
        const lastNumber = endHeadBlock.header.number
        const lastHash = short(endHeadBlock.hash())
        const baseFeeAdd =
          this.config.execCommon.gteHardfork(Hardfork.London) === true
            ? `baseFee=${endHeadBlock.header.baseFeePerGas} `
            : ''
        const tdAdd =
          this.config.execCommon.gteHardfork(Hardfork.Merge) === true
            ? ''
            : `td=${this.chain.blocks.td} `
        this.config.logger.info(
          `Executed blocks count=${numExecuted} first=${firstNumber} hash=${firstHash} ${tdAdd}${baseFeeAdd}hardfork=${this.hardfork} last=${lastNumber} hash=${lastHash} txs=${txCounter}`
        )
      } else {
        this.config.logger.warn(
          `No blocks executed past chain head hash=${short(endHeadBlock.hash())} number=${
            endHeadBlock.header.number
          }`
        )
      }
      startHeadBlock = endHeadBlock
      if (typeof this.vm.blockchain.getCanonicalHeadBlock !== 'function') {
        throw new Error(
          'cannot get iterator head: blockchain has no getCanonicalHeadBlock function'
        )
      }
      canonicalHead = await this.vm.blockchain.getCanonicalHeadBlock()
    }
    this.running = false
    return numExecuted ?? 0
  }

  /**
   * Stop VM execution. Returns a promise that resolves once its stopped.
   */
  async stop(): Promise<boolean> {
    if (this.vmPromise) {
      // ensure that we wait that the VM finishes executing the block (and flushing the trie cache)
      await this.vmPromise
    }
    await this.stateDB?.close()
    await super.stop()
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
    this.config.logger.info('Preparing for block execution (debug mode, no services started)...')
    const vm = await this.vm.copy()

    for (let blockNumber = first; blockNumber <= last; blockNumber++) {
      const block = await vm.blockchain.getBlock(blockNumber)
      if (block === null) throw new Error('No block found')
      const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)
      if (parentBlock === null) throw new Error('No block found')
      // Set the correct state root
      await vm.stateManager.setStateRoot(parentBlock.header.stateRoot)
      if (typeof vm.blockchain.getTotalDifficulty !== 'function') {
        throw new Error('cannot get iterator head: blockchain has no getTotalDifficulty function')
      }
      const td = await vm.blockchain.getTotalDifficulty(block.header.parentHash)
      vm._common.setHardforkByBlockNumber(blockNumber, td)

      if (txHashes.length === 0) {
        // we are skipping header validation because the block has been picked from the
        // blockchain and header should have already been validated while putBlock
        const res = await vm.runBlock({ block, skipHeaderValidation: true })
        this.config.logger.info(
          `Executed block num=${blockNumber} hash=0x${block.hash().toString('hex')} txs=${
            block.transactions.length
          } gasUsed=${res.gasUsed} `
        )
      } else {
        let count = 0
        // Special verbose tx execution mode triggered by BLOCK_NUMBER[*]
        // Useful e.g. to trace slow txs
        const allTxs = txHashes.length === 1 && txHashes[0] === '*' ? true : false
        for (const tx of block.transactions) {
          const txHash = bufferToHex(tx.hash())
          if (allTxs || txHashes.includes(txHash)) {
            const res = await vm.runTx({ block, tx })
            this.config.logger.info(
              `Executed tx hash=${txHash} gasUsed=${res.totalGasSpent} from block num=${blockNumber}`
            )
            count += 1
          }
        }
        if (count === 0) {
          if (!allTxs) {
            this.config.logger.warn(`Block number ${first} contains no txs with provided hashes`)
          } else {
            this.config.logger.info(`Block has 0 transactions (no execution)`)
          }
        }
      }
    }
  }
}
