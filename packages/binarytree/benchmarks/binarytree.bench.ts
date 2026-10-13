import { createBinaryTree } from '@ethereumjs/binarytree'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { bench, describe } from 'vitest'

function precomputeKeys(): Uint8Array[] {
  const keys: Uint8Array[] = []
  let key = new Uint8Array(32)
  for (let i = 0; i < 256; i++) {
    key = keccak_256(key)
    keys.push(key)
  }
  return keys
}

const keys = precomputeKeys()

describe('binarytree', () => {
  bench('binarytree put and get batch', async () => {
    const tree = await createBinaryTree()
    for (const key of keys) {
      const stem = key.slice(0, 31)
      const suffix = key[31]!
      await tree.put(stem, [suffix], [key])
    }
    for (const key of keys) {
      const stem = key.slice(0, 31)
      const suffix = key[31]!
      await tree.get(stem, [suffix])
    }
  })
})
