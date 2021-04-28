import { Block } from '@ethereumjs/block'
import VM from '@ethereumjs/vm'
import { Chain, ChainOptions } from '../../../lib/blockchain'

interface MockChainOptions extends ChainOptions {
  /* The height of the chain (default: 10) */
  height?: number

  /*
    If true, generates the canonical genesis to set the stateRoot.
    This takes some time for mainnet.
    (default: false)
  */
  generateCanonicalGenesis?: boolean
}

export default class MockChain extends Chain {
  public height: number
  private vm: VM // for building blocks
  private generateCanonicalGenesis: boolean

  constructor(options: MockChainOptions) {
    super(options)
    this.height = options.height ?? 10
    this.vm = new VM({ blockchain: this.blockchain, common: this.config.chainCommon })
    this.generateCanonicalGenesis = options.generateCanonicalGenesis ?? false
  }

  async open() {
    if (this.opened) {
      return false
    }
    await super.open()
    await this.vm.init()
    if (this.generateCanonicalGenesis) {
      await this.vm.stateManager.generateCanonicalGenesis()
    }
    await this.build()
  }

  async build() {
    const blocks: Block[] = [await this.vm.blockchain.getBlock(0)]

    const opts = { common: this.config.chainCommon }
    for (let number = 1; number < this.height + 1; number++) {
      const blockBuilder = await this.vm.buildBlock({
        headerData: { number, timestamp: blocks[number - 1].header.timestamp.addn(1) },
        parentBlock: blocks[number - 1],
        blockOpts: { calcDifficultyFromHeader: blocks[number - 1].header, ...opts },
      })
      const block = await blockBuilder.build()
      blocks.push(block)
    }

    await this.putBlocks(blocks.slice(1))
  }
}
