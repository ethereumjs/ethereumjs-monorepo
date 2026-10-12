import { decode, encode } from '@ethereumjs/rlp'
import { bench, describe } from 'vitest'

const buf = (length: number, start = 0) =>
  Uint8Array.from(Array.from({ length }, (_, i) => start + i))

const shortList = Array.from({ length: 128 }, (_, i) => 1024 + i)
const shortListEncoded = encode(shortList)

/** Rough EIP-1559 tx field list (no signature). */
const txSizedList = [
  buf(32, 1),
  buf(32, 2),
  buf(8, 3),
  buf(32, 4),
  buf(32, 5),
  buf(32, 6),
  buf(32, 7),
  buf(32, 8),
  buf(32, 9),
  [],
  [],
  [],
]
const txSizedEncoded = encode(txSizedList)

describe('rlp', () => {
  bench('rlp encode short list', () => {
    encode(shortList)
  })

  bench('rlp decode short list', () => {
    decode(shortListEncoded)
  })

  bench('rlp encode tx-sized list', () => {
    encode(txSizedList)
  })

  bench('rlp decode tx-sized list', () => {
    decode(txSizedEncoded)
  })
})
