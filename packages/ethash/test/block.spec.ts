import tape from 'tape'
import { Block } from '@ethereumjs/block'
import { toBuffer } from 'ethereumjs-util'
import Ethash from '../src'
const level = require('level-mem')

const cacheDB = level()

const { validBlockRlp, invalidBlockRlp } = require('./ethash_block_rlp_tests.json')

tape('Verify POW for valid and invalid blocks', async function (t) {
  const e = new Ethash(cacheDB)

  const genesis = Block.genesis()
  const genesisResult = await e.verifyPOW(genesis)
  t.ok(genesisResult, 'genesis block should be valid')

  const validRlp = Buffer.from(validBlockRlp, 'hex')
  const validBlock = Block.fromRLPSerializedBlock(validRlp)
  const validBlockResult = await e.verifyPOW(validBlock)
  t.ok(validBlockResult, 'should be valid')

  const invalidRlp = Buffer.from(invalidBlockRlp, 'hex')
  const invalidBlock = Block.fromRLPSerializedBlock(invalidRlp)
  const invalidBlockResult = await e.verifyPOW(invalidBlock)
  t.ok(!invalidBlockResult, 'should be invalid')

  const testData = require('./block_tests_data.json')
  const blockRlp = toBuffer(testData.blocks[0].rlp)
  const block = Block.fromRLPSerializedBlock(blockRlp)
  const uncleBlockResult = await e.verifyPOW(block)
  t.ok(uncleBlockResult, 'should be valid')
  t.end()
})
