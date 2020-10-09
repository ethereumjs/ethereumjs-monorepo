import * as tape from 'tape'
import { Block } from '@ethereumjs/block'
import Ethash from '../src'
const level = require('level-mem')

const cacheDB = level()

const {
  validBlockRlp,
  invalidBlockRlp
} = require('./ethash_block_rlp_tests.json')

tape('Verify POW for valid and invalid blocks', async function (t) {
  const e = new Ethash(cacheDB)

  const genesisBlock = Block.fromBlockData({}, { initWithGenesisHeader: true })
  const genesisBlockResult = await e.verifyPOW(genesisBlock)
  t.ok(genesisBlockResult, 'genesis block should be valid')

  const validRlp = Buffer.from(validBlockRlp, 'hex')
  // TODO: fix error "Error: extraData cannot exceed 32 bytes, received 1024 bytes"
  //       investigate why extraData field is so large?
  //       possible solution: fix rlp with smaller data for that field?
  //       another solution: add settings flag to bypass buffer length validation?
  // const validBlock = Block.fromRLPSerializedBlock(validRlp)
  // const validBlockResult = await e.verifyPOW(validBlock)
  // t.ok(validBlockResult, 'should be valid')

  const invalidRlp = Buffer.from(invalidBlockRlp, 'hex')
  t.throws(() => {
    const invalidBlock = Block.fromRLPSerializedBlock(invalidRlp)
    // const invalidBlockResult = await e.verifyPOW(invalidBlock)
    // t.ok(!invalidBlockResult, 'should be invalid')
  })

  t.end()
})
