import { randomBytes } from '@ethereumjs/util'
import { assert, beforeAll, describe, it } from 'vitest'

import { MerklePatriciaTrie } from '../../src/index.ts'

import type { MPTNode } from '../../src/types.ts'

describe('[MPT/Trie]: findPath', () => {
  let keys: Uint8Array[]
  let trie: MerklePatriciaTrie
  let rootNode: MPTNode | null

  beforeAll(async () => {
    keys = Array.from({ length: 200 }, () => randomBytes(8))
    trie = new MerklePatriciaTrie()
    for (const [i, k] of keys.entries()) {
      await trie.put(k, Uint8Array.from([i, i]))
    }
    rootNode = await trie.lookupNode(trie.root())
  })

  for (let idx = 0; idx < 10; idx++) {
    it(`sample key ${idx}: findPath and partial stacks`, async () => {
      const k = keys[idx]!
      const val = await trie.get(k)
      assert.deepEqual(val, Uint8Array.from([idx, idx]))

      trie['debug']('FIND PATH ORIGINAL:' + '-'.repeat(20))
      const path = await trie.findPath(k)
      assert.isNotNull(path.node)
      assert.deepEqual(path.stack[0], rootNode)
      assert.deepEqual(path.node?.value(), Uint8Array.from([idx, idx]))

      trie['debug'](`FINDING PARTIAL PATHS: ` + path.stack.length + '-'.repeat(20))
      for (let i = 1; i <= path.stack.length - 1; i++) {
        trie['debug']('FIND PATH PARTIAL: ' + i + '-'.repeat(20))
        const pathFromPartial = await trie.findPath(k, false, { stack: path.stack.slice(0, i) })
        assert.deepEqual(path, pathFromPartial)
        assert.isNotNull(pathFromPartial.node)
        assert.deepEqual(pathFromPartial.stack[0], rootNode)
        assert.deepEqual(pathFromPartial.node?.value(), Uint8Array.from([idx, idx]))
        assert.strictEqual(path.stack.length, pathFromPartial.stack.length)
      }
    })
  }
})

describe('[MPT/Trie]: secure findPath', () => {
  let keys: Uint8Array[]
  let trie: MerklePatriciaTrie
  let rootNode: MPTNode | null

  beforeAll(async () => {
    keys = Array.from({ length: 1000 }, () => randomBytes(20))
    trie = new MerklePatriciaTrie({ useKeyHashing: true })
    for (const [i, k] of keys.entries()) {
      await trie.put(k, Uint8Array.from([i, i]))
    }
    rootNode = await trie.lookupNode(trie.root())
  })

  for (let idx = 0; idx < 10; idx++) {
    it(`hashed sample key ${idx}: findPath and partial stacks`, async () => {
      const k = keys[idx]!
      const val = await trie.get(k)
      assert.deepEqual(val, Uint8Array.from([idx, idx]))

      const path = await trie.findPath(trie['hash'](k))
      assert.isNotNull(path.node)
      assert.deepEqual(path.stack[0], rootNode)
      assert.deepEqual(path.node?.value(), Uint8Array.from([idx, idx]))

      for (let i = 2; i <= path.stack.length - 1; i++) {
        const pathFromPartial = await trie.findPath(trie['hash'](k), false, {
          stack: path.stack.slice(0, i),
        })
        assert.deepEqual(path, pathFromPartial)
        assert.isNotNull(pathFromPartial.node)
        assert.deepEqual(pathFromPartial.stack[0], rootNode)
        assert.deepEqual(pathFromPartial.node?.value(), Uint8Array.from([idx, idx]))
        assert.strictEqual(path.stack.length, pathFromPartial.stack.length)
      }
    })
  }
})
