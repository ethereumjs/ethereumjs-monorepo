import { bytesToHex as nobleB2H, hexToBytes as nobleH2B } from 'ethereum-cryptography/utils'
import { bench, describe } from 'vitest'

import { bytesToHex, hexToBytes, randomBytes } from '../src/bytes.js'

describe.skip('h2b benchmarks', () => {
  bench('noble', () => {
    nobleH2B('0123456789abcdef')
  })
  bench('ethjs', () => {
    hexToBytes('0x0123456789abcdef')
  })
})

describe('b2h benchmarks', () => {
  const bytes = randomBytes(32)
  bench('noble', () => {
    nobleB2H(bytes)
  })
  bench('ethjs', () => {
    bytesToHex(bytes)
  })
})
