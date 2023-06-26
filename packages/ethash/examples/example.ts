import { bytesToHex } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils.js'
import { Ethash } from '../src/index.js'

const ethash = new Ethash()

// make the 1000 cache items with a seed of 0 * 32
ethash.mkcache(1000, new Uint8Array(32).fill(0))

const result = ethash.run(hexToBytes('test'), Uint8Array.from([0]), 1000)

console.log(bytesToHex(result.hash))
