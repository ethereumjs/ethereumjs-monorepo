import { createBlockHeaderFromRLP } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Ethash } from '../src/index.ts'
import { getCacheSize, getEpoc, getFullSize } from '../src/util.ts'

import { ethashTests } from './ethash_tests.ts'

const ethash = new Ethash()
const tests = Object.keys(ethashTests) as (keyof typeof ethashTests)[]
const common = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })

describe('POW tests', () => {
  it('should work', async () => {
    for (const key of tests) {
      const test = ethashTests[key]
      const header = createBlockHeaderFromRLP(hexToBytes(`0x${test.header}`), { common })

      const headerHash = ethash.headerHash(header.raw())
      assert.strictEqual(bytesToHex(headerHash), '0x' + test.header_hash, 'generate header hash')

      const epoc = getEpoc(header.number)
      assert.strictEqual(await getCacheSize(epoc), test.cache_size, 'generate cache size')
      assert.strictEqual(await getFullSize(epoc), test.full_size, 'generate full cache size')

      ethash.mkcache(test.cache_size, hexToBytes(`0x${test.seed}`))
      assert.strictEqual(bytesToHex(ethash.cacheHash()), '0x' + test.cache_hash, 'generate cache')

      const r = ethash.run(headerHash, hexToBytes(`0x${test.nonce}`), test.full_size)
      assert.strictEqual(bytesToHex(r.hash), '0x' + test.result, 'generate result')
      assert.strictEqual(bytesToHex(r.mix), '0x' + test.mixHash, 'generate mix hash')
    }
  })
})
