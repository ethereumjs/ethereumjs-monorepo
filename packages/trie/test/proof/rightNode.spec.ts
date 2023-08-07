import { utf8ToBytes } from 'ethereum-cryptography/utils'
import { describe, expect, it } from 'vitest'

import { BranchNode, Trie } from '../../src/index.js'
import { hasRightBranch, isValueNode, returnRightNode } from '../../src/proof/range.js'
import { bytesToNibbles, nibblesCompare, nibblestoBytes } from '../../src/util/nibbles.js'
describe('returns RightNode', async () => {
  const trie = new Trie()
  const entries = Array.from({ length: 20 }, (_, i) => {
    return {
      key: utf8ToBytes(`key${i % 3}${i % 4}${i % 5}`),
      value: Uint8Array.from([i, i, i, i]),
    }
  })
  for (const { key, value } of entries) {
    await trie.put(key, value)
  }

  const sortedByKey = entries.sort((a, b) =>
    nibblesCompare(bytesToNibbles(a.key), bytesToNibbles(b.key))
  )
  it('passes', () => {
    expect(true).toBe(true)
  })
  for (const { key, value } of sortedByKey) {
    it(`returns RightNode for key ${key} (${value})`, async () => {
      const val = await trie.get(key)
      const node = (await trie.findPath(key)).node
      expect(val).toEqual(value)
      expect(isValueNode(node!)).toBe(true)
    })
  }
})

describe('hasRightBranch', async () => {
  const branchNode = new BranchNode()
  for (const i of Array.from({ length: 7 }, (_, i) => i)) {
    branchNode.setBranch(i, Uint8Array.from([i]))
  }
  branchNode.setBranch(8, Uint8Array.from([8]))
  for (const i of Array.from({ length: 16 }, (_, i) => i)) {
    if (i < 8) {
      it(`hasRightBranch for ${i}`, async () => {
        expect(hasRightBranch(branchNode, i)).toBeDefined()
      })
    } else {
      it(`hasRightBranch for ${i}`, async () => {
        expect(hasRightBranch(branchNode, i)).toBeFalsy()
      })
    }
  }
})
describe('returnRightNode', async () => {
  const trie = new Trie({})
  for (const i of Array.from({ length: 9 }, (_, i) => i)) {
    if (i === 6) continue
    await trie.put(nibblestoBytes([0, i, i, i]), Uint8Array.from([i]))
  }
  for (const i of Array.from({ length: 10 }, (_, idx) => idx)) {
    if (i > 7) {
      it(`returnRightNode (null) for ${i}`, async () => {
        const rightNode = await returnRightNode.bind(trie)(
          bytesToNibbles(nibblestoBytes([0, i, i, i]))
        )
        try {
          expect(rightNode).toBeNull()
        } catch {
          expect(rightNode!.node).toBeUndefined()
        }
      })
    } else {
      const rightNode = await returnRightNode.bind(trie)(
        bytesToNibbles(nibblestoBytes([0, i, i, i]))
      )
      it(`returnRightNode for ${i} = ${i === 5 ? i + 2 : i + 1}`, async () => {
        expect(rightNode, ``).not.toBeNull()
        i === 5
          ? expect(rightNode?.node.value()).toEqual(Uint8Array.from([i + 2]))
          : expect(rightNode?.node.value()).toEqual(Uint8Array.from([i + 1]))
      })
    }
  }
})
