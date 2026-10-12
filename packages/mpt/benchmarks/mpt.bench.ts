import { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { MapDB } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { bench, describe } from 'vitest'

const KEY_SIZE = 32
const ROUNDS = 1000
const ERA = 9

function precomputeKeys(): Uint8Array[] {
  const keys: Uint8Array[] = []
  let key = new Uint8Array(KEY_SIZE)
  for (let i = 0; i < ROUNDS; i++) {
    key = keccak_256(key)
    keys.push(key)
  }
  return keys
}

const keys = precomputeKeys()

describe('mpt', () => {
  bench('mpt put 1k-9-32', async () => {
    const trie = new MerklePatriciaTrie({ db: new MapDB() })
    let key = new Uint8Array(KEY_SIZE)
    for (let i = 0; i <= ROUNDS; i++) {
      key = keccak_256(key)
      await trie.put(key, key)
      if (i % ERA === 0) {
        key = trie.root()
      }
    }
  })

  bench('mpt get warm', async () => {
    const trie = new MerklePatriciaTrie({ db: new MapDB() })
    for (const key of keys) {
      await trie.put(key, key)
    }
    for (const key of keys) {
      await trie.get(key)
    }
  })

  bench('mpt checkpoint commit', async () => {
    const checkpointTrie = new MerklePatriciaTrie({ db: new MapDB() })
    for (let i = 0; i < 500; i++) {
      checkpointTrie.checkpoint()
      await checkpointTrie.put(keys[i]!, keys[i]!)
      await checkpointTrie.commit()
    }
  })

  bench('mpt root hash', async () => {
    const trie = new MerklePatriciaTrie({ db: new MapDB() })
    for (const key of keys) {
      await trie.put(key, key)
    }
    trie.root()
  })
})
