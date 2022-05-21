import {
  DBSetTD,
  DBSaveLookups,
  DBSetBlockOrHeader,
  DBSetHashToNumber,
} from '@ethereumjs/blockchain/dist/db/helpers'
import { ConsensusType, Hardfork } from '@ethereumjs/common'
import VM from '@ethereumjs/vm'
import { bufferToHex } from 'ethereumjs-util'
import { DefaultStateManager } from '@ethereumjs/vm/dist/state'
import { SecureTrie as Trie } from 'merkle-patricia-tree'
import { short } from '../util'
import { debugCodeReplayBlock } from '../util/debug'
import { Event } from '../types'
import { Execution, ExecutionOptions } from './execution'
import { ReceiptsManager } from './receipt'
import type { Block } from '@ethereumjs/block'
import type { RunBlockOpts } from '@ethereumjs/vm/dist/runBlock'
import type { TxReceipt } from '@ethereumjs/vm/dist/types'

export class VMExecution extends Execution {
  public vm: VM
  public hardfork: string = ''

  public receiptsManager?: ReceiptsManager
  private pendingReceipts?: Map<string, TxReceipt[]>
  private vmPromise?: Promise<number | undefined>

  /** Number of maximum blocks to run per iteration of {@link VMExecution.run} */
  private NUM_BLOCKS_PER_ITERATION = 50

  /**
   * Create new VM execution module
   */
  constructor(options: ExecutionOptions) {
    super(options)

    if (!this.config.vm) {
      const trie = new Trie(this.stateDB)

      const stateManager = new DefaultStateManager({
        common: this.config.execCommon,
        trie,
      })

      this.vm = new VM({
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
    const headBlock = await this.vm.blockchain.getIteratorHead()
    const { number } = headBlock.header
    const td = await this.vm.blockchain.getTotalDifficulty(headBlock.header.hash())
    this.config.execCommon.setHardforkByBlockNumber(number, td)
    this.hardfork = this.config.execCommon.hardfork()
    this.config.logger.info(`Initializing VM execution hardfork=${this.hardfork}`)
    if (number.isZero()) {
      await this.vm.stateManager.generateCanonicalGenesis()
    }
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
    if (receipts) {
      // Save receipts
      this.pendingReceipts?.set(block.hash().toString('hex'), receipts)
    }
    // Bypass updating head by using blockchain db directly
    const [hash, num] = [block.hash(), block.header.number]
    const td = (await this.chain.getTd(block.header.parentHash, block.header.number.subn(1))).add(
      block.header.difficulty
    )
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
    await this.chain.putBlocks(blocks, true)
    for (const block of blocks) {
      const receipts = this.pendingReceipts?.get(block.hash().toString('hex'))
      if (receipts) {
        void this.receiptsManager?.saveReceipts(block, receipts)
        this.pendingReceipts?.delete(block.hash().toString('hex'))
      }
    }
    const head = blocks[blocks.length - 1]
    await this.chain.blockchain.setIteratorHead('vm', head.hash())
  }

  /**
   * Runs the VM execution
   *
   * @returns number of blocks executed
   */
  async run(): Promise<number> {
    if (this.running) {
      return 0
    }
    this.running = true
    let numExecuted: number | undefined

    const { blockchain } = this.vm
    let startHeadBlock = await blockchain.getIteratorHead()
    let canonicalHead = await blockchain.getLatestBlock()

    let headBlock: Block | undefined
    let parentState: Buffer | undefined
    let errorBlock: Block | undefined

    while (
      (numExecuted === undefined || numExecuted === this.NUM_BLOCKS_PER_ITERATION) &&
      !startHeadBlock.hash().equals(canonicalHead.hash())
    ) {
      let txCounter = 0
      headBlock = undefined
      parentState = undefined
      errorBlock = undefined

      this.vmPromise = blockchain.iterator(
        'vm',
        async (block: Block, reorg: boolean) => {
          if (errorBlock) {
            return
          }
          // determine starting state for block run
          // if we are just starting or if a chain re-org has happened
          if (!headBlock || reorg) {
            const parentBlock = await blockchain.getBlock(block.header.parentHash)
            parentState = parentBlock.header.stateRoot
          }
          // run block, update head if valid
          try {
            const { number } = block.header
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
            const result = await this.vm.runBlock({
              block,
              root: parentState,
              skipBlockValidation,
            })
            void this.receiptsManager?.saveReceipts(block, result.receipts)
            txCounter += block.transactions.length
            // set as new head block
            headBlock = block
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
        this.NUM_BLOCKS_PER_ITERATION
      )
      numExecuted = (await this.vmPromise) as number

      if (errorBlock) {
        await this.chain.blockchain.setIteratorHead('vm', (errorBlock as Block).header.parentHash)
        return 0
      }

      const endHeadBlock = await this.vm.blockchain.getIteratorHead('vm')
      if (numExecuted > 0) {
        const firstNumber = startHeadBlock.header.number.toNumber()
        const firstHash = short(startHeadBlock.hash())
        const lastNumber = endHeadBlock.header.number.toNumber()
        const lastHash = short(endHeadBlock.hash())
        const baseFeeAdd = this.config.execCommon.gteHardfork(Hardfork.London)
          ? `baseFee=${endHeadBlock.header.baseFeePerGas} `
          : ''
        const tdAdd = this.config.execCommon.gteHardfork(Hardfork.Merge)
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
      canonicalHead = await this.vm.blockchain.getLatestBlock()
    }
    this.running = false
    return numExecuted as number
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
    const vm = this.vm.copy()

    for (let blockNumber = first; blockNumber <= last; blockNumber++) {
      const block = await vm.blockchain.getBlock(blockNumber)
      const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)

      // Set the correct state root
      await vm.stateManager.setStateRoot(parentBlock.header.stateRoot)

      const td = await vm.blockchain.getTotalDifficulty(block.header.parentHash)
      vm._common.setHardforkByBlockNumber(blockNumber, td)

      if (txHashes.length === 0) {
        const res = await vm.runBlock({ block })
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
              `Executed tx hash=${txHash} gasUsed=${res.gasUsed} from block num=${blockNumber}`
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
