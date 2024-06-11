import { equalsBytes, randomBytes } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import { NODE_WIDTH, VerkleNodeType, decodeNode } from '../src/node/index.js'
import { InternalNode } from '../src/node/internalNode.js'

import type { VerkleCrypto } from '../src/types.js'

describe('verkle node - internal', () => {
  let verkleCrypto: VerkleCrypto
  beforeAll(async () => {
    verkleCrypto = await loadVerkleCrypto()
  })
  it('constructor should create an internal node', async () => {
    const commitment = randomBytes(32)
    const depth = 2
    const node = new InternalNode({ commitment, depth, verkleCrypto })

    assert.equal(node.type, VerkleNodeType.Internal, 'type should be set')
    assert.ok(
      equalsBytes(node.commitment as unknown as Uint8Array, commitment),
      'commitment should be set'
    )
    assert.equal(node.depth, depth, 'depth should be set')

    // Children nodes should all default to null.
    assert.equal(node.children.length, NODE_WIDTH, 'number of children should equal verkle width')
    assert.ok(
      node.children.every((child) => equalsBytes(child.commitment, verkleCrypto.zeroCommitment)),
      'every children should be null'
    )
  })

  it('create method should create an internal node', async () => {
    const depth = 3
    const node = InternalNode.create(depth, verkleCrypto)

    assert.equal(node.type, VerkleNodeType.Internal, 'type should be set')
    assert.deepEqual(
      node.commitment,
      verkleCrypto.zeroCommitment,
      'commitment should be set to point identity'
    )
    assert.equal(node.depth, depth, 'depth should be set')

    // Children nodes should all default to null.
    assert.equal(node.children.length, NODE_WIDTH, 'number of children should equal verkle width')
    assert.ok(
      node.children.every((child) => equalsBytes(child.commitment, verkleCrypto.zeroCommitment)),
      'every children should be null'
    )
  })
  it('should serialize and deserialize a node', async () => {
    const child = {
      commitment: randomBytes(64),
      path: randomBytes(10),
    }
    const children = new Array(256).fill({ commitment: new Uint8Array(64), path: new Uint8Array() })
    children[0] = child
    const node = new InternalNode({
      children,
      verkleCrypto,
      depth: 0,
      commitment: verkleCrypto.zeroCommitment,
    })
    const serialized = node.serialize()
    const decoded = decodeNode(serialized, 0, verkleCrypto)
    assert.deepEqual((decoded as InternalNode).children[0].commitment, child.commitment)
  })
})
