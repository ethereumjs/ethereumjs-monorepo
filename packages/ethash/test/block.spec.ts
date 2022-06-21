import * as tape from 'tape'
import { Block, BlockBuffer } from '@ethereumjs/block'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { arrToBufArr, toBuffer } from '@ethereumjs/util'
import Ethash from '../src'
import { MemoryLevel } from 'memory-level'
import RLP from 'rlp'

const cacheDB = new MemoryLevel()

const { validBlockRlp, invalidBlockRlp } = require('./ethash_block_rlp_tests.json')

tape('Verify POW for valid and invalid blocks', async function (t) {
  const e = new Ethash(cacheDB as any)

  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

  const genesis = Block.fromBlockData({}, { common })
  const genesisResult = await e.verifyPOW(genesis)
  t.ok(genesisResult, 'genesis block should be valid')

  const validRlp = Buffer.from(validBlockRlp, 'hex')
  const validBlock = Block.fromRLPSerializedBlock(validRlp, { common })
  const validBlockResult = await e.verifyPOW(validBlock)
  t.ok(validBlockResult, 'should be valid')

  const invalidRlp = Buffer.from(invalidBlockRlp, 'hex')
  // Put correct amount of extraData in block extraData field so block can be deserialized
  const values = arrToBufArr(RLP.decode(Uint8Array.from(invalidRlp))) as BlockBuffer
  values[0][12] = Buffer.alloc(32)
  const invalidBlock = Block.fromValuesArray(values)
  const invalidBlockResult = await e.verifyPOW(invalidBlock)
  t.ok(!invalidBlockResult, 'should be invalid')

  const testData = require('./block_tests_data.json')
  const blockRlp = toBuffer(testData.blocks[0].rlp)
  const block = Block.fromRLPSerializedBlock(blockRlp, { common })
  const uncleBlockResult = await e.verifyPOW(block)
  t.ok(uncleBlockResult, 'should be valid')
  t.end()
})
