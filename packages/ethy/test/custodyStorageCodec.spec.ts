import { RLP } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, intToUnpaddedBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { findSlotInKind1Slab, parseProvenCodePairs } from '../src/custody/custodyStorageCodec.ts'

describe('custodyStorageCodec', () => {
  it('findSlotInKind1Slab returns 32-byte value for matching slot hash', () => {
    const slot = new Uint8Array(32)
    slot[31] = 0x0a
    const val = new Uint8Array(32).fill(0xcd)
    const slab = new Uint8Array(64)
    slab.set(slot, 0)
    slab.set(val, 32)
    const out = findSlotInKind1Slab(slab, slot)
    assert.isDefined(out)
    assert.deepEqual(out, val)
  })

  it('parseProvenCodePairs decodes kind-0 PROVEN_STORAGE_OR_CODE payload', () => {
    const code = new Uint8Array([0x60, 0x00])
    const hash = keccak_256(code)
    const payload = RLP.encode([
      bigIntToUnpaddedBytes(9n),
      intToUnpaddedBytes(0),
      [[hash, code]],
    ] as never)
    const decoded = RLP.decode(payload) as unknown[]
    const pairs = parseProvenCodePairs(decoded)
    assert.equal(pairs.length, 1)
    assert.isTrue(pairs[0]![0].every((b, i) => b === hash[i]))
    assert.deepEqual(pairs[0]![1], code)
  })
})
