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

function processTrieInput(input: (string | null)[]) {
  return input.map((item) => {
    if (item === null) {
      return null
    }
    return isHexString(item) ? hexToBytes(item) : utf8ToBytes(item)
  }) as [Uint8Array, Uint8Array | null]
}

describe('[MPT/Util/asyncWalk]: official vectors with checkpointed puts', () => {
  const testNames = Object.keys(trieTestData.tests) as (keyof typeof trieTestData.tests)[]

  for (const testName of testNames) {
    it(`${testName}: gets and root after incremental checkpointed puts`, async () => {
      const trie = new MerklePatriciaTrie()
      const inputs = trieTestData.tests[testName].in
      const expectedRoot = trieTestData.tests[testName].root
      const testKeys = new Map<PrefixedHexString, Uint8Array | null>()

      for (const input of inputs) {
        const [key, value] = processTrieInput(input)
        await trie.put(key, value)
        trie.checkpoint()
        await trie.commit()
        trie.flushCheckpoints()
        testKeys.set(bytesToHex(key), value)
      }

      for (const [keyHex, expectedValue] of testKeys.entries()) {
        const retrieved = await trie.get(hexToBytes(keyHex))
        assert.deepEqual(retrieved, expectedValue, `get ${keyHex}`)
      }
      assert.strictEqual(bytesToHex(trie.root()), expectedRoot)
    })
  }
})

describe('[MPT/Util/asyncWalk]: walk a sparse trie', () => {
  it('walks a proof-built trie and matches jeff root', async () => {
    const trie = new MerklePatriciaTrie()
    const inputs = trieTestData.tests.jeff.in
    const expectedRoot = trieTestData.tests.jeff.root

    for (const input of inputs) {
      const [key, value] = processTrieInput(input)
      await trie.put(key, value)
    }
    assert.strictEqual(bytesToHex(trie.root()), expectedRoot)

    const rawProofKey = inputs[0][0] as string
    const proofKey = isHexString(rawProofKey) ? hexToBytes(rawProofKey) : utf8ToBytes(rawProofKey)
    const proof = await createMerkleProof(trie, proofKey)
    assert.isNotNull(await verifyMerkleProof(proofKey, proof))

    const fromProof = await createMPTFromProof(proof, { root: trie.root() })
    const walker = fromProof.walkTrieIterable(fromProof.root())
    let found = 0
    for await (const { currentKey, node } of walker) {
      if (equalsBytes((fromProof as any).hash(node.serialize()), fromProof.root())) {
        assert.deepEqual(fromProof.root(), trie.root())
      }
      if (node instanceof LeafMPTNode) {
        const fullKeyNibbles = [...currentKey, ...node._nibbles]
        assert.deepEqual(fullKeyNibbles, bytesToNibbles(proofKey))
        const rawNodeValue = inputs[0][1] as string
        const nodeValue = isHexString(rawNodeValue)
          ? hexToBytes(rawNodeValue)
          : utf8ToBytes(rawNodeValue)
        assert.deepEqual(node.value(), nodeValue)
      }
      found++
    }
    assert.strictEqual(
      found,
      proof.length,
      `found: ${found} should equal proof length: ${proof.length}`,
    )
  })

  it('walkTrie throws Missing node in DB on sparse trie', async () => {
    const trie = new MerklePatriciaTrie()
    for (const input of trieTestData.tests.jeff.in) {
      const [key, value] = processTrieInput(input)
      await trie.put(key, value)
    }
    const rawProofKey = trieTestData.tests.jeff.in[0][0] as string
    const proofKey = isHexString(rawProofKey) ? hexToBytes(rawProofKey) : utf8ToBytes(rawProofKey)
    const proof = await createMerkleProof(trie, proofKey)
    const fromProof = await createMPTFromProof(proof, { root: trie.root() })

    try {
      await fromProof.walkTrie(fromProof.root(), async (_, node, __, wc) => {
        wc.allChildren(node!)
      })
      assert.fail('walkTrie should throw on missing node in sparse trie')
    } catch (e: unknown) {
      assert.match((e as Error).message, /Missing node in DB/)
    }
  })
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

/** Counts calls to lookupNode, i.e. how many times the walk actually hit the DB. */
class CountingTrie extends MerklePatriciaTrie {
  lookupCalls = 0
  async lookupNode(node: Uint8Array | Uint8Array[]) {
    this.lookupCalls++
    return super.lookupNode(node)
  }
}

describe('[MPT/Util/asyncWalk]: branch node child iteration', () => {
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

describe('[MPT/Util/asyncWalk]: trie walk error handling', () => {
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
    } catch (e: unknown) {
      assert.match((e as Error).message, /boom/)
    }
    assert.isFalse(
      visited.some((v) => v.node instanceof LeafMPTNode),
      'no leaf should be yielded once an unexpected error aborts the walk',
    )
  })
})

describe('[MPT/Util/asyncWalk]: visited set deduplication', () => {
  it('skips both yielding and looking up a node whose hash is already in the visited set', async () => {
    const trie = new CountingTrie()
    await trie.put(utf8ToBytes('key1'), utf8ToBytes('value1'))
    const rootHash = trie.root()

    trie.lookupCalls = 0
    const results: { node: any; currentKey: number[] }[] = []
    for await (const entry of _walkTrie.call(
      trie,
      rootHash,
      [],
      undefined,
      undefined,
      new Set<string>([bytesToHex(rootHash)]),
    )) {
      results.push(entry)
    }

    assert.strictEqual(results.length, 0, 'a node already in the visited set should be skipped')
    assert.strictEqual(
      trie.lookupCalls,
      0,
      'a node already in the visited set should not trigger a lookupNode/DB read',
    )
  })
})
