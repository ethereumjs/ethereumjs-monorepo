import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { MapDB } from '@ethereumjs/util'
import * as tape from 'tape'

import { Ethash } from '../src'

import type { BlockHeader } from '@ethereumjs/block'
import type { DBObject } from '@ethereumjs/util'

const cacheDb = new MapDB<number, DBObject>()
const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Petersburg })

tape('Check if miner works as expected', async function (t) {
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
  t.ok(!invalidBlockResult, 'should be invalid')

  const miner = e.getMiner(block.header)
  t.equals(await miner.iterate(1), undefined, 'iterations can return undefined')

  t.equals((miner as any).currentNonce, BigInt(1), 'miner saves current nonce')
  await miner.iterate(1)
  t.equals((miner as any).currentNonce, BigInt(2), 'miner successfully iterates over nonces')

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
  t.ok(validBlockResult, 'successfully mined block')
  t.ok((miner as any).solution !== undefined, 'cached the solution')

  t.end()
})

tape('Check if it is possible to mine Blocks and BlockHeaders', async function (t) {
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

  t.ok(
    e.verifyPOW(Block.fromBlockData({ header: solution.toJSON() }, { common })),
    'successfully mined block'
  )

  const blockMiner = e.getMiner(block)
  const blockSolution = <Block>await blockMiner.mine(-1)

  t.ok(e.verifyPOW(blockSolution))

  t.end()
})

tape('Check if it is possible to stop the miner', async function (t) {
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
  t.ok(solution === undefined, 'successfully stopped miner')

  t.end()
})

tape('Check if it is possible to stop the miner', async function (t) {
  const e = new Ethash(cacheDb as any)

  const block: any = {}

  t.throws(() => {
    e.getMiner(block)
  }, 'miner constructor successfully throws if no BlockHeader or Block object is passed')

  t.end()
})

tape('Should keep common when mining blocks or headers', async function (t) {
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

  t.ok(solution._common.hardfork() === Hardfork.Petersburg, 'hardfork did not change')
  t.ok(solution._common.chainName() === 'ropsten', 'chain name did not change')

  const blockMiner = e.getMiner(block)
  const blockSolution = <Block>await blockMiner.mine(-1)

  t.ok(blockSolution._common.hardfork() === Hardfork.Petersburg, 'hardfork did not change')
  t.ok(blockSolution._common.chainName() === 'ropsten', 'chain name did not change')

  t.end()
})
