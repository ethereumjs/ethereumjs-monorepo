import { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { MapDB } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { bench, describe } from 'vitest'

const KEY_SIZE = 32
const ROUNDS_LARGE = 5000
const ERA = 9

/** Local-only — large trie puts are kept out of CI CodSpeed runs. */
describe('mpt heavy (local)', () => {
  bench('mpt put 5k-9-32', async () => {
    const trie = new MerklePatriciaTrie({ db: new MapDB() })
    let key = new Uint8Array(KEY_SIZE)
    for (let i = 0; i <= ROUNDS_LARGE; i++) {
      key = keccak_256(key)
      await trie.put(key, key)
      if (i % ERA === 0) {
        key = trie.root()
      }
    }
  })
})
