import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { MapDB } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Ethash } from '../src/index.ts'

import type { Block, BlockHeader } from '@ethereumjs/block'
import type { DBObject } from '@ethereumjs/util'

const cacheDb = new MapDB<number, DBObject>()
const common = new Common({ chain: Mainnet, hardfork: Hardfork.Petersburg })

describe('Miner', () => {
  it('Check if miner works as expected', async () => {
    const e = new Ethash(cacheDb)

    const block = createBlock(
      {
        header: {
          difficulty: BigInt(100),
          number: BigInt(1),
        },
      },
      { common },
    )

    assert.isFalse(await e.verifyPOW(block), 'should be invalid')

    const miner = e.getMiner(block.header)
    assert.strictEqual(await miner.iterate(1), undefined, 'iterations can return undefined')

    assert.strictEqual((miner as any).currentNonce, BigInt(1), 'miner saves current nonce')
    await miner.iterate(1)
    assert.strictEqual(
      (miner as any).currentNonce,
      BigInt(2),
      'miner successfully iterates over nonces',
    )

    const solution = await miner.iterate(-1)

    const validBlock = createBlock(
      {
        header: {
          difficulty: block.header.difficulty,
          number: block.header.number,
          nonce: solution?.nonce,
          mixHash: solution?.mixHash,
        },
      },
      { common },
    )

    assert.isTrue(await e.verifyPOW(validBlock), 'successfully mined block')
    assert.isDefined(miner.solution, 'cached the solution')
  }, 200000)

  it('Check if it is possible to mine Blocks and BlockHeaders', async () => {
    const e = new Ethash(cacheDb as any)

    const block = createBlock(
      {
        header: {
          difficulty: BigInt(100),
          number: BigInt(1),
        },
      },
      { common },
    )
    const miner = e.getMiner(block.header)
    const solution = (await miner.mine(-1)) as BlockHeader

    assert.isTrue(
      await e.verifyPOW(createBlock({ header: solution.toJSON() }, { common })),
      'successfully mined block',
    )

    const blockMiner = e.getMiner(block)
    const blockSolution = (await blockMiner.mine(-1)) as Block

    assert.isTrue(await e.verifyPOW(blockSolution))
  }, 60000)

  it('Check if it is possible to stop the miner', async () => {
    const e = new Ethash(cacheDb as any)

    const block = createBlock(
      {
        header: {
          difficulty: BigInt(10000000000000),
          number: BigInt(1),
        },
      },
      { common },
    )
    const miner = e.getMiner(block.header)
    setTimeout(function () {
      miner.stop()
    }, 1000)
    const solution = await miner.iterate(-1)
    assert.isUndefined(solution, 'successfully stopped miner')
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
      'miner constructor successfully throws if no BlockHeader or Block object is passed',
    )
  })

  it('Should keep common when mining blocks or headers', async () => {
    const e = new Ethash(cacheDb as any)

    const block = createBlock(
      {
        header: {
          difficulty: BigInt(100),
          number: BigInt(1),
        },
      },
      {
        common,
      },
    )

    const miner = e.getMiner(block.header)
    const solution = (await miner.mine(-1)) as BlockHeader

    assert.strictEqual(solution.common.hardfork(), Hardfork.Petersburg, 'hardfork did not change')
    assert.strictEqual(solution.common.chainName(), 'mainnet', 'chain name did not change')

    const blockMiner = e.getMiner(block)
    const blockSolution = (await blockMiner.mine(-1)) as Block

    assert.strictEqual(
      blockSolution.common.hardfork(),
      Hardfork.Petersburg,
      'hardfork did not change',
    )
    assert.strictEqual(blockSolution.common.chainName(), 'mainnet', 'chain name did not change')
  }, 60000)
})
