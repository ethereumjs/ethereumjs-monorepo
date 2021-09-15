import tape from 'tape'
import { Block } from '@ethereumjs/block'
import Ethash from '../src'
import { BN } from 'ethereumjs-util'
const level = require('level-mem')

const cacheDB = level()

tape('Verify POW for valid and invalid blocks', async function (t) {
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
  t.ok(miner.solution != undefined, 'cached the solution')

  t.end()
})
