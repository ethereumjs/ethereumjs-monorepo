import { blake3 } from '@noble/hashes/blake3.js'
import { assert, describe, it } from 'vitest'

import { createBinaryTree } from '../src/index.ts'
import { binaryTreeFromProof, createBinaryTreeFromProof } from '../src/proof.ts'

// D-NAME-2: the canonical `createBinaryTreeFromProof` and the legacy (deprecated)
// `binaryTreeFromProof` must build an identical tree from the same proof.
describe('API conventions: binary-tree from-proof constructor alias (D-NAME-2)', () => {
  it('canonical and deprecated from-proof constructors build identical trees', async () => {
    const tree = await createBinaryTree()
    const key = new Uint8Array(32).fill(0)
    key[31] = 7
    const hashedKey = blake3(key)
    const value = new Uint8Array(32).fill(1)
    await tree.put(hashedKey.slice(0, 31), [hashedKey[31]], [value])

    const proof = await tree.createBinaryProof(hashedKey)

    const canonical = await createBinaryTreeFromProof(proof)
    const legacy = await binaryTreeFromProof(proof)

    assert.deepEqual(canonical.root(), legacy.root(), 'both constructors yield the same root')
  })
})
