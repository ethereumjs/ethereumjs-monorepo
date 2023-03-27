import { BlockHeader } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { Ethash } from '../src'
import { getCacheSize, getEpoc, getFullSize } from '../src/util'

const powTests = require('./ethash_tests.json')

const ethash = new Ethash()
const tests = Object.keys(powTests)
const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

tape('POW tests', async function (t) {
  for (const key of tests) {
    const test = powTests[key]
    const header = BlockHeader.fromRLPSerializedHeader(hexToBytes(test.header), { common })

    const headerHash = ethash.headerHash(header.raw())
    t.equal(bytesToHex(headerHash), test.header_hash, 'generate header hash')

    const epoc = getEpoc(header.number)
    t.equal(await getCacheSize(epoc), test.cache_size, 'generate cache size')
    t.equal(await getFullSize(epoc), test.full_size, 'generate full cache size')

    ethash.mkcache(test.cache_size, hexToBytes(test.seed))
    t.equal(bytesToHex(ethash.cacheHash()), test.cache_hash, 'generate cache')

    const r = ethash.run(headerHash, hexToBytes(test.nonce), test.full_size)
    t.equal(bytesToHex(r.hash), test.result, 'generate result')
    t.equal(bytesToHex(r.mix), test.mixHash, 'generate mix hash')
  }
})
