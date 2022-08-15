import { keccak256 } from 'ethereum-cryptography/keccak'
// @ts-ignore - package has no types...
import { run, mark, logMem } from 'micro-bmark'

import { CheckpointTrie, LevelDB, Trie } from '../dist'
import { keys } from './keys'

const db = new LevelDB()
const trie = new Trie({ db })
const checkpointTrie = new CheckpointTrie({ db })

const ROUNDS = 1000
const KEY_SIZE = 32

run(async () => {
  // random.ts
  // Test ID is defined as: `pair_count`-`era_size`-`key_size`-`value_type`
  // where value_type = symmetric ? 'mir' : 'ran'
  // The standard secure-trie test is `1k-9-32-ran`
  // https://eth.wiki/en/fundamentals/benchmarks#results-1

  for (const [title, eraSize, symmetric] of [
    ['1k-3-32-ran', 3, false],
    ['1k-5-32-ran', 5, false],
    ['1k-9-32-ran', 9, false],
    ['1k-1k-32-ran', 1000, false],
    ['1k-1k-32-mir', 1000, true],
  ]) {
    await mark(title, async () => {
      let key = Buffer.alloc(KEY_SIZE)

      for (let i = 0; i <= ROUNDS; i++) {
        key = Buffer.from(keccak256(key))

        if (symmetric) {
          await trie.put(key, key)
        } else {
          await trie.put(key, Buffer.from(key))
        }

        if (i % (eraSize as number) === 0) {
          key = trie.root
        }
      }
    })
  }

  // References:
  // https://eth.wiki/en/fundamentals/benchmarks#the-trie
  // https://gist.github.com/heikoheiko/0fa2b322560ba7794f22
  for (const samples of [100, 500, 1000, 5000]) {
    await mark(`Checkpointing: ${samples} iterations`, samples, async (i: number) => {
      checkpointTrie.checkpoint()
      await checkpointTrie.put(keys[i], keys[i])
      await checkpointTrie.commit()
    })
  }

  logMem()
})
