import { MapDB, bigIntToBytes, hexToBytes, randomBytes, setLengthRight } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { createVerkleTree } from '../src/constructors.js'
import { LeafVerkleNode } from '../src/index.js'

import type { PrefixedHexString, VerkleCrypto } from '@ethereumjs/util'
import type { ProverInput, VerifierInput } from 'verkle-cryptography-wasm'

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
    const trie = await createVerkleTree()

    const keyWithMultipleValues = keys[0].slice(0, 31)
    await trie.put(keyWithMultipleValues, [keys[0][31], keys[1][31]], [values[0], values[1]])
    await trie.put(keys[2].slice(0, 31), [keys[2][31]], [values[2]])
    await trie.put(keys[3].slice(0, 31), [keys[3][31]], [values[3]])

    const path = await trie.findPath(keys[0].slice(0, 31))

    const leafNode = path.node as LeafVerkleNode
    const valuesArray = []
    for (let x = 0; x < 256; x++) {
      let value = leafNode.getValue(x)
      if (value === undefined) value = new Uint8Array(32)
      valuesArray.push(value)
    }
    const proofInput: ProverInput = {
      serializedCommitment: verkleCrypto.serializeCommitment(leafNode.commitment), // serialized (not hashed!) node commitment
      vector: valuesArray, // All values from node
      indices: [1], // Position in values array (aka "z value")
    }

    const proof = verkleCrypto.createProof([proofInput])

    const verificationInput: VerifierInput = {
      serializedCommitment: verkleCrypto.serializeCommitment(leafNode.commitment), // serialized leafNode commitment
      indexValuePairs: [{ index: 1, value: leafNode.getValue(1)! }], // Position in values array (aka "z value")
    }

    try {
      const res = verkleCrypto.verifyProof(proof, [verificationInput])
      assert.ok(res)
    } catch (err) {
      assert.fail(`Failed to verify proof: ${err}`)
    }
  })
  it('should pass for empty trie', async () => {
    const trie = await createVerkleTree({ verkleCrypto, db: new MapDB() })

    const proof = verkleCrypto.createProof([
      {
        // Get commitment from root node
        serializedCommitment: verkleCrypto.serializeCommitment(
          (await trie.findPath(new Uint8Array(31))).stack![0][0].commitment,
        ),
        vector: new Array(256).fill(new Uint8Array(32)),
        indices: [0],
      },
    ])
    const res = verkleCrypto.verifyProof(proof, [
      {
        serializedCommitment: verkleCrypto.serializeCommitment(
          (await trie.findPath(new Uint8Array(31))).stack![0][0].commitment,
        ),
        indexValuePairs: [{ index: 0, value: new Uint8Array(32) }],
      },
    ])
    assert.ok(res)
  })
  it.skip('should verify proof for single leaf node', async () => {
    const node = await LeafVerkleNode.create(randomBytes(31), verkleCrypto)
    node.setValue(0, setLengthRight(bigIntToBytes(1n), 32))
    const valuesArray = new Array<Uint8Array>(256)
    for (let x = 0; x < 256; x++) {
      let value = node.getValue(x)
      if (value === undefined) value = new Uint8Array(32)
      valuesArray[x] = value
    }

    const proof = verkleCrypto.createProof([
      {
        serializedCommitment: verkleCrypto.serializeCommitment(node.commitment),
        vector: valuesArray,
        indices: [0],
      },
    ])

    const res = verkleCrypto.verifyProof(proof, [
      {
        serializedCommitment: verkleCrypto.serializeCommitment(node.commitment),
        indexValuePairs: [{ index: 0, value: node.getValue(0)! }],
      },
    ])
    assert.ok(res)
  })
})
