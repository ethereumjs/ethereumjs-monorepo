import { MapDB, bytesToHex } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { createVerkleTree } from '../src/constructors.js'

describe('rust-verkle test vectors', () => {
  let verkleCrypto: Awaited<ReturnType<typeof loadVerkleCrypto>>
  beforeAll(async () => {
    verkleCrypto = await loadVerkleCrypto()
  })
  it('should produce the correct commitment', async () => {
    // Test from python implementation - https://github.com/crate-crypto/verkle-trie-ref/blob/483f40c737f27bc8f059870f862cf6c244159cd4/verkle/verkle_test.py#L96
    // It inserts a single value and then verifies that the hash of the root node matches (not the `trie.root` which is a serialized commitment and not the hash)
    const rustKey = Uint8Array.from([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 32,
    ])
    const trie = await createVerkleTree({ verkleCrypto, db: new MapDB() })
    await trie.put(rustKey.slice(0, 31), [rustKey[31]], [rustKey])

    const path = await trie.findPath(rustKey.slice(0, 31))

    assert.equal(
      bytesToHex(path.stack[0][0].hash()),
      '0x029b6c4c8af9001f0ac76472766c6579f41eec84a73898da06eb97ebdab80a09',
    )
  })
})
