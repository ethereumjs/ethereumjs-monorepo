import { MapDB, equalsBytes, hexToBytes, matchingBytesLength } from '@ethereumjs/util'
import * as verkle from 'micro-eth-signer/verkle'
import { assert, describe, it } from 'vitest'

import {
  InternalVerkleNode,
  LeafVerkleNode,
  LeafVerkleNodeValue,
  VerkleNodeType,
  createVerkleTree,
  decodeVerkleNode,
} from '../src/index.ts'

import type { PrefixedHexString } from '@ethereumjs/util'
import type { VerkleNode } from '../src/index.ts'

describe('Verkle tree', () => {
  it('should instantiate with verkle crypto and a MapDB if no options are provided', async () => {
    const tree = await createVerkleTree()
    assert.instanceOf(tree['_db'].db, MapDB)
    assert.isDefined(tree['verkleCrypto'])
  })

  it('should not destroy a previous root', async () => {
    const tree = await createVerkleTree({ useRootPersistence: true })
    await tree.put(
      hexToBytes('0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d'),
      [0],
      [hexToBytes('0x01')],
    )
    const root = tree.root()

    const tree2 = await createVerkleTree({
      verkleCrypto: tree['verkleCrypto'],
      db: tree['_db'].db,
      useRootPersistence: true,
      root,
    })
    assert.deepEqual(tree2.root(), root)
  })

  it('should insert and retrieve values', async () => {
    // Testdata based on https://github.com/gballet/go-ethereum/blob/kaustinen-with-shapella/trie/verkle_test.go
    const presentKeys = [
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d01',
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d02',
      '0x318dfa512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d02',
      '0x318dfa513b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d02',
      '0xe6ed6c222e3985050b4fc574b136b0a42c63538e9ab970995cd418ba8e526400',
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d02',
      '0x18fb432d3b859ec3a1803854e8cceea75d092e52d0d4a4398d13022496745a02',
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d02',
      '0x18fb432d3b859ec3a1803854e8cceea75d092e52d0d4a4398d13022496745a04',
      '0xe6ed6c222e3985050b4fc574b136b0a42c63538e9ab970995cd418ba8e526402',
      '0xe6ed6c222e3985050b4fc574b136b0a42c63538e9ab970995cd418ba8e526403',
      '0x18fb432d3b859ec3a1803854e8cceea75d092e52d0d4a4398d13022496745a00',
      '0x18fb432d3b859ec3a1803854e8cceea75d092e52d0d4a4398d13022496745a03',
      '0xe6ed6c222e3985050b4fc574b136b0a42c63538e9ab970995cd418ba8e526401',
      '0xe6ed6c222e3985050b4fc574b136b0a42c63538e9ab970995cd418ba8e526404',
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d00',
      '0x18fb432d3b859ec3a1803854e8cceea75d092e52d0d4a4398d13022496745a01',
    ].map((key) => hexToBytes(key as PrefixedHexString))

    // Corresponding values for the present keys
    const values = [
      '0x320122e8584be00d000000000000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0x0300000000000000000000000000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      '0x1bc176f2790c91e6000000000000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0xe703000000000000000000000000000000000000000000000000000000000000',
      '0xe703000000000000000000000000000000000000000000000000000000000000',
      '0xe703000000000000000000000000000000000000000000000000000000000000',
      '0xe703000000000000000000000000000000000000000000000000000000000000',
      '0xe703000000000000000000000000000000000000000000000000000000000000',
    ].map((key) => hexToBytes(key as PrefixedHexString))

    const absentKeys = [
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d03',
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d04',
    ].map((key) => hexToBytes(key as PrefixedHexString))

    const tree = await createVerkleTree({
      verkleCrypto: verkle,
    })

    const res = await tree.findPath(presentKeys[0])

    assert.isNull(res.node, 'should not find a node when the key is not present')
    assert.deepEqual(res.remaining, presentKeys[0])

    for (let i = 0; i < presentKeys.length; i++) {
      await tree.put(presentKeys[i].slice(0, 31), [presentKeys[i][31]], [values[i]])
    }
    const stem = presentKeys[0].slice(0, 31)
    const retrievedValues = await tree.get(stem, [presentKeys[0][31], presentKeys[1][31]])
    assert.deepEqual(retrievedValues[0], values[0])
    assert.deepEqual(retrievedValues[1], values[1])
    for (let i = 2; i < presentKeys.length; i++) {
      const retrievedValue = await tree.get(presentKeys[i].slice(0, 31), [presentKeys[i][31]])
      if (retrievedValue === undefined) {
        assert.fail('Value not found')
      }
      assert.isTrue(equalsBytes(retrievedValue[0]!, values[i]))
    }

    // Verify that findPath returns a path that demonstrates the nonexistence of a key
    // by returning a stack where the last node is a leaf node
    // with a different stem than the one passed to `findPath`
    const pathToNonExistentNode = await tree.findPath(absentKeys[0])
    assert.strictEqual(pathToNonExistentNode.node, null)
    assert.deepEqual(
      verkle.serializeCommitment(pathToNonExistentNode.stack[0][0].commitment),
      tree.root(),
      'contains the root node in the stack',
    )
  })

  it('should find the path to various leaf nodes', async () => {
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
    const trie = await createVerkleTree({ verkleCrypto: verkle })

    let putStack: [Uint8Array, VerkleNode][] = []
    const stem1 = keys[0].slice(0, 31)
    // Create first leaf node
    const leafNode1 = await LeafVerkleNode.create(stem1, verkle)

    leafNode1.setValue(keys[0][31], values[0])
    leafNode1.setValue(keys[1][31], values[1])

    putStack.push([leafNode1.hash(), leafNode1])

    // Pull root node from DB
    const rawNode = await trie['_db'].get(trie.root())
    const rootNode = decodeVerkleNode(rawNode!, verkle) as InternalVerkleNode
    // Update root node with commitment from leaf node
    rootNode.setChild(stem1[0], {
      commitment: leafNode1.commitment,
      path: stem1,
    })
    trie.root(verkle.serializeCommitment(rootNode.commitment))
    putStack.push([trie.root(), rootNode])
    await trie.saveStack(putStack)

    // Verify that path to leaf node can be found from stem
    const res = await trie.findPath(stem1)
    assert.deepEqual(res.node?.commitment, leafNode1.commitment)

    // Retrieve a value from the leaf node
    const val1 = await trie.get(keys[1].slice(0, 31), [keys[1][31]])
    assert.deepEqual(val1[0], values[1])

    // Put a second leaf node in the tree with a partially matching stem
    putStack = []
    const stem2 = keys[2].slice(0, 31)

    // Find path to closest node in tree
    const foundPath = await trie.findPath(stem2)

    // Confirm node with stem2 doesn't exist in trie
    assert.strictEqual(foundPath.node, null)

    // Create new leaf node
    const leafNode2 = await LeafVerkleNode.create(stem2, verkle)
    leafNode2.setValue(keys[2][31], values[2])
    putStack.push([leafNode2.hash(), leafNode2])

    const nearestNode = foundPath.stack.pop()![0]
    // Verify that another leaf node is "nearest" node
    assert.strictEqual(nearestNode.type, VerkleNodeType.Leaf)
    assert.deepEqual((nearestNode as LeafVerkleNode).getValue(2), values[1])

    // Compute the portion of stem1 and stem2 that match (i.e. the partial path closest to stem2)
    const partialMatchingStemIndex = matchingBytesLength(stem1, stem2)
    // Find the path to the new internal node (the matching portion of stem1 and stem2)
    const internalNode1Path = stem1.slice(0, partialMatchingStemIndex)
    // Create new internal node
    const internalNode1 = InternalVerkleNode.create(verkle)

    // Update the child references for leafNode1 and leafNode 2
    internalNode1.setChild(stem1[partialMatchingStemIndex], {
      commitment: nearestNode.commitment,
      path: (nearestNode as LeafVerkleNode).stem,
    })
    internalNode1.setChild(stem2[partialMatchingStemIndex], {
      commitment: leafNode2.commitment,
      path: stem2,
    })

    putStack.push([internalNode1.hash(), internalNode1])
    // Update rootNode child reference for internal node 1

    const rootNodeFromPath = foundPath.stack.pop()![0] as InternalVerkleNode
    // Confirm node from findPath matches root
    assert.deepEqual(rootNodeFromPath, rootNode)
    rootNodeFromPath.setChild(internalNode1Path[0], {
      commitment: internalNode1.commitment,
      path: internalNode1Path,
    })
    trie.root(verkle.serializeCommitment(rootNodeFromPath.commitment))
    putStack.push([trie.root(), rootNodeFromPath])
    await trie.saveStack(putStack)
    let res2 = await trie.findPath(stem1)

    assert.strictEqual(res2.remaining.length, 0, 'confirm full path was found')
    assert.strictEqual(res2.stack.length, 2, 'confirm node is at depth 2')
    res2 = await trie.findPath(stem2)
    assert.strictEqual(res2.remaining.length, 0, 'confirm full path was found')
    assert.strictEqual(res2.stack.length, 2, 'confirm node is at depth 2')
    const val2 = await trie.get(keys[2].slice(0, 31), [keys[2][31]])
    assert.deepEqual(val2[0], values[2], 'confirm values[2] can be retrieved from trie')
  })

  it('should sequentially put->find->delete->put values', async () => {
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
    const trie = await createVerkleTree({ verkleCrypto: verkle })

    const keyWithMultipleValues = keys[0].slice(0, 31)
    await trie.put(keyWithMultipleValues, [keys[0][31], keys[1][31]], [values[0], values[1]])
    await trie.put(keys[2].slice(0, 31), [keys[2][31]], [values[2]])
    await trie.put(keys[3].slice(0, 31), [keys[3][31]], [values[3]])
    assert.deepEqual((await trie.get(keys[0].slice(0, 31), [keys[0][31]]))[0], values[0])
    assert.deepEqual((await trie.get(keys[2].slice(0, 31), [keys[2][31]]))[0], values[2])
    assert.deepEqual((await trie.get(keys[3].slice(0, 31), [keys[3][31]]))[0], values[3])

    await trie.del(keys[0].slice(0, 31), [keys[0][31]])
    assert.deepEqual((await trie.get(keys[0].slice(0, 31), [keys[0][31]]))[0], new Uint8Array(32))

    await trie.put(keys[0].slice(0, 31), [keys[0][31]], [values[0]])
    assert.deepEqual((await trie.get(keys[0].slice(0, 31), [keys[0][31]]))[0], values[0])
  })
  it('should put zeros in leaf node when del called with stem that was not in the trie before', async () => {
    const keys = [hexToBytes('0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d01')]

    const trie = await createVerkleTree({ verkleCrypto: verkle })

    assert.deepEqual(await trie.get(keys[0].slice(0, 31), [keys[0][31]]), [])

    await trie.del(keys[0].slice(0, 31), [keys[0][31]])
    const res = await trie.findPath(keys[0].slice(0, 31))
    assert.isNotNull(res.node)
    assert.deepEqual((res.node as LeafVerkleNode).values[keys[0][31]], LeafVerkleNodeValue.Deleted)
  })
  it('should remove null child nodes and roots should match', async () => {
    const keys = [
      // Two keys with the same stem but different suffixes
      '0x318dea512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d01',
      // A key with a partially matching stem 0x318d to above 2 keys
      '0x318dfa512b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d02',
      // A key with a partially matching stem 0x318dfa51 to above key
      '0x318dfa513b6f3237a2d4763cf49bf26de3b617fb0cabe38a97807a5549df4d02',
    ].map((key) => hexToBytes(key as PrefixedHexString))
    const values = [
      '0x320122e8584be00d000000000000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000000000000000000000000001',
    ].map((key) => hexToBytes(key as PrefixedHexString))
    const trie = await createVerkleTree({ verkleCrypto: verkle })
    await trie.put(keys[0].slice(0, 31), [keys[0][31]], [values[0]])
    await trie.put(keys[1].slice(0, 31), [keys[1][31]], [values[1]])
    const root2 = trie.root()
    await trie.put(keys[2].slice(0, 31), [keys[2][31]], [values[1]])

    await trie.put(keys[2].slice(0, 31), [keys[2][31]], [LeafVerkleNodeValue.Untouched])

    assert.deepEqual(trie.root(), root2)
  })
})
