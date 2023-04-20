import { Block } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'

import { Chain } from '../../../lib/blockchain'

import type { ChainOptions } from '../../../lib/blockchain'

interface MockChainOptions extends ChainOptions {
  height?: number
}

export class MockChain extends Chain {
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
    const common = this.config.chainCommon
    const blocks: Block[] = []
    for (let number = 0; number < this.height; number++) {
      const block = Block.fromBlockData(
        {
          header: {
            number: number + 1,
            difficulty: common.gteHardfork(Hardfork.Paris) ? 0 : 1,
            parentHash: number ? blocks[number - 1].hash() : this.genesis.hash(),
          },
        },
        { common }
      )
      blocks.push(block)
    }
    await this.putBlocks(blocks, true)
  }
}
