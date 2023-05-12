import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { MapDB, toBytes } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { Ethash } from '../src'

import type { BlockBytes } from '@ethereumjs/block'

const cacheDB = new MapDB()

const { validBlockRlp, invalidBlockRlp } = require('./ethash_block_rlp_tests.json')

tape('Verify POW for valid and invalid blocks', async function (t) {
  const e = new Ethash(cacheDB as any)

  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

  const genesis = Block.fromBlockData({}, { common })
  const genesisResult = await e.verifyPOW(genesis)
  t.ok(genesisResult, 'genesis block should be valid')

  const validRlp = hexToBytes(validBlockRlp)
  const validBlock = Block.fromRLPSerializedBlock(validRlp, { common })
  const validBlockResult = await e.verifyPOW(validBlock)
  t.ok(validBlockResult, 'should be valid')

  const invalidRlp = hexToBytes(invalidBlockRlp)
  // Put correct amount of extraData in block extraData field so block can be deserialized
  const values = RLP.decode(Uint8Array.from(invalidRlp)) as BlockBytes
  values[0][12] = new Uint8Array(32)
  const invalidBlock = Block.fromValuesArray(values, { common })
  const invalidBlockResult = await e.verifyPOW(invalidBlock)
  t.ok(!invalidBlockResult, 'should be invalid')

  const testData = require('./block_tests_data.json')
  const blockRlp = toBytes(testData.blocks[0].rlp)
  const block = Block.fromRLPSerializedBlock(blockRlp, { common })
  const uncleBlockResult = await e.verifyPOW(block)
  t.ok(uncleBlockResult, 'should be valid')
  t.end()
})
