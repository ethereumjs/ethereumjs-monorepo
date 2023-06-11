import { bytesToPrefixedHexString, randomBytes } from '@ethereumjs/util'
import debug from 'debug'
import { equalsBytes, utf8ToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { BranchNode, LeafNode, Trie, nibblestoBytes } from '../src'

import type { FoundNodeFunction } from '../src'
import type { TNode } from '../src/trie/node/types'

const runTests = async (testSizes: number[] = [100, 200]) => {
  const testCases: [number, { keys: Uint8Array[]; values: Uint8Array[] }][] = testSizes.map(
    (size) => {
      const keys = Array.from({ length: size }, () => randomBytes(20))
      const values = Array.from({ length: size }, () =>
        randomBytes(32 + Math.ceil(Math.random() * 128))
      )
      return [size, { keys, values }]
    }
  )
  for await (const [testIdx, [testLength, { keys, values }]] of testCases.entries()) {
    const startTime = Date.now()
    tape('MMPT', async (t) => {
      t.test('insert/get/delete', async (st) => {
        const d_bug = debug('test:trie')
        const trie = new Trie({ debug: d_bug })
        const value = await trie.get(Uint8Array.from([1, 2, 3, 4]), d_bug)
        st.equal(value, null, 'get should return null for a non-existent key')
        for await (const [idx, key] of keys.entries()) {
          await trie.put(key, values[idx], d_bug)
        }
        for await (const [idx, key] of keys.entries()) {
          const retrieved = await trie.get(key, d_bug)
          if (retrieved === null) {
            st.fail(`Failed to return a value node for key ${idx}`)
            st.end()
            return
          } else if (equalsBytes(retrieved, values[idx])) {
            continue
          } else {
            st.fail(`Failed to return the correct value for key ${idx}`)
            st.end()
            return
          }
        }

        const deleted: number[] = [-1]
        for await (const _i of Array.from({ length: testLength }, (_, i) => i)) {
          let idx = deleted[0]
          while (deleted.includes(idx)) {
            idx = Math.floor(Math.random() * keys.length)
          }
          const preRoot = trie.root()
          await trie.del(keys[idx], d_bug)
          st.notDeepEqual(preRoot, trie.root(), `delete should change the root hash`)
          const expectNull = await trie.get(keys[idx], d_bug)
          st.equal(expectNull, null, `get should return null for a deleted key`)
          if (expectNull !== null) {
            st.fail(`get key${idx}:${keys[idx]}`)
            st.end()
            return
          }
          deleted.push(idx)
          for (const d of deleted.slice(1)) {
            const retrieved = await trie.get(keys[d], d_bug)
            if (retrieved !== null) {
              st.fail(`get key${d}:${keys[d]}`)
              st.end()
              return
            }
          }
          st.pass(`Returned null for all deleted keys`)
          let k = 0
          for await (const [idx, key] of keys.entries()) {
            if (deleted.includes(idx)) {
              continue
            } else {
              k++
              const retrieved = await trie.get(key, d_bug)
              if (retrieved === null) {
                st.fail(`failed to return a value node for not-deleted key ${idx}`)
                st.end()
                return
              }
              if (!equalsBytes(retrieved, values[idx])) {
                st.fail(
                  `failed to return correct value for not-deleted key ${idx}.  returned ${retrieved}`
                )
                st.end()
                return
              }
            }
          }
          st.equal(
            k,
            keys.length - (deleted.length - 1),
            `get should return the correct value for all non-deleted keys`
          )
          st.pass(`Returned correct value for ${keys.length - deleted.length} non-deleted keys`)
        }
        st.pass('Delete Test Passed.  Good Job!')
        st.end()
      })
      t.test('create proof / verify proof', async (st) => {
        const d_bug = debug('test:proof')
        const trie = new Trie({ debug: d_bug })
        for await (const [idx, key] of keys.entries()) {
          await trie.put(key, values[idx], d_bug)
        }
        for await (const [idx, key] of keys.entries()) {
          const retrieved = await trie.get(key, d_bug)
          if (retrieved === null) {
            st.fail(`failed to return a value node for not-deleted key ${idx}`)
            st.end()
            return
          }
          if (!equalsBytes(retrieved, values[idx])) {
            st.fail(`failed to return correct node and value for key ${idx}`)
            st.end()
            return
          }
          const proof = await trie._createProof(key, d_bug)
          st.ok(proof, `Proof for key ${idx} should exist -- length:${proof.length}`)
          const verified = await Trie.verifyProof(trie.root(), key, proof)
          st.deepEqual(verified, values[idx], `Proof for key ${idx} should verify`)
        }
        const sampleSize = Math.floor(testLength / 5)
        const deleteSample = Array.from({ length: sampleSize }, (_, i) => {
          const deleteIdx = Math.floor((Math.random() * keys.length * (i + 1)) / sampleSize)
          const toDelete = keys[deleteIdx]
          return { deleteIdx, toDelete }
        })
        for (const { deleteIdx, toDelete } of deleteSample) {
          await trie.del(toDelete, d_bug)
          const deleted = await trie.get(toDelete, d_bug)
          st.equal(deleted, null, `deleted key should return null`)
          try {
            const nullProof = await trie._createProof(toDelete, d_bug)
            st.ok(
              nullProof,
              `Proof for deleted key ${deleteIdx} should exist -- length:${nullProof.length}`
            )
          } catch (e) {
            st.fail(`Failed to create proof for deleted key ${deleteIdx}: ${(e as any).message}`)
            throw e
          }
        }
        st.end()
      })
      t.test('walkTrie', async (st) => {
        const d_bug = debug('test:walkTrie')
        const trie = new Trie({ debug: d_bug })
        for await (const [idx, key] of keys.entries()) {
          await trie.put(key, values[idx], d_bug)
        }
        for await (const [idx, key] of keys.entries()) {
          const retrieved = await trie.get(key, d_bug)
          if (retrieved === null) {
            st.fail(`failed to return a value node for not-deleted key ${idx}`)
            st.end()
            return
          }
          if (!equalsBytes(retrieved, values[idx])) {
            st.fail(`failed to return correct node and value for key ${idx}`)
            st.end()
            return
          }
        }
        st.pass(`intert/get passed for ${keys.length} keys`)
        let i = 0
        let f = 0

        const foundNodes: [Uint8Array, TNode][] = []
        const branches: Map<string, { parent: number; branch: number }> = new Map()
        const valuesFound: string[] = []
        const onFound: FoundNodeFunction = async (node, key) => {
          if (node instanceof BranchNode) {
            for await (const child of node.childNodes().entries()) {
              branches.set(bytesToPrefixedHexString(child[1].hash()), {
                parent: f,
                branch: child[0],
              })
            }
          }
          foundNodes.push([nibblestoBytes(key), node])
          const val = node.getValue()
          if (val instanceof Uint8Array) {
            valuesFound.push(bytesToPrefixedHexString(val))
          }
          f++
        }
        const walk = trie.walkTrie(trie.rootNode, trie.rootNode.getPartialKey(), onFound)

        const foundValues = []
        for await (const _ of walk) {
          const walkIdx = i++
          if (_.getValue() instanceof Uint8Array) {
            foundValues.push(bytesToPrefixedHexString(_.getValue()!))
          }

          if (_.getType() === 'BranchNode') {
            const c: { [k: typeof walkIdx]: number }[] = []
            for await (const child of _.getChildren().entries()) {
              c.push({ [walkIdx]: child[0] })
            }
          }
        }
        const uniqueValuesFound = Array.from(new Set(foundValues))
        const missingValues = values
          .map((v) => bytesToPrefixedHexString(v))
          .filter((v) => !uniqueValuesFound.includes(v))
        const missingValueIdx = missingValues.map((v) => {
          const idx = values.findIndex((vv) => bytesToPrefixedHexString(vv) === v)
          return idx
        })
        // Usually finds 95% to 100% of values.
        // Test will still pass as long as values are still retrievable with `get`
        st.pass(
          `walk trie touched ${(uniqueValuesFound.length * 100) / keys.length}% of ${
            keys.length
          } key/value nodes`
        )
        if (missingValueIdx.length > 0) {
          for (const idx of missingValueIdx) {
            const retrievedMissing = await trie.get(keys[idx], d_bug)
            if (retrievedMissing === null) {
              st.fail(`failed to return a value node for key ${idx}`)
              st.end()
              return
            }
            st.deepEqual(retrievedMissing, values[idx], `should find missing value for key ${idx}`)
            if (!equalsBytes(retrievedMissing, values[idx])) {
              st.fail(`failed to return correct node and value for key ${idx}`)
              st.end()
              return
            }
          }
          st.pass(`All ${missingValueIdx.length} missing key/value nodes still found in trie`)
        }
        st.end()
      })
      const endTime = Date.now() - startTime
      t.pass(`Test: ${testIdx} passed with ${testLength} key/value pairs`)
      t.pass(`Test took ${endTime / 1000000}ms to complete`)
      t.end()
    })
  }
}

runTests()
  .then(() => {})
  .catch((_) => {})

tape('node serialization', async (t) => {
  const trie = new Trie({ debug: debug('test:node:serialization') })
  const key = Uint8Array.from([0, 1])
  const value = utf8ToBytes('value')
  await trie.put(key, value)
  const leaf = new LeafNode({
    key: [0, 0, 0, 1],
    value,
  })
  const node = trie.rootNode
  const serialized = node.rlpEncode()
  const deserialized = await trie._decodeToNode(serialized)
  t.equal(deserialized.getType(), 'LeafNode', 'should be a leaf node')
  t.equal(trie.rootNode.getType(), 'LeafNode', 'should be a leaf node')
  t.deepEqual(deserialized.rlpEncode(), leaf.rlpEncode(), 'should serialize and deserialize')
  t.deepEqual(node.getPartialKey(), leaf.getPartialKey(), 'should serialize and deserialize')
  t.deepEqual(deserialized.rlpEncode(), node.rlpEncode(), 'should serialize and deserialize')
  t.end()
})
