import { Block } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex } from 'ethereum-cryptography/utils.js'
import { assert, describe, it } from 'vitest'

import { Blockchain, EthashConsensus } from '../src/index.js'

import type { Consensus } from '../src/index.js'
import type { BlockHeader } from '@ethereumjs/block'

class fibonacciConsensus implements Consensus {
  algorithm: string
  constructor() {
    this.algorithm = 'fibonacciConsensus'
  }
  genesisInit(_genesisBlock: Block): Promise<void> {
    return new Promise<void>((resolve) => resolve())
  }
  setup(): Promise<void> {
    return new Promise<void>((resolve) => resolve())
  }
  validateConsensus(_block: Block): Promise<void> {
    if (bytesToHex(_block.header.extraData) !== '12358d') {
      throw new Error(
        'header contains invalid extradata - must match first 6 elements of fibonacci sequence'
      )
    }
    return new Promise<void>((resolve) => resolve())
  }
  validateDifficulty(_header: BlockHeader): Promise<void> {
    if (_header.number === 1n && _header.difficulty === 1n) {
      return new Promise<void>((resolve) => resolve())
    }
    if (_header.difficulty !== _header.number - 1n + _header.number - 2n) {
      throw new Error('invalid difficulty - must be sum of previous two block numbers')
    }
    return new Promise<void>((resolve) => resolve())
  }
  newBlock(): Promise<void> {
    return new Promise<void>((resolve) => resolve())
  }
}

describe('Optional consensus parameter in blockchain constructor', () => {
  it('blockchain constructor should work with custom consensus', async () => {
    const common = new Common({ chain: 'mainnet', hardfork: Hardfork.Chainstart })
    const consensus = new fibonacciConsensus()
    try {
      const blockchain = await Blockchain.create({ common, consensus })
      assert.equal(
        (blockchain.consensus as fibonacciConsensus).algorithm,
        'fibonacciConsensus',
        'consensus algorithm matches'
      )
    } catch (err) {
      assert.fail('blockchain should instantiate successfully')
    }
  })
})

describe('Custom consensus validation rules', () => {
  it('should validat custom consensus rules', async () => {
    const common = new Common({ chain: 'mainnet', hardfork: Hardfork.Chainstart })
    const consensus = new fibonacciConsensus()
    const blockchain = await Blockchain.create({ common, consensus })
    const block = Block.fromBlockData(
      {
        header: {
          number: 1n,
          difficulty: 1n,
          extraData: '0x12358d',
          parentHash: blockchain.genesisBlock.hash(),
          timestamp: blockchain.genesisBlock.header.timestamp + 1n,
          gasLimit: blockchain.genesisBlock.header.gasLimit + 1n,
        },
      },
      { common }
    )

    try {
      await blockchain.putBlock(block)
      assert.deepEqual(
        (await blockchain.getBlock(block.header.number)).header.hash(),
        block.header.hash(),
        'put block with valid difficulty and extraData'
      )
    } catch {
      assert.fail('should have put block with valid difficulty and extraData')
    }

    const blockWithBadDifficulty = Block.fromBlockData(
      {
        header: {
          number: 2n,
          difficulty: 2n,
          extraData: '0x12358d',
          parentHash: block.hash(),
          timestamp: block.header.timestamp + 1n,
        },
      },
      { common }
    )
    try {
      await blockchain.putBlock(blockWithBadDifficulty)
      assert.fail('should throw')
    } catch (err: any) {
      assert.ok(
        err.message.includes('invalid difficulty'),
        'failed to put block with invalid difficulty'
      )
    }

    const blockWithBadExtraData = Block.fromBlockData(
      {
        header: {
          number: 2n,
          difficulty: 1n,
          extraData: '0x12358c',
          parentHash: block.hash(),
          timestamp: block.header.timestamp + 1n,
          gasLimit: block.header.gasLimit + 1n,
        },
      },
      { common }
    )
    try {
      await blockchain.putBlock(blockWithBadExtraData)
      assert.fail('should throw')
    } catch (err: any) {
      assert.ok(
        err.message ===
          'header contains invalid extradata - must match first 6 elements of fibonacci sequence',
        'failed to put block with invalid extraData'
      )
    }
  })
})

describe('consensus transition checks', () => {
  it('should transition correctly', async () => {
    const common = new Common({ chain: 'mainnet', hardfork: Hardfork.Chainstart })
    const consensus = new fibonacciConsensus()
    const blockchain = await Blockchain.create({ common, consensus })

    try {
      await (blockchain as any).checkAndTransitionHardForkByNumber(5n)
      assert.ok('checkAndTransitionHardForkByNumber does not throw with custom consensus')
    } catch (err: any) {
      assert.fail(
        `checkAndTransitionHardForkByNumber should not throw with custom consensus, error=${err.message}`
      )
    }

    ;(blockchain as any).consensus = new EthashConsensus()
    ;(blockchain._common as any).consensusAlgorithm = () => 'fibonacci'

    try {
      await (blockchain as any).checkAndTransitionHardForkByNumber(5n)
      assert.fail(
        'checkAndTransitionHardForkByNumber should throw when using standard consensus (ethash, clique, casper) but consensus algorithm defined in common is different'
      )
    } catch (err: any) {
      assert.equal(
        err.message,
        'consensus algorithm fibonacci not supported',
        `checkAndTransitionHardForkByNumber correctly throws when using standard consensus (ethash, clique, casper) but consensus algorithm defined in common is different, error=${err.message}`
      )
    }
  })
})
