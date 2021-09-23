import tape from 'tape'
import { Block, BlockHeader } from '@ethereumjs/block'
import Ethash from '../src'
import { BN } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
const level = require('level-mem')

const cacheDB = level()

tape('Check if miner works as expected', async function (t) {
  const e = new Ethash(cacheDB)

  const block = Block.fromBlockData({
    header: {
      difficulty: new BN(100),
      number: new BN(1),
    },
  })

  const invalidBlockResult = await e.verifyPOW(block)
  t.ok(!invalidBlockResult, 'should be invalid')

  const miner = e.getMiner(block.header)
  t.ok((await miner.iterate(1)) === undefined, 'iterations can return undefined')

  t.ok((miner as any).currentNonce.eqn(1), 'miner saves current nonce')
  await miner.iterate(1)
  t.ok((miner as any).currentNonce.eqn(2), 'miner succesfully iterates over nonces')

  const solution = await miner.iterate(-1)

  const validBlock = Block.fromBlockData({
    header: {
      difficulty: block.header.difficulty,
      number: block.header.number,
      nonce: solution?.nonce,
      mixHash: solution?.mixHash,
    },
  })

  const validBlockResult = await e.verifyPOW(validBlock)
  t.ok(validBlockResult, 'succesfully mined block')
  t.ok((miner as any).solution != undefined, 'cached the solution')

  t.end()
})

tape('Check if it is possible to mine Blocks and BlockHeaders', async function (t) {
  const e = new Ethash(cacheDB)

  const block = Block.fromBlockData({
    header: {
      difficulty: new BN(100),
      number: new BN(1),
    },
  })

  const miner = e.getMiner(block.header)
  const solution = <BlockHeader>await miner.mine(-1)

  t.ok(e.verifyPOW(Block.fromBlockData({ header: solution.toJSON() })), 'succesfully mined block')

  const blockMiner = e.getMiner(block)
  const blockSolution = <Block>await blockMiner.mine(-1)

  t.ok(e.verifyPOW(blockSolution))

  t.end()
})

tape('Check if it is possible to stop the miner', async function (t) {
  const e = new Ethash(cacheDB)

  const block = Block.fromBlockData({
    header: {
      difficulty: new BN(10000000000000),
      number: new BN(1),
    },
  })

  const miner = e.getMiner(block.header)
  setTimeout(function () {
    miner.stop()
  }, 1000)
  const solution = await miner.iterate(-1)
  t.ok(solution === undefined, 'succesfully stopped miner')

  t.end()
})

tape('Check if it is possible to stop the miner', async function (t) {
  const e = new Ethash(cacheDB)

  const block: any = {}

  t.throws(() => {
    e.getMiner(block)
  }, 'miner constructor succesfully throws if no BlockHeader or Block object is passed')

  t.end()
})

tape('Should keep common when mining blocks or headers', async function (t) {
  const e = new Ethash(cacheDB)

  const common = new Common({ chain: 'ropsten', hardfork: 'petersburg' })

  const block = Block.fromBlockData(
    {
      header: {
        difficulty: new BN(100),
        number: new BN(1),
      },
    },
    {
      common,
    }
  )

  const miner = e.getMiner(block.header)
  const solution = <BlockHeader>await miner.mine(-1)

  t.ok(solution._common.hardfork() === 'petersburg', 'hardfork did not change')
  t.ok(solution._common.chainName() === 'ropsten', 'chain name did not change')

  const blockMiner = e.getMiner(block)
  const blockSolution = <Block>await blockMiner.mine(-1)

  t.ok(blockSolution._common.hardfork() === 'petersburg', 'hardfork did not change')
  t.ok(blockSolution._common.chainName() === 'ropsten', 'chain name did not change')

  t.end()
})
