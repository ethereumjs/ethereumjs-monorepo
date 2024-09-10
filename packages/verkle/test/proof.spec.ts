import { MapDB, bigIntToBytes, hexToBytes, setLengthRight } from '@ethereumjs/util'
import { randomBytes } from 'crypto'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { createVerkleTree } from '../src/constructors.js'
import { LeafNode } from '../src/index.js'

import { createProof, verifyProof } from './util.js'

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
    const valuesArray = new Array<Uint8Array>(256)
    for (let x = 0; x < 256; x++) {
      let value = leafNode.getValue(x)
      if (value === undefined) value = new Uint8Array(32)
      valuesArray[x] = value
    }
    const proof = createProof(verkleCrypto, leafNode.commitment, valuesArray, 1)

    try {
      const result = verifyProof(verkleCrypto, proof, leafNode.commitment, 1, leafNode.getValue(1)!)
      assert.ok(result)
    } catch (err) {
      assert.fail(`Failed to verify proof: ${err}`)
    }
  })
  it('should pass for empty trie', async () => {
    const trie = await createVerkleTree({ verkleCrypto, db: new MapDB() })

    await trie['_createRootNode']()
    const proof = createProof(
      verkleCrypto,
      // Get commitment from root node
      (await trie.findPath(new Uint8Array(31))).stack![0][0].commitment,
      new Array(256).fill(new Uint8Array(32).fill(0)),
      0,
    )
    const res = verifyProof(
      verkleCrypto,
      proof,
      (await trie.findPath(new Uint8Array(31))).stack![0][0].commitment,
      0,
      new Uint8Array(32),
    )
    assert.ok(res)
  })
  it('should verify proof for single leaf node', async () => {
    const node = await LeafNode.create(randomBytes(31), verkleCrypto)
    node.setValue(0, setLengthRight(bigIntToBytes(1n), 32))
    const valuesArray = new Array<Uint8Array>(256)
    for (let x = 0; x < 256; x++) {
      let value = node.getValue(x)
      if (value === undefined) value = new Uint8Array(32)
      valuesArray[x] = value
    }
    console.log(node.commitment)
    const proof = verkleCrypto.createProof([
      {
        serializedCommitment: verkleCrypto.serializeCommitment(node.commitment),
        vector: valuesArray,
        indices: [0],
      },
    ])
    console.log(proof)
    const res = verkleCrypto.verifyProof(proof, [
      {
        serializedCommitment: verkleCrypto.serializeCommitment(node.commitment),
        indexValuePairs: [{ index: 0, value: node.getValue(0)! }],
      },
    ])
    assert.ok(res)
  })
})
