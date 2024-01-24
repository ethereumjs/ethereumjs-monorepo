import { utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { crc32 } from '../src/crc.js'

// Test vectors generated from https://asecuritysite.com/encryption/crc32?word
const TEST_VECTORS: [string, number][] = [
  ['Hello from ethereum', 0xe647a5d1],
  ['typescript is better', 0x7c5aa27e],
]

describe('crc32', () => {
  it('should compute correct checksum', () => {
    for (const [input, expected] of TEST_VECTORS) {
      const checksum = crc32(utf8ToBytes(input))
      assert.equal(checksum, expected)
    }
  })
})
