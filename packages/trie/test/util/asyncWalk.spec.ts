import { bytesToHex, equalsBytes, hexToBytes, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  LeafNode,
  Trie,
  createProof,
  createTrieFromProof,
  verifyTrieProof,
} from '../../src/index.js'
import { _walkTrie } from '../../src/util/asyncWalk.js'
import { bytesToNibbles } from '../../src/util/nibbles.js'
import trieTests from '../fixtures/trietest.json'

import type { PrefixedHexString } from '@ethereumjs/util'

describe('walk the tries from official tests', async () => {
  const testNames = Object.keys(trieTests.tests)

  for await (const testName of testNames) {
    const trie = new Trie()
    describe(testName, async () => {
      const inputs = (trieTests as any).tests[testName].in
      const expect = (trieTests as any).tests[testName].root
      const testKeys: Map<PrefixedHexString, Uint8Array | null> = new Map()
      const testStrings: Map<string, [string, string | null]> = new Map()
      for await (const [idx, input] of inputs.entries()) {
        const stringPair: [string, string] = [inputs[idx][0], inputs[idx][1] ?? 'null']
        describe(`put: ${stringPair}`, async () => {
          for (let i = 0; i < 2; i++) {
            if (typeof input[i] === 'string' && input[i].slice(0, 2) === '0x') {
              input[i] = hexToBytes(input[i])
            } else if (typeof input[i] === 'string') {
              input[i] = utf8ToBytes(input[i])
            }
          }
          try {
            await trie.put(input[0], input[1])
            assert(true)
          } catch (e) {
            assert(false, (e as any).message)
          }
          trie.checkpoint()
          await trie.commit()
          trie.flushCheckpoints()
          testKeys.set(bytesToHex(input[0]), input[1])
          testStrings.set(bytesToHex(input[0]), stringPair)
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
  const trie = new Trie()
  const inputs = (trieTests as any).tests.jeff.in
  const expect = (trieTests as any).tests.jeff.root

  // Build a Trie
  for await (const input of inputs) {
    for (let i = 0; i < 2; i++) {
      if (typeof input[i] === 'string' && input[i].slice(0, 2) === '0x') {
        input[i] = hexToBytes(input[i])
      } else if (typeof input[i] === 'string') {
        input[i] = utf8ToBytes(input[i])
      }
    }
    await trie.put(input[0], input[1])
  }
  // Check the root
  it(`should have root ${expect}`, async () => {
    assert.equal(bytesToHex(trie.root()), expect)
  })
  // Generate a proof for inputs[0]
  const proofKey = inputs[0][0]
  const proof = await createProof(trie, proofKey)
  assert.ok(await verifyTrieProof(proofKey, proof))

  // Build a sparse trie from the proof
  const fromProof = await createTrieFromProof(proof, { root: trie.root() })

  // Walk the sparse trie
  const walker = fromProof.walkTrieIterable(fromProof.root())
  let found = 0
  for await (const { currentKey, node } of walker) {
    if (equalsBytes((fromProof as any).hash(node.serialize()), fromProof.root())) {
      // The root of proof trie should be same as original
      assert.deepEqual(fromProof.root(), trie.root())
    }
    if (node instanceof LeafNode) {
      // The only leaf node should be leaf from the proof
      const fullKeyNibbles = [...currentKey, ...node._nibbles]
      assert.deepEqual(fullKeyNibbles, bytesToNibbles(proofKey))
      assert.deepEqual(node.value(), inputs[0][1])
    }
    // Count the nodes...nodes from the proof should be only nodes in the trie
    found++
  }
  assert.equal(found, proof.length, `found: ${found} should equal proof length: ${proof.length}`)
  assert.ok(true, 'Walking sparse trie should not throw error')

  // Walk the same sparse trie with WalkController
  try {
    await fromProof.walkTrie(fromProof.root(), async (noderef, node, key, wc) => {
      wc.allChildren(node!)
    })
    assert.fail('Will throw when it meets a missing node in a sparse trie')
  } catch (err) {
    assert.equal((err as any).message, 'Missing node in DB')
  }
})
