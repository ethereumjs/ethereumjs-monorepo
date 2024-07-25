import { bytesToHex, hexToBytes } from '@ethereumjs/util'

import { Ethash } from '../dist/cjs/index.js'

const ethash = new Ethash()

// make the 1000 cache items with a seed of 0 * 32
ethash.mkcache(1000, new Uint8Array(32).fill(0))

const result = ethash.run(hexToBytes('0xaabb'), Uint8Array.from([0]), 1000)

console.log(bytesToHex(result.hash))
