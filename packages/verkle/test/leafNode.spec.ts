import { equalsBytes, randomBytes } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { VerkleNodeType } from '../src/node/index.js'
import { LeafNode } from '../src/node/leafNode.js'

import type { VerkleCrypto } from '../src/types.js'

describe('verkle node - leaf', () => {
  let verkleCrypto = undefined as never as VerkleCrypto
  beforeAll(async () => {
    verkleCrypto = await loadVerkleCrypto()
  })
  it('constructor should create an leaf node', async () => {
    const commitment = randomBytes(64)
    const c1 = randomBytes(64)
    const c2 = randomBytes(64)
    const stem = randomBytes(32)
    const values = new Array<Uint8Array>(256).fill(randomBytes(32))

    const depth = 2
    const node = new LeafNode({
      c1,
      c2,
      commitment,
      depth,
      stem,
      values,
      verkleCrypto,
    })

    assert.equal(node.type, VerkleNodeType.Leaf, 'type should be set')
    assert.ok(
      equalsBytes(node.commitment as unknown as Uint8Array, commitment),
      'commitment should be set'
    )
    assert.ok(equalsBytes(node.c1 as unknown as Uint8Array, c1), 'c1 should be set')
    assert.ok(equalsBytes(node.c2 as unknown as Uint8Array, c2), 'c2 should be set')
    assert.ok(equalsBytes(node.stem, stem), 'stem should be set')
    assert.ok(
      values.every((value, index) => equalsBytes(value, node.values[index])),
      'values should be set'
    )
    assert.equal(node.depth, depth, 'depth should be set')
  })

  it('create method should create an leaf node', async () => {
    const key = randomBytes(32)
    const value = randomBytes(32)
    const values = new Array<Uint8Array>(256).fill(new Uint8Array(32))
    values[2] = value
    const stem = key.slice(0, 31)
    const node = await LeafNode.create(stem, values, 0, verkleCrypto)
    assert.ok(node instanceof LeafNode)
  })

  it('should update a commitment when setting a value', async () => {
    const key = randomBytes(32)
    const stem = key.slice(0, 31)
    const values = new Array<Uint8Array>(256).fill(new Uint8Array(32))
    const node = await LeafNode.create(stem, values, 0, verkleCrypto)
    assert.deepEqual(node.c1, verkleCrypto.zeroCommitment)
    node.setValue(0, randomBytes(32))
    assert.notDeepEqual(node.c1, verkleCrypto.zeroCommitment)
  })
})
