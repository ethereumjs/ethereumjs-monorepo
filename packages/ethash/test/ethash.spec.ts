import { createHeaderFromRLP } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'
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
      const header = createHeaderFromRLP(hexToBytes(`0x${test.header}`), { common })

      const headerHash = ethash.headerHash(header.raw())
      assert.equal(bytesToHex(headerHash), '0x' + test.header_hash, 'generate header hash')

      const epoc = getEpoc(header.number)
      assert.equal(await getCacheSize(epoc), test.cache_size, 'generate cache size')
      assert.equal(await getFullSize(epoc), test.full_size, 'generate full cache size')

      ethash.mkcache(test.cache_size, hexToBytes(`0x${test.seed}`))
      assert.equal(bytesToHex(ethash.cacheHash()), '0x' + test.cache_hash, 'generate cache')

      const r = ethash.run(headerHash, hexToBytes(`0x${test.nonce}`), test.full_size)
      assert.equal(bytesToHex(r.hash), '0x' + test.result, 'generate result')
      assert.equal(bytesToHex(r.mix), '0x' + test.mixHash, 'generate mix hash')
    }
  })
})
