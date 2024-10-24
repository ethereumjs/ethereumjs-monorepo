import { bytesToHex, equalsBytes, hexToBytes, isHexString, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  LeafMPTNode,
  MerklePatriciaTrie,
  createMPTFromProof,
  createMerkleProof,
  verifyMerkleProof,
} from '../../src/index.js'
import { _walkTrie } from '../../src/util/asyncWalk.js'
import { bytesToNibbles } from '../../src/util/nibbles.js'
import { trieTestData } from '../fixtures/trieTest.js'

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
        assert.equal(bytesToHex(trie.root()), expect)
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
    assert.equal(bytesToHex(trie.root()), expect)
  })
  // Generate a proof for inputs[0]
  const rawProofKey = inputs[0][0] as string
  const proofKey = isHexString(rawProofKey) ? hexToBytes(rawProofKey) : utf8ToBytes(rawProofKey)
  const proof = await createMerkleProof(trie, proofKey)
  assert.ok(await verifyMerkleProof(proofKey, proof))

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
  assert.equal(found, proof.length, `found: ${found} should equal proof length: ${proof.length}`)
  assert.ok(true, 'Walking sparse trie should not throw error')

  // Walk the same sparse trie with WalkController
  try {
    await fromProof.walkTrie(fromProof.root(), async (_, node, __, wc) => {
      wc.allChildren(node!)
    })
    assert.fail('Will throw when it meets a missing node in a sparse trie')
  } catch (err) {
    assert.equal((err as any).message, 'Missing node in DB')
  }
})
