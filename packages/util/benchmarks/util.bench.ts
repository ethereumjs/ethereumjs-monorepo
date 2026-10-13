import {
  bytesToHex,
  ecrecover,
  hashPersonalMessage,
  hexToBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { bench, describe } from 'vitest'

const hexSample = `0x${'cafe1234deadbeef'.repeat(64)}` as `0x${string}`
const bytesSample = hexToBytes(hexSample)
const keccak32 = new Uint8Array(32).fill(7)
const keccak1k = new Uint8Array(1024).fill(9)
const ecHash = hexToBytes('0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28')
const ecR = hexToBytes('0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9')
const ecS = hexToBytes('0x129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66')
const personalMessage = utf8ToBytes('benchmark personal sign message')

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

  bench('util ecrecover', () => {
    ecrecover(ecHash, BigInt(27), ecR, ecS)
  })

  bench('util hashPersonalMessage', () => {
    hashPersonalMessage(personalMessage)
  })
})
