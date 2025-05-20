import { assert, describe, it } from 'vitest'

import {
  KECCAK256_NULL,
  KECCAK256_NULL_S,
  KECCAK256_RLP,
  KECCAK256_RLP_ARRAY,
  KECCAK256_RLP_ARRAY_S,
  KECCAK256_RLP_S,
  MAX_INTEGER,
  TWO_POW256,
  bytesToHex,
} from '../src/index.ts'

describe('constants', () => {
  it('should match constants', () => {
    assert.strictEqual(
      MAX_INTEGER.toString(16),
      'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    )

    assert.strictEqual(
      TWO_POW256.toString(16),
      '10000000000000000000000000000000000000000000000000000000000000000',
    )

    assert.strictEqual(
      TWO_POW256.toString(16),
      '10000000000000000000000000000000000000000000000000000000000000000',
    )

    assert.strictEqual(
      KECCAK256_NULL_S,
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    )

    assert.strictEqual(
      bytesToHex(KECCAK256_NULL),
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    )

    assert.strictEqual(
      KECCAK256_RLP_ARRAY_S,
      '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
    )

    assert.strictEqual(
      bytesToHex(KECCAK256_RLP_ARRAY),
      '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
    )

    assert.strictEqual(
      KECCAK256_RLP_S,
      '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    )

    assert.strictEqual(
      bytesToHex(KECCAK256_RLP),
      '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    )
  })
})
