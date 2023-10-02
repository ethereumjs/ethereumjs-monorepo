import { equalsBytes, randomBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { NODE_WIDTH, VerkleNodeType } from '../../src/node/index.js'
import { InternalNode } from '../../src/node/internalNode.js'
import { POINT_IDENTITY } from '../../src/util/crypto.js'

describe('verkle node - internal', () => {
  it('constructor should create an internal node', async () => {
    const commitment = randomBytes(32)
    const depth = 2
    const node = new InternalNode({ commitment, depth })

    assert.equal(node.type, VerkleNodeType.Internal, 'type should be set')
    assert.ok(equalsBytes(node.commitment, commitment), 'commitment should be set')
    assert.equal(node.depth, depth, 'depth should be set')

    // Children nodes should all default to null.
    assert.equal(node.children.length, NODE_WIDTH, 'number of children should equal verkle width')
    assert.ok(
      node.children.every((child) => child === null),
      'every children should be null'
    )
  })

  it('create method should create an internal node', async () => {
    const depth = 3
    const node = InternalNode.create(depth)

    assert.equal(node.type, VerkleNodeType.Internal, 'type should be set')
    assert.ok(
      equalsBytes(node.commitment, POINT_IDENTITY),
      'commitment should be set to point identity'
    )
    assert.equal(node.depth, depth, 'depth should be set')

    // Children nodes should all default to null.
    assert.equal(node.children.length, NODE_WIDTH, 'number of children should equal verkle width')
    assert.ok(
      node.children.every((child) => child === null),
      'every children should be null'
    )
  })
})
