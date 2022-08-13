// @ts-ignore - package has no types...
import { run, mark, logMem, getTime } from './micro-bmark'
import { runTrie } from './random'

import { CheckpointTrie, LevelDB } from '../dist'

const db = new LevelDB()
const trie = new CheckpointTrie({ db })
import { keys, vals } from './checkpointing'

run(async () => {
  // random.ts
  // Test ID is defined as: `pair_count`-`era_size`-`key_size`-`value_type`
  // where value_type = symmetric ? 'mir' : 'ran'
  // The standard secure-trie test is `1k-9-32-ran`
  // https://eth.wiki/en/fundamentals/benchmarks#results-1

  //   await mark(`1k-3-32-ran`, async () => {
  //     await runTrie(db, 3, false)
  //   })

  //   await mark(`1k-5-32-ran`, async () => {
  //     await runTrie(db, 5, false)
  //   })

  //   await mark(`1k-9-32-ran`, async () => {
  //     await runTrie(db, 9, false)
  //   })

  //   await mark(`1k-1k-32-ran`, async () => {
  //     await runTrie(db, 1000, false)
  //   })

  //   await mark(`1k-1k-32-mir`, async () => {
  //     await runTrie(db, 1000, true)
  //   })

  for (const samples of [100, 500, 1000, 5000]) {
    await mark(`Checkpointing: ${samples} iterations`, samples, async ({ i }: { i: number }) => {
      trie.checkpoint()
      await trie.put(keys[i], vals[i])
      await trie.commit()
    })
  }

  logMem()

  getTime()
})
