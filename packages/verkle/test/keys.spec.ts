import { concatBytes, hexToBytes, intToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { LeafType, getKey } from '../src/index.js'

describe('should generate valid tree keys', () => {
  it('should generate valid keys for each LeafType', () => {
    const stem = hexToBytes('0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d')
    for (const leaf of [
      LeafType.Version,
      LeafType.Balance,
      LeafType.Nonce,
      LeafType.CodeHash,
      LeafType.CodeSize,
    ]) {
      const key = getKey(stem, leaf)
      assert.equal(key.length, 32)
      assert.deepEqual(key, concatBytes(stem, intToBytes(leaf)))
    }
  })
})
