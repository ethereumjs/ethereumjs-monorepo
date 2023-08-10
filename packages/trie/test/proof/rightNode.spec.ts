import { utf8ToBytes } from 'ethereum-cryptography/utils'
import { describe, expect, it } from 'vitest'

import { BranchNode, Trie } from '../../src/index.js'
import { hasRightBranch, isValueNode, returnRightNode } from '../../src/proof/range.js'
import { bytesToNibbles, nibblesCompare, nibblestoBytes } from '../../src/util/nibbles.js'
describe('isValueNode', async () => {
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
  for (const { key, value } of sortedByKey) {
    it(`key should lead to value node`, async () => {
      const val = await trie.get(key)
      const node = (await trie.findPath(key)).node
      expect(val).toEqual(value)
      expect(isValueNode(node!)).toBe(true)
    })
  }
})

describe('hasRightBranch', async () => {
  const branchNode = new BranchNode()
  for (let i = 0; i < 7; i++) {
    branchNode.setBranch(i, Uint8Array.from([i]))
  }
  branchNode.setBranch(8, Uint8Array.from([8]))
  for (let i = 0; i < 16; i++) {
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
  for (let i = 0; i < 9; i++) {
    if (i === 6) continue
    await trie.put(nibblestoBytes([0, i, i, i]), Uint8Array.from([i]))
  }
  for (let i = 0; i < 10; i++) {
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
