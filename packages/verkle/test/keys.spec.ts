import { concatBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { getKey, leafType } from '../src/index.js'

describe('should generate valid tree keys', () => {
  it('should generate valid keys for each leafType', () => {
    const stem = hexToBytes('0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d')
    for (const leaf of [
      leafType.version,
      leafType.balance,
      leafType.nonce,
      leafType.codeKeccak,
      leafType.codeSize,
    ]) {
      const key = getKey(stem, leaf)
      assert.equal(key.length, 32)
      assert.deepEqual(key, concatBytes(stem, Uint8Array.from([leaf])))
    }
  })
})
