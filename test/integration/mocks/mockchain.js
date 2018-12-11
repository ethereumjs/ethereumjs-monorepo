'use strict'

const { Chain } = require('../../../lib/blockchain')
const Block = require('ethereumjs-block')

const defaultOptions = {
  height: 10
}

class MockChain extends Chain {
  constructor (options = {}) {
    super(options)
    options = { ...defaultOptions, ...options }
    this.height = options.height
  }

  async open () {
    if (this.opened) {
      return false
    }
    await super.open()
    await this.build()
  }

  async build () {
    const blocks = []
    for (let number = 0; number < this.height; number++) {
      blocks.push(new Block({
        header: {
          number: number + 1,
          difficulty: 1,
          parentHash: number ? blocks[number - 1].hash() : this.genesis.hash
        }
      }))
    }
    await this.putBlocks(blocks)
  }
}

module.exports = MockChain
