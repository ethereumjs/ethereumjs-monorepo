import { randomBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Trie } from '../../src/index.js'

describe('TRIE > findPath', async () => {
  const keys = Array.from({ length: 200 }, () => randomBytes(8))
  const trie = new Trie()
  for (const [i, k] of keys.entries()) {
    await trie.put(k, Uint8Array.from([i, i]))
  }
  const rootNode = await trie.lookupNode(trie.root())
  for (const [idx, k] of keys.slice(0, 10).entries()) {
    const val = await trie.get(k)
    it('should find values for key', async () => {
      assert.deepEqual(val, Uint8Array.from([idx, idx]))
    })
    trie['debug']('FIND PATH ORIGINAL:' + '-'.repeat(20))
    const path = await trie.findPath(k)
    it('should find path for key', async () => {
      assert.isNotNull(path.node)
      assert.deepEqual(path.stack[0], rootNode)
      assert.deepEqual(path.node?.value(), Uint8Array.from([idx, idx]))
    })
    trie['debug'](`FINDING PARTIAL PATHS: ` + path.stack.length + '-'.repeat(20))
    for (let i = 1; i <= path.stack.length - 1; i++) {
      trie['debug']('FIND PATH PARTIAL: ' + i + '-'.repeat(20))
      const pathFromPartial = await trie.findPath(k, false, { stack: path.stack.slice(0, i) })
      it(`should find path for key from partial stack (${i}/${path.stack.length})`, async () => {
        assert.deepEqual(path, pathFromPartial)
        assert.isNotNull(pathFromPartial.node)
        assert.deepEqual(pathFromPartial.stack[0], rootNode)
        assert.deepEqual(pathFromPartial.node?.value(), Uint8Array.from([idx, idx]))
        assert.equal(path.stack.length, pathFromPartial.stack.length)
      })
    }
  }
})
describe('TRIE (secure) > findPath', async () => {
  const keys = Array.from({ length: 1000 }, () => randomBytes(20))
  const trie = new Trie({ useKeyHashing: true })
  for (const [i, k] of keys.entries()) {
    await trie.put(k, Uint8Array.from([i, i]))
  }
  const rootNode = await trie.lookupNode(trie.root())
  for (const [idx, k] of keys.slice(0, 10).entries()) {
    const val = await trie.get(k)
    it('should find value for key', async () => {
      assert.deepEqual(val, Uint8Array.from([idx, idx]))
    })
    const path = await trie.findPath(trie['hash'](k))
    it('should find path for key', async () => {
      assert.isNotNull(path.node)
      assert.deepEqual(path.stack[0], rootNode)
      assert.deepEqual(path.node?.value(), Uint8Array.from([idx, idx]))
    })
    for (let i = 2; i <= path.stack.length - 1; i++) {
      const pathFromPartial = await trie.findPath(trie['hash'](k), false, {
        stack: path.stack.slice(0, i),
      })
      it(`should find path for key from partial stack (${i}/${path.stack.length})`, async () => {
        assert.deepEqual(path, pathFromPartial)
        assert.isNotNull(pathFromPartial.node)
        assert.deepEqual(pathFromPartial.stack[0], rootNode)
        assert.deepEqual(pathFromPartial.node?.value(), Uint8Array.from([idx, idx]))
        assert.equal(path.stack.length, pathFromPartial.stack.length)
      })
    }
  }
})
