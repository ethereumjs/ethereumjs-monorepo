import { type VerkleCrypto, equalsBytes, randomBytes, setLengthRight } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it } from 'vitest'

import {
  LeafVerkleNodeValue,
  VerkleNodeType,
  createCValues,
  decodeVerkleNode,
  isLeafVerkleNode,
} from '../src/node/index.js'
import { LeafVerkleNode } from '../src/node/leafNode.js'

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
    const node = new LeafVerkleNode({
      c1,
      c2,
      commitment,
      stem,
      values,
      verkleCrypto,
    })

    assert.ok(isLeafVerkleNode(node), 'typeguard should return true')
    assert.equal(node.type, VerkleNodeType.Leaf, 'type should be set')
    assert.ok(
      equalsBytes(node.commitment as unknown as Uint8Array, commitment),
      'commitment should be set',
    )
    assert.ok(equalsBytes(node.c1 as unknown as Uint8Array, c1), 'c1 should be set')
    assert.ok(equalsBytes(node.c2 as unknown as Uint8Array, c2), 'c2 should be set')
    assert.ok(equalsBytes(node.stem, stem), 'stem should be set')
    assert.ok(
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
    const node = await LeafVerkleNode.create(stem, verkleCrypto, values)
    assert.ok(node instanceof LeafVerkleNode)
  })

  it('should create a leafnode with default values', async () => {
    const key = randomBytes(32)
    const node = await LeafVerkleNode.create(key.slice(0, 31), verkleCrypto)
    assert.ok(node instanceof LeafVerkleNode)
    assert.equal(node.getValue(0), undefined)
    node.setValue(0, setLengthRight(Uint8Array.from([5]), 32))
    assert.deepEqual(node.getValue(0), setLengthRight(Uint8Array.from([5]), 32))
    node.setValue(0, LeafVerkleNodeValue.Deleted)
    assert.deepEqual(node.getValue(0), new Uint8Array(32))
  })

  it('should set the leaf marker on a touched value', async () => {
    const key = randomBytes(32)
    const node = await LeafVerkleNode.create(key.slice(0, 31), verkleCrypto)
    node.setValue(0, LeafVerkleNodeValue.Deleted)
    const c1Values = createCValues(node.values.slice(0, 128))
    assert.equal(c1Values[0][16], 1)
  })

  it('should update a commitment when setting a value', async () => {
    const key = randomBytes(32)
    const stem = key.slice(0, 31)
    const node = await LeafVerkleNode.create(stem, verkleCrypto)
    assert.deepEqual(node.c1, verkleCrypto.zeroCommitment)
    node.setValue(0, randomBytes(32))
    assert.notDeepEqual(node.c1, verkleCrypto.zeroCommitment)
  })

  it('should serialize and deserialize a node from raw values', async () => {
    const key = randomBytes(32)
    const stem = key.slice(0, 31)
    const values = new Array<Uint8Array>(256).fill(new Uint8Array(32))
    const node = await LeafVerkleNode.create(stem, verkleCrypto, values)
    const serialized = node.serialize()
    const decodedNode = decodeVerkleNode(serialized, verkleCrypto)

    assert.deepEqual(node, decodedNode)

    const defaultNode = await LeafVerkleNode.create(randomBytes(31), verkleCrypto)

    assert.deepEqual(defaultNode, decodeVerkleNode(defaultNode.serialize(), verkleCrypto))
  })
})
