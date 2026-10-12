import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { bench, describe } from 'vitest'

const hexSample = `0x${'cafe1234deadbeef'.repeat(64)}` as `0x${string}`
const bytesSample = hexToBytes(hexSample)
const keccak32 = new Uint8Array(32).fill(7)
const keccak1k = new Uint8Array(1024).fill(9)

describe('util', () => {
  bench('util hexToBytes', () => {
    hexToBytes(hexSample)
  })

  bench('util bytesToHex', () => {
    bytesToHex(bytesSample)
  })

  bench('util keccak256 32 bytes', () => {
    keccak_256(keccak32)
  })

  bench('util keccak256 1 KiB', () => {
    keccak_256(keccak1k)
  })
})
