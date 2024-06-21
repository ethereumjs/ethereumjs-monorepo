import { concatBytes, hexToBytes, intToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { VerkleLeafType, getKey } from '../src/index.js'

describe('should generate valid tree keys', () => {
  it('should generate valid keys for each VerkleLeafType', () => {
    const stem = hexToBytes('0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d')
    for (const leaf of [
      VerkleLeafType.Version,
      VerkleLeafType.Balance,
      VerkleLeafType.Nonce,
      VerkleLeafType.CodeHash,
      VerkleLeafType.CodeSize,
    ]) {
      const key = getVerkleKey(stem, leaf)
      assert.equal(key.length, 32)
      assert.deepEqual(key, concatBytes(stem, intToBytes(leaf)))
    }
  })
})
