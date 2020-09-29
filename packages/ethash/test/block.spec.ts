import * as tape from 'tape'
import Ethash from '../src'
import { Block } from '@ethereumjs/block'
const level = require('level-mem')

const cacheDB = level()

const {
  validBlockRlp,
  invalidBlockRlp
} = require('./ethash_block_rlp_tests.json')

tape('Verify POW for valid and invalid blocks', async function (t) {
  const e = new Ethash(cacheDB)

  const genesis = Block.fromBlockData({}, { initWithGenesisHeader: true })
  const genesisBlockResult = await e.verifyPOW(genesis)
  t.ok(genesisBlockResult, 'genesis block should be valid')

  const validBlock = Block.fromRLPSerializedBlock(
    Buffer.from(validBlockRlp, 'hex')
  )
  const validBlockResult = await e.verifyPOW(validBlock)
  t.ok(validBlockResult, 'should be valid')

  const invalidBlock = Block.fromRLPSerializedBlock(
    Buffer.from(invalidBlockRlp, 'hex')
  )
  const invalidBlockResult = await e.verifyPOW(invalidBlock)
  t.ok(!invalidBlockResult, 'should be invalid')
  t.end()
})
