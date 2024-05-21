import { equalsBytes, hexToBytes, randomBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { VerkleNodeType } from '../src/node/index.js'
import { LeafNode } from '../src/node/leafNode.js'

import type { Point } from '../src/types.js'
import type { PrefixedHexString } from '@ethereumjs/util'

describe('verkle node - leaf', () => {
  it('constructor should create an leaf node', async () => {
    const commitment = randomBytes(32)
    const c1 = randomBytes(32)
    const c2 = randomBytes(32)
    const stem = randomBytes(32)
    const values = [randomBytes(32), randomBytes(32)]
    const depth = 2
    const node = new LeafNode({
      c1: c1 as unknown as Point,
      c2: c2 as unknown as Point,
      commitment,
      depth,
      stem,
      values,
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

  it('create method should create an leaf node', () => {
    const presentKeys = ['0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d01'].map(
      (key) => hexToBytes(key as PrefixedHexString)
    )

    // Corresponding values for the present keys
    const values = ['0x320122e8584be00d000000000000000000000000000000000000000000000000'].map(
      (key) => hexToBytes(key as PrefixedHexString)
    )
    const stem = presentKeys[0].slice(0, 31)
    const nodeData = values
    const node = LeafNode.create(stem, nodeData, 0, new Uint8Array(32))
    assert.ok(node instanceof LeafNode)
  })
})
