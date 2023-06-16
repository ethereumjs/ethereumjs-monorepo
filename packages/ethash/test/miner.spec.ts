import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { MapDB } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Ethash } from '../src/index.js'

import type { BlockHeader } from '@ethereumjs/block'
import type { DBObject } from '@ethereumjs/util'

const cacheDb = new MapDB<number, DBObject>()
const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Petersburg })

describe('Miner', () => {
  it('Check if miner works as expected', async () => {
    const e = new Ethash(cacheDb)

    const block = Block.fromBlockData(
      {
        header: {
          difficulty: BigInt(100),
          number: BigInt(1),
        },
      },
      { common }
    )

    const invalidBlockResult = await e.verifyPOW(block)
    assert.ok(!invalidBlockResult, 'should be invalid')

    const miner = e.getMiner(block.header)
    assert.equal(await miner.iterate(1), undefined, 'iterations can return undefined')

    assert.equal((miner as any).currentNonce, BigInt(1), 'miner saves current nonce')
    await miner.iterate(1)
    assert.equal((miner as any).currentNonce, BigInt(2), 'miner successfully iterates over nonces')

    const solution = await miner.iterate(-1)

    const validBlock = Block.fromBlockData(
      {
        header: {
          difficulty: block.header.difficulty,
          number: block.header.number,
          nonce: solution?.nonce,
          mixHash: solution?.mixHash,
        },
      },
      { common }
    )

    const validBlockResult = await e.verifyPOW(validBlock)
    assert.ok(validBlockResult, 'successfully mined block')
    assert.ok((miner as any).solution !== undefined, 'cached the solution')
  }, 200000)

  it('Check if it is possible to mine Blocks and BlockHeaders', async () => {
    const e = new Ethash(cacheDb as any)

    const block = Block.fromBlockData(
      {
        header: {
          difficulty: BigInt(100),
          number: BigInt(1),
        },
      },
      { common }
    )
    const miner = e.getMiner(block.header)
    const solution = <BlockHeader>await miner.mine(-1)

    assert.ok(
      e.verifyPOW(Block.fromBlockData({ header: solution.toJSON() }, { common })),
      'successfully mined block'
    )

    const blockMiner = e.getMiner(block)
    const blockSolution = <Block>await blockMiner.mine(-1)

    assert.ok(e.verifyPOW(blockSolution))
  }, 60000)

  it('Check if it is possible to stop the miner', async () => {
    const e = new Ethash(cacheDb as any)

    const block = Block.fromBlockData(
      {
        header: {
          difficulty: BigInt(10000000000000),
          number: BigInt(1),
        },
      },
      { common }
    )
    const miner = e.getMiner(block.header)
    setTimeout(function () {
      miner.stop()
    }, 1000)
    const solution = await miner.iterate(-1)
    assert.ok(solution === undefined, 'successfully stopped miner')
  })

  it('Check if it is possible to stop the miner', () => {
    const e = new Ethash(cacheDb as any)

    const block: any = {}

    assert.throws(
      () => {
        e.getMiner(block)
      },
      undefined,
      undefined,
      'miner constructor successfully throws if no BlockHeader or Block object is passed'
    )
  })

  it('Should keep common when mining blocks or headers', async () => {
    const e = new Ethash(cacheDb as any)

    const block = Block.fromBlockData(
      {
        header: {
          difficulty: BigInt(100),
          number: BigInt(1),
        },
      },
      {
        common,
      }
    )

    const miner = e.getMiner(block.header)
    const solution = <BlockHeader>await miner.mine(-1)

    assert.ok(solution._common.hardfork() === Hardfork.Petersburg, 'hardfork did not change')
    assert.ok(solution._common.chainName() === 'ropsten', 'chain name did not change')

    const blockMiner = e.getMiner(block)
    const blockSolution = <Block>await blockMiner.mine(-1)

    assert.ok(blockSolution._common.hardfork() === Hardfork.Petersburg, 'hardfork did not change')
    assert.ok(blockSolution._common.chainName() === 'ropsten', 'chain name did not change')
  }, 60000)
})
