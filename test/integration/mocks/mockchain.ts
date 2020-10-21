const Block = require('ethereumjs-block')
import { Chain } from '../../../lib/blockchain'

const defaultOptions = {
  height: 10,
}

export default class MockChain extends Chain {
  public height: any

  constructor(options: any = {}) {
    super(options)
    options = { ...defaultOptions, ...options }
    this.height = options.height
  }

  async open() {
    if (this.opened) {
      return false
    }
    await super.open()
    await this.build()
  }

  async build() {
    const blocks: any[] = []
    for (let number = 0; number < this.height; number++) {
      blocks.push(
        new Block({
          header: {
            number: number + 1,
            difficulty: 1,
            parentHash: number ? blocks[number - 1].hash() : (this.genesis as any).hash,
          },
        })
      )
    }
    await this.putBlocks(blocks)
  }
}
