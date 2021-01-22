import { Execution, ExecutionOptions } from './execution'
import { short } from '../../util'
import VM from '@ethereumjs/vm'
import { DefaultStateManager } from '@ethereumjs/vm/dist/state'
import { SecureTrie as Trie } from '@ethereumjs/trie'

export class VMExecution extends Execution {
  public vm: VM

  private vmPromise?: Promise<void>
  private stopSyncing = false

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
   * This updates the VM once blocks were put in the VM
   */
  async runBlocks() {
    if (this.running) {
      return
    }
    this.running = true
    let blockCounter = 0
    let txCounter = 0
    const NUM_BLOCKS_PER_LOG_MSG = 50
    try {
      let oldHead = Buffer.alloc(0)
      const newHeadBlock = await this.vm.blockchain.getHead()
      let newHead = newHeadBlock.hash()
      let firstHeadBlock = newHeadBlock
      let lastHeadBlock = newHeadBlock
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      while (!newHead.equals(oldHead) && !this.stopSyncing) {
        oldHead = newHead
        this.vmPromise = this.vm.runBlockchain(this.vm.blockchain, 1)
        await this.vmPromise
        const headBlock = await this.vm.blockchain.getHead()
        newHead = headBlock.hash()
        if (blockCounter === 0) {
          firstHeadBlock = headBlock
        }
        // check if we did run a new block:
        if (!newHead.equals(oldHead)) {
          blockCounter += 1
          txCounter += headBlock.transactions.length
          lastHeadBlock = headBlock

          if (blockCounter >= NUM_BLOCKS_PER_LOG_MSG) {
            const firstNumber = firstHeadBlock.header.number.toNumber()
            const firstHash = short(firstHeadBlock.hash())
            const lastNumber = lastHeadBlock.header.number.toNumber()
            const lastHash = short(lastHeadBlock.hash())
            this.config.logger.info(
              `Executed blocks count=${blockCounter} first=${firstNumber} hash=${firstHash} last=${lastNumber} hash=${lastHash} with txs=${txCounter}`
            )
            blockCounter = 0
            txCounter = 0
          }
        }
      }
    } catch (error) {
      this.emit('error', error)
    } finally {
      this.running = false
    }
    return blockCounter
  }

  /**
   * Stop VM execution. Returns a promise that resolves once its stopped.
   * @returns {Promise}
   */
  async stop(): Promise<boolean> {
    this.stopSyncing = true
    if (this.vmPromise) {
      // ensure that we wait that the VM finishes executing the block (and flushing the trie cache)
      await this.vmPromise
    }
    await this.stateDB?.close()
    await super.stop()
    return true
  }
}
