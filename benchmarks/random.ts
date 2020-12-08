'use strict'
import { keccak256 } from 'ethereumjs-util'
import { CheckpointTrie as Trie } from '../dist'

// References:
// https://eth.wiki/en/fundamentals/benchmarks#the-trie
// https://gist.github.com/heikoheiko/0fa2b322560ba7794f22

const ROUNDS = 1000
const KEY_SIZE = 32

export const runTrie = async (eraSize = 9, symmetric = false) => {
  const trie = new Trie()
  let key = Buffer.alloc(KEY_SIZE)

  for (let i = 0; i <= ROUNDS; i++) {
    key = keccak256(key)

    if (symmetric) {
      await trie.put(key, key)
    } else {
      const val = keccak256(key)
      await trie.put(key, val)
    }

    if (i % eraSize === 0) {
      key = trie.root
    }
  }
}
