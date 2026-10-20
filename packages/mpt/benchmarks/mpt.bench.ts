import { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import { MapDB, randomBytes } from '@ethereumjs/util'
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

const RLP_INDEX_COUNT = 1000
const rlpIndexKeys = Array.from({ length: RLP_INDEX_COUNT }, (_, i) => RLP.encode(i))
const rlpIndexValues = Array.from({ length: RLP_INDEX_COUNT }, () => randomBytes(32))

describe('mpt', () => {
  bench('mpt put sequential rlp indices', async () => {
    const trie = new MerklePatriciaTrie({ db: new MapDB() })
    for (let i = 0; i < RLP_INDEX_COUNT; i++) {
      await trie.put(rlpIndexKeys[i]!, rlpIndexValues[i]!)
    }
  })

  bench('mpt batch sequential rlp indices', async () => {
    const trie = new MerklePatriciaTrie({ db: new MapDB() })
    await trie.batch(
      rlpIndexKeys.map((key, i) => ({
        type: 'put',
        key,
        value: rlpIndexValues[i]!,
      })),
    )
  })

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

  bench('mpt del 1k after warm', async () => {
    const trie = new MerklePatriciaTrie({ db: new MapDB() })
    for (const key of keys) {
      await trie.put(key, key)
    }
    for (const key of keys) {
      await trie.del(key)
    }
  })
})
