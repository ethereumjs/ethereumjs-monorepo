import { Execution, ExecutionOptions } from './execution'
import { short } from '../../util'
import VM from '@ethereumjs/vm'
import { DefaultStateManager } from '@ethereumjs/vm/dist/state'
import { SecureTrie as Trie } from '@ethereumjs/trie'
import { Block } from '@ethereumjs/block'

export class VMExecution extends Execution {
  public vm: VM

  public syncing = false
  private vmPromise?: Promise<number | undefined>

  private NUM_BLOCKS_PER_ITERATION = 50

  /**
   * Create new VM excution module
   */
  constructor(options: ExecutionOptions) {
    super(options)

    if (!this.config.vm) {
      const trie = new Trie(this.stateDB)

      const stateManager = new DefaultStateManager({
        common: this.config.common,
        trie,
      })

      this.vm = new VM({
        common: this.config.common,
        blockchain: this.chain.blockchain,
        stateManager,
      })
    } else {
      this.vm = this.config.vm
      //@ts-ignore blockchain has readonly property
      this.vm.blockchain = this.chain.blockchain
    }
  }

  /**
   * Runs the VM execution
   * 
   * @returns number of blocks executed
  */
  async run(): Promise<number> {
    if (this.running || !this.syncing) {
      return 0
    }
    this.running = true

    let txCounter = 0
    let numExecuted: number | undefined

    const blockchain = this.vm.blockchain
    let startHeadBlock = await this.vm.blockchain.getHead()
    let canonicalHead = await this.vm.blockchain.getLatestBlock()

    let headBlock: Block | undefined
    let parentState: Buffer | undefined

    while (
      (numExecuted === undefined || numExecuted === this.NUM_BLOCKS_PER_ITERATION) &&
      !startHeadBlock.hash().equals(canonicalHead.hash()) &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      this.syncing
    ) {
      headBlock = undefined
      parentState = undefined

      this.vmPromise = blockchain.iterator(
        'vm',
        async (block: Block, reorg: boolean) => {
          // determine starting state for block run
          // if we are just starting or if a chain re-org has happened
          if (!headBlock || reorg) {
            const parentBlock = await blockchain!.getBlock(block.header.parentHash)
            parentState = parentBlock.header.stateRoot
            // generate genesis state if we are at the genesis block
            // we don't have the genesis state
            if (!headBlock) {
              await this.vm.stateManager.generateCanonicalGenesis()
            } else {
              parentState = headBlock.header.stateRoot
            }
          }
          // run block, update head if valid
          try {
            await this.vm.runBlock({ block, root: parentState })
            txCounter += block.transactions.length
            // set as new head block
            headBlock = block
          } catch (error) {
            // remove invalid block
            await blockchain!.delBlock(block.header.hash())
            throw error
          }
        },
        this.NUM_BLOCKS_PER_ITERATION
      )
      numExecuted = (await this.vmPromise) as number

      const endHeadBlock = await this.vm.blockchain.getHead()
      if (numExecuted > 0) {
        const firstNumber = startHeadBlock.header.number.toNumber()
        const firstHash = short(startHeadBlock.hash())
        const lastNumber = endHeadBlock.header.number.toNumber()
        const lastHash = short(endHeadBlock.hash())
        this.config.logger.info(
          `Executed blocks count=${numExecuted} first=${firstNumber} hash=${firstHash} last=${lastNumber} hash=${lastHash} with txs=${txCounter}`
        )
      } else {
        this.config.logger.warn(
          `No blocks executed past chain head hash=${short(
            endHeadBlock.hash()
          )} number=${endHeadBlock.header.number.toNumber()}`
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
   * @returns {Promise}
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
}
