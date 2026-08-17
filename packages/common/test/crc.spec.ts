import { utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { crc32 } from '../src/crc.ts'

// Test vectors generated from https://asecuritysite.com/encryption/crc32?word
const TEST_VECTORS: [string, number][] = [
  ['Hello from ethereum', 0xe647a5d1],
  ['typescript is better', 0x7c5aa27e],
]

describe('[Common/CRC]: crc32', () => {
  it('crc32() computes correct checksum', () => {
    for (const [input, expected] of TEST_VECTORS) {
      const checksum = crc32(utf8ToBytes(input))
      assert.strictEqual(checksum, expected)
    }
  })

  it('crc32() returns zero for empty input', () => {
    assert.strictEqual(crc32(new Uint8Array()), 0)
  })
})
