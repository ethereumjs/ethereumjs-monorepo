import { bytesToHex, equalsBytes, hexToBytes, isHexString, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  BranchMPTNode,
  LeafMPTNode,
  MerklePatriciaTrie,
  createMPTFromProof,
  createMerkleProof,
  verifyMerkleProof,
} from '../../src/index.ts'
import { _walkTrie } from '../../src/util/asyncWalk.ts'
import { bytesToNibbles } from '../../src/util/nibbles.ts'
import { trieTestData } from '../fixtures/trieTest.ts'

import type { PrefixedHexString } from '@ethereumjs/util'

describe('walk the tries from official tests', async () => {
  const testNames = Object.keys(trieTestData.tests) as (keyof typeof trieTestData.tests)[]

  for await (const testName of testNames) {
    const trie = new MerklePatriciaTrie()
    describe(testName, async () => {
      const inputs = trieTestData.tests[testName].in
      const expect = trieTestData.tests[testName].root
      const testKeys: Map<PrefixedHexString, Uint8Array | null> = new Map()
      const testStrings: Map<string, [string, string | null]> = new Map()
      for await (const [idx, input] of inputs.entries()) {
        const stringPair: [string, string] = [inputs[idx][0]!, inputs[idx][1] ?? 'null']
        describe(`put: ${stringPair}`, async () => {
          const processedInput = input.map((item) => {
            if (item === null) {
              return null
            }

            return isHexString(item) ? hexToBytes(item) : utf8ToBytes(item)
          }) as [Uint8Array, Uint8Array | null]

          try {
            await trie.put(processedInput[0], processedInput[1])
            assert(true)
          } catch (e) {
            assert(false, (e as any).message)
          }
          trie.checkpoint()
          await trie.commit()
          trie.flushCheckpoints()
          testKeys.set(bytesToHex(processedInput[0]), processedInput[1])
          testStrings.set(bytesToHex(processedInput[0]), stringPair)
          describe(`should get all keys`, async () => {
            for await (const [key, val] of testKeys.entries()) {
              const retrieved = await trie.get(hexToBytes(key))
              it(`should get ${testStrings.get(key)}`, async () => {
                assert.deepEqual(retrieved, val)
              })
            }
          })
        })
      }
      it(`should have root ${expect}`, async () => {
        assert.strictEqual(bytesToHex(trie.root()), expect)
      })
    })
  }
})

describe('walk a sparse trie', async () => {
  const trie = new MerklePatriciaTrie()
  const inputs = trieTestData.tests.jeff.in
  const expect = trieTestData.tests.jeff.root

  // Build a Trie
  for await (const input of inputs) {
    const processedInput = input.map((item) => {
      if (item === null) {
        return item
      }

      return isHexString(item) ? hexToBytes(item) : utf8ToBytes(item)
    }) as [Uint8Array, Uint8Array | null]

    await trie.put(processedInput[0], processedInput[1])
  }
  // Check the root
  it(`should have root ${expect}`, async () => {
    assert.strictEqual(bytesToHex(trie.root()), expect)
  })
  // Generate a proof for inputs[0]
  const rawProofKey = inputs[0][0] as string
  const proofKey = isHexString(rawProofKey) ? hexToBytes(rawProofKey) : utf8ToBytes(rawProofKey)
  const proof = await createMerkleProof(trie, proofKey)
  assert.isNotNull(await verifyMerkleProof(proofKey, proof))

  // Build a sparse trie from the proof
  const fromProof = await createMPTFromProof(proof, { root: trie.root() })

  // Walk the sparse trie
  const walker = fromProof.walkTrieIterable(fromProof.root())
  let found = 0
  for await (const { currentKey, node } of walker) {
    if (equalsBytes((fromProof as any).hash(node.serialize()), fromProof.root())) {
      // The root of proof trie should be same as original
      assert.deepEqual(fromProof.root(), trie.root())
    }
    if (node instanceof LeafMPTNode) {
      // The only leaf node should be leaf from the proof
      const fullKeyNibbles = [...currentKey, ...node._nibbles]
      assert.deepEqual(fullKeyNibbles, bytesToNibbles(proofKey))
      const rawNodeValue = inputs[0][1] as string
      const nodeValue = isHexString(rawNodeValue)
        ? hexToBytes(rawNodeValue)
        : utf8ToBytes(rawNodeValue)
      assert.deepEqual(node.value(), nodeValue)
    }
    // Count the nodes...nodes from the proof should be only nodes in the trie
    found++
  }
  assert.strictEqual(
    found,
    proof.length,
    `found: ${found} should equal proof length: ${proof.length}`,
  )
  assert.isTrue(true, 'Walking sparse trie should not throw error')

  // Walk the same sparse trie with WalkController
  try {
    await fromProof.walkTrie(fromProof.root(), async (_, node, __, wc) => {
      wc.allChildren(node!)
    })
    assert.fail('Will throw when it meets a missing node in a sparse trie')
  } catch (err) {
    assert.strictEqual((err as any).message, 'Missing node in DB')
  }
})

/**
 * Builds a trie with two 32-byte keys whose first nibble differs (0x0 vs 0xf),
 * so the root is a single BranchMPTNode with exactly two populated slots (0
 * and 15) and fourteen empty ones, each pointing directly to a LeafMPTNode
 * (32-byte keys/values are large enough to avoid raw/embedded child nodes).
 */
async function twoLeafBranchTrie(trie: MerklePatriciaTrie) {
  const key1 = new Uint8Array(32).fill(0)
  key1[31] = 1
  const key2 = new Uint8Array(32).fill(0)
  key2[0] = 0xff
  key2[31] = 2
  const value1 = new Uint8Array(32).fill(0xaa)
  const value2 = new Uint8Array(32).fill(0xbb)
  await trie.put(key1, value1)
  await trie.put(key2, value2)
  return { key1, key2, value1, value2 }
}

describe('branch node child iteration', () => {
  class CountingTrie extends MerklePatriciaTrie {
    lookupCalls = 0
    async lookupNode(node: Uint8Array | Uint8Array[]) {
      this.lookupCalls++
      return super.lookupNode(node)
    }
  }

  it('walks only the populated slots of a branch node, without a DB lookup per empty slot', async () => {
    const trie = new CountingTrie()
    await twoLeafBranchTrie(trie)

    const rootNode = await trie.lookupNode(trie.root())
    assert.instanceOf(rootNode, BranchMPTNode, 'test setup should produce a branch root')

    trie.lookupCalls = 0
    const visited: { node: any; currentKey: number[] }[] = []
    for await (const entry of trie.walkTrieIterable(trie.root())) {
      visited.push(entry)
    }

    assert.strictEqual(visited.length, 3, 'should visit exactly the branch and its two leaves')
    assert.strictEqual(
      trie.lookupCalls,
      3,
      'should call lookupNode once per real node, not once per branch slot (14 of the 16 are empty)',
    )
    const leafNibbles = visited
      .filter((v) => v.node instanceof LeafMPTNode)
      .map((v) => v.currentKey[0])
      .sort((a, b) => a - b)
    assert.deepEqual(leafNibbles, [0, 15], 'should only descend into the two populated slots')
  })
})

describe('trie walk error handling', () => {
  it('silently skips a subtree with a missing node while still walking sibling branches', async () => {
    const trie = new MerklePatriciaTrie()
    const { key1 } = await twoLeafBranchTrie(trie)

    const { node: leaf1 } = await trie.findPath(key1)
    assert.isNotNull(leaf1, 'test setup should find the leaf for key1')
    const leaf1Hash = (trie as any).hash(leaf1!.serialize())
    await (trie as any)._db.del(leaf1Hash) // simulate a pruned/missing node

    const visited: { node: any; currentKey: number[] }[] = []
    for await (const entry of trie.walkTrieIterable(trie.root())) {
      visited.push(entry)
    }

    assert.strictEqual(
      visited.length,
      2,
      'the root branch and the surviving leaf should still be visited',
    )
    assert.isFalse(
      visited.some((v) => v.node instanceof LeafMPTNode && v.currentKey[0] === 0),
      'the pruned leaf should be absent from the results',
    )
    assert.isTrue(
      visited.some((v) => v.node instanceof LeafMPTNode && v.currentKey[0] === 15),
      'the sibling leaf should still be found',
    )
  })

  it('propagates an unexpected (non "Missing node in DB") error instead of swallowing it', async () => {
    const trie = new MerklePatriciaTrie()
    await twoLeafBranchTrie(trie)

    // Patch lookupNode only after the trie is built: `put` uses lookupNode
    // internally, so throwing from construction would fail the test setup
    // rather than the walk itself.
    const originalLookupNode = trie.lookupNode.bind(trie)
    trie.lookupNode = (async (node: Uint8Array | Uint8Array[]) => {
      const result = await originalLookupNode(node)
      if (result instanceof LeafMPTNode) {
        throw new Error('boom')
      }
      return result
    }) as typeof trie.lookupNode

    const visited: { node: any; currentKey: number[] }[] = []
    try {
      for await (const entry of trie.walkTrieIterable(trie.root())) {
        visited.push(entry)
      }
      assert.fail('walk should have thrown the unexpected error')
    } catch (err) {
      assert.strictEqual((err as any).message, 'boom')
    }
    assert.isFalse(
      visited.some((v) => v.node instanceof LeafMPTNode),
      'no leaf should be yielded once an unexpected error aborts the walk',
    )
  })
})

describe('visited set deduplication', () => {
  it('does not yield a node whose hash is already present in the visited set', async () => {
    const trie = new MerklePatriciaTrie()
    await trie.put(utf8ToBytes('key1'), utf8ToBytes('value1'))
    const rootHash = trie.root()
    const rootNode = await trie.lookupNode(rootHash)
    const rootHashHex = bytesToHex((trie as any).hash(rootNode.serialize()))

    const results: { node: any; currentKey: number[] }[] = []
    for await (const entry of _walkTrie.call(
      trie,
      rootHash,
      [],
      undefined,
      undefined,
      new Set<string>([rootHashHex]),
    )) {
      results.push(entry)
    }

    assert.strictEqual(results.length, 0, 'a node already in the visited set should be skipped')
  })
})
