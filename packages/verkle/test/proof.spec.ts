import { MapDB, concatBytes, hexToBytes } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { createVerkleTree } from '../src/constructors.js'

import type { LeafNode } from '../src/index.js'
import type { PrefixedHexString, VerkleCrypto } from '@ethereumjs/util'

describe('lets make proofs', () => {
  let verkleCrypto: VerkleCrypto
  beforeAll(async () => {
    verkleCrypto = await loadVerkleCrypto()
  })
  it.skip('should generate a proof of a specific state root and then verify it', async () => {
    const keys = [
      // Two keys with the same stem but different suffixes
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d01',
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d02',
      // A key with a partially matching stem 0x318d to above 2 keys
      '0x318dfa512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d02',
      // A key with a partially matching stem 0x318dfa51 to above key
      '0x318dfa513b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d02',
    ].map((key) => hexToBytes(key as PrefixedHexString))
    const values = [
      '0x320122e8584be00d000000000000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0x0300000000000000000000000000000000000000000000000000000000000000',
    ].map((key) => hexToBytes(key as PrefixedHexString))
    const trie = await createVerkleTree({
      verkleCrypto,
      db: new MapDB<Uint8Array, Uint8Array>(),
    })

    await trie['_createRootNode']()

    const keyWithMultipleValues = keys[0].slice(0, 31)
    await trie.put(keyWithMultipleValues, [keys[0][31], keys[1][31]], [values[0], values[1]])
    await trie.put(keys[2].slice(0, 31), [keys[2][31]], [values[2]])
    await trie.put(keys[3].slice(0, 31), [keys[3][31]], [values[3]])

    const path = await trie.findPath(keys[0].slice(0, 31))

    const leafNode = path.node! as LeafNode
    let valuesArray = new Uint8Array()
    for (let x = 0; x < 256; x++) {
      let value = leafNode.getValue(x)
      if (value === undefined) value = new Uint8Array(32)
      valuesArray = concatBytes(valuesArray, value)
    }
    const proofInput = concatBytes(
      verkleCrypto.serializeCommitment(leafNode.commitment), // serialized (not hashed!) node commitment
      valuesArray, // All values from node concatenated
      new Uint8Array(1).fill(1), // Position in values array (aka "z value")
      leafNode.getValue(1)!, // Value at position (aka "y value")
    )
    const proof = verkleCrypto.createProof(proofInput)

    const verificationInput = concatBytes(
      proof, // 576 byte proof
      verkleCrypto.serializeCommitment(leafNode.commitment), // serialized leafNode commitment
      new Uint8Array(1).fill(1), // Position in values array (aka "z value")
      leafNode.getValue(1)!, // Value at position (aka "y value")
    )

    try {
      const res = verkleCrypto.verifyProof(verificationInput)
      assert.ok(res)
    } catch (err) {
      assert.fail(`Failed to verify proof: ${err}`)
    }
  })
})
