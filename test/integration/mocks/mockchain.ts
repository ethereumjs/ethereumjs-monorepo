import { Block } from '@ethereumjs/block'
import { Chain, ChainOptions } from '../../../lib/blockchain'

interface MockChainOptions extends ChainOptions {
  height?: number
}

export default class MockChain extends Chain {
  public height: number

  constructor(options: MockChainOptions) {
    super(options)
    this.height = options.height ?? 10
  }

  async open() {
    if (this.opened) {
      return false
    }
    await super.open()
    await this.build()
  }

  async build() {
    const blocks: Block[] = []
    for (let number = 0; number < this.height; number++) {
      const block = Block.fromBlockData({
        header: {
          number: number + 1,
          difficulty: 1,
          parentHash: number ? blocks[number - 1].hash() : (this.genesis as any).hash,
        },
      })
      blocks.push(block)
    }
    await this.putBlocks(blocks)
  }
}
