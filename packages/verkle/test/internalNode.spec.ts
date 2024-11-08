import { equalsBytes, randomBytes } from '@ethereumjs/util'
import * as verkle from 'micro-eth-signer/verkle'
import { assert, describe, it } from 'vitest'

import {
  NODE_WIDTH,
  VerkleNodeType,
  decodeVerkleNode,
  isInternalVerkleNode,
} from '../src/node/index.js'
import { InternalVerkleNode } from '../src/node/internalNode.js'

describe('verkle node - internal', () => {
  it('constructor should create an internal node', async () => {
    const commitment = randomBytes(32)
    const node = new InternalVerkleNode({ commitment, verkleCrypto: verkle })

    assert.ok(isInternalVerkleNode(node), 'typeguard should return true')
    assert.equal(node.type, VerkleNodeType.Internal, 'type should be set')
    assert.ok(equalsBytes(node.commitment, commitment), 'commitment should be set')

    // Children nodes should all default to null.
    assert.equal(node.children.length, NODE_WIDTH, 'number of children should equal verkle width')
    assert.ok(
      node.children.every((child) => child === null),
      'every children should be null',
    )
  })

  it('create method should create an internal node', async () => {
    const node = InternalVerkleNode.create(verkle)

    assert.equal(node.type, VerkleNodeType.Internal, 'type should be set')
    assert.deepEqual(
      node.commitment,
      verkle.zeroCommitment,
      'commitment should be set to point identity',
    )

    // Children nodes should all default to null.
    assert.equal(node.children.length, NODE_WIDTH, 'number of children should equal verkle width')
    assert.ok(
      node.children.every((child) => child === null),
      'every children should be null',
    )
  })
  it('should serialize and deserialize a node', async () => {
    const child = {
      commitment: randomBytes(64),
      path: randomBytes(10),
    }
    const children = new Array(256).fill({ commitment: new Uint8Array(64), path: new Uint8Array() })
    children[0] = child
    const node = new InternalVerkleNode({
      children,
      verkleCrypto: verkle,
      commitment: verkle.zeroCommitment,
    })
    const serialized = node.serialize()
    const decoded = decodeVerkleNode(serialized, verkle)
    assert.deepEqual((decoded as InternalVerkleNode).children[0]?.commitment, child.commitment)
  })

  it('should serialize and deserialize a node with no children', async () => {
    const node = new InternalVerkleNode({
      verkleCrypto: verkle,
      commitment: verkle.zeroCommitment,
    })
    const serialized = node.serialize()
    const decoded = decodeVerkleNode(serialized, verkle)
    assert.equal((decoded as InternalVerkleNode).children[0], null)
  })
})
