import { bench, describe } from 'vitest'

import { bytesToHex, hexToBytes } from '../../src/bytes.ts'

// Simple benchmarks for our bytes conversion utility
describe('hexToBytes', () => {
  bench('hexToBytes', () => {
    hexToBytes('0xcafe1234')
  })
})

describe('bytesToHex', () => {
  const bytes = new Uint8Array(4).fill(4)
  bench('bytesToHex', () => {
    bytesToHex(bytes)
  })
})
