import { equalsBytes, randomBytes, setLengthRight } from '@ethereumjs/util'
import * as verkle from 'micro-eth-signer/verkle'
import { assert, describe, it } from 'vitest'

import {
  LeafVerkleNodeValue,
  VerkleNodeType,
  createCValues,
  decodeVerkleNode,
  isLeafVerkleNode,
} from '../src/node/index.ts'
import { LeafVerkleNode } from '../src/node/leafNode.ts'

describe('verkle node - leaf', () => {
  it('constructor should create an leaf node', async () => {
    const commitment = randomBytes(64)
    const c1 = randomBytes(64)
    const c2 = randomBytes(64)
    const stem = randomBytes(32)
    const values = new Array<Uint8Array>(256).fill(randomBytes(32))
    const node = new LeafVerkleNode({
      c1,
      c2,
      commitment,
      stem,
      values,
      verkleCrypto: verkle,
    })

    assert.isTrue(isLeafVerkleNode(node), 'typeguard should return true')
    assert.strictEqual(node.type, VerkleNodeType.Leaf, 'type should be set')
    assert.isTrue(equalsBytes(node.commitment, commitment), 'commitment should be set')
    assert.isTrue(equalsBytes(node.c1!, c1), 'c1 should be set')
    assert.isTrue(equalsBytes(node.c2!, c2), 'c2 should be set')
    assert.isTrue(equalsBytes(node.stem, stem), 'stem should be set')
    assert.isTrue(
      values.every((value, index) => equalsBytes(value, node.values[index] as Uint8Array)),
      'values should be set',
    )
  })

  it('create method should create an leaf node', async () => {
    const key = randomBytes(32)
    const value = randomBytes(32)
    const values = new Array<Uint8Array>(256).fill(new Uint8Array(32))
    values[2] = value
    const stem = key.slice(0, 31)
    const node = await LeafVerkleNode.create(stem, verkle, values)
    assert.instanceOf(node, LeafVerkleNode)
  })

  it('should create a leafnode with default values', async () => {
    const key = randomBytes(32)
    const node = await LeafVerkleNode.create(key.slice(0, 31), verkle)
    assert.instanceOf(node, LeafVerkleNode)
    assert.strictEqual(node.getValue(0), undefined)
    node.setValue(0, setLengthRight(Uint8Array.from([5]), 32))
    assert.deepEqual(node.getValue(0), setLengthRight(Uint8Array.from([5]), 32))
    node.setValue(0, LeafVerkleNodeValue.Deleted)
    assert.deepEqual(node.getValue(0), new Uint8Array(32))
  })

  it('should set the leaf marker on a touched value', async () => {
    const key = randomBytes(32)
    const node = await LeafVerkleNode.create(key.slice(0, 31), verkle)
    node.setValue(0, LeafVerkleNodeValue.Deleted)
    const c1Values = createCValues(node.values.slice(0, 128))
    assert.strictEqual(c1Values[0][16], 1)
  })

  it('should update a commitment when setting a value', async () => {
    const key = randomBytes(32)
    const stem = key.slice(0, 31)
    const node = await LeafVerkleNode.create(stem, verkle)
    const hash = node.hash()
    assert.deepEqual(node.c1, verkle.zeroCommitment)
    node.setValue(0, randomBytes(32))
    assert.notDeepEqual(node.c1, verkle.zeroCommitment)
    assert.notDeepEqual(node.hash(), hash)
    node.setValue(0, LeafVerkleNodeValue.Untouched)
    assert.deepEqual(node.c1, verkle.zeroCommitment)
    assert.deepEqual(node.hash(), hash)
  })

  it('should serialize and deserialize a node from raw values', async () => {
    const key = randomBytes(32)
    const stem = key.slice(0, 31)
    const values = new Array<Uint8Array>(256).fill(new Uint8Array(32))
    const node = await LeafVerkleNode.create(stem, verkle, values)
    const serialized = node.serialize()
    const decodedNode = decodeVerkleNode(serialized, verkle)

    assert.deepEqual(node, decodedNode)

    const defaultNode = await LeafVerkleNode.create(randomBytes(31), verkle)

    assert.deepEqual(defaultNode, decodeVerkleNode(defaultNode.serialize(), verkle))
  })
})
