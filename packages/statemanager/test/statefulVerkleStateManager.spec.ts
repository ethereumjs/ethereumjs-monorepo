import { VerkleTree } from '@ethereumjs/verkle'
import { describe, it } from 'vitest'

import { StatefulVerkleStateManager } from '../src/statefulVerkleStateManager.js'

import type { PrefixedHexString } from '@ethereumjs/util'

describe('Verkle Tree API tests', () => {
  it('should get an account from the trie', async () => {
    const trie = await VerkleTree.create()
    const sm = new StatefulVerkleStateManager({ trie, verkleCrypto: trie['verkleCrypto'] })
    const accountKeys = [
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d00',
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d01',
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d02',
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d03',
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d04',
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d05',
    ] as PrefixedHexString[]
  })
})
