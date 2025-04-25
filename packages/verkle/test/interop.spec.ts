import { MapDB, bytesToHex } from '@ethereumjs/util'
import * as verkle from 'micro-eth-signer/verkle'
import { assert, describe, it } from 'vitest'

import { createVerkleTree } from '../src/constructors.ts'

describe('rust-verkle test vectors', () => {
  it('should produce the correct commitment', async () => {
    // Test from python implementation
    //https://github.com/crate-crypto/verkle-trie-ref/blob/483f40c737f27bc8f059870f862cf6c244159cd4/verkle/verkle_test.py#L63
    // It inserts a single value and then verifies that the hash of the root node matches (not the `trie.root` which is a serialized commitment and not the hash)
    const key = Uint8Array.from([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 32,
    ])
    const trie = await createVerkleTree({
      verkleCrypto: verkle,
      db: new MapDB(),
    })
    await trie.put(key.slice(0, 31), [key[31]], [key])

    const path = await trie.findPath(key.slice(0, 31))

    assert.strictEqual(
      bytesToHex(path.stack[0][0].hash()),
      '0x029b6c4c8af9001f0ac76472766c6579f41eec84a73898da06eb97ebdab80a09',
    )
    assert.strictEqual(
      bytesToHex(trie.root()),
      '0x6f5e7cfc3a158a64e5718b0d2f18f564171342380f5808f3d2a82f7e7f3c2778',
    )
  })
  it('should produce correct commitments after value updates', async () => {
    // Variant of previous test that puts 0s at a specific key and then updates that value
    // https://github.com/crate-crypto/verkle-trie-ref/blob/483f40c737f27bc8f059870f862cf6c244159cd4/verkle/verkle_test.py#L96
    const key = Uint8Array.from([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 32,
    ])
    const stem = key.slice(0, 31)
    const trie = await createVerkleTree({
      verkleCrypto: verkle,
      db: new MapDB(),
    })
    await trie.put(stem, [key[31]], [new Uint8Array(32)])
    let path = await trie.findPath(stem)
    assert.strictEqual(
      bytesToHex(path.stack[0][0].hash()),
      '0x77a0747bd526d9d9af60bd5665d24d6cb421f5c8e726b1de62f914f3ff9a361c',
    )
    await trie.put(stem, [key[31]], [key])
    path = await trie.findPath(key.slice(0, 31))

    assert.strictEqual(
      bytesToHex(path.stack[0][0].hash()),
      '0x029b6c4c8af9001f0ac76472766c6579f41eec84a73898da06eb97ebdab80a09',
    )
    assert.strictEqual(
      bytesToHex(trie.root()),
      '0x6f5e7cfc3a158a64e5718b0d2f18f564171342380f5808f3d2a82f7e7f3c2778',
    )
  })
})
