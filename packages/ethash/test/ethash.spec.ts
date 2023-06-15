import { BlockHeader } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils.js'
import { assert, describe, it } from 'vitest'

import { Ethash } from '../src/index.js'
import { getCacheSize, getEpoc, getFullSize } from '../src/util.js'

const powTests = require('./ethash_tests.json')

const ethash = new Ethash()
const tests = Object.keys(powTests)
const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

describe('POW tests', () => {
  it('should work', async () => {
    for (const key of tests) {
      const test = powTests[key]
      const header = BlockHeader.fromRLPSerializedHeader(hexToBytes(test.header), { common })

      const headerHash = ethash.headerHash(header.raw())
      assert.equal(bytesToHex(headerHash), test.header_hash, 'generate header hash')

      const epoc = getEpoc(header.number)
      assert.equal(await getCacheSize(epoc), test.cache_size, 'generate cache size')
      assert.equal(await getFullSize(epoc), test.full_size, 'generate full cache size')

      ethash.mkcache(test.cache_size, hexToBytes(test.seed))
      assert.equal(bytesToHex(ethash.cacheHash()), test.cache_hash, 'generate cache')

      const r = ethash.run(headerHash, hexToBytes(test.nonce), test.full_size)
      assert.equal(bytesToHex(r.hash), test.result, 'generate result')
      assert.equal(bytesToHex(r.mix), test.mixHash, 'generate mix hash')
    }
  })
})
