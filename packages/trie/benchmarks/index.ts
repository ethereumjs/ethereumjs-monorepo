// @ts-ignore - package has no types...
import { run, mark, logMem, getTime } from 'micro-bmark'
import { iterTest } from './checkpointing'
import { runTrie } from './random'

import { LevelDB } from '../dist'

const db = new LevelDB()

run(async () => {
  // random.ts
  // Test ID is defined as: `pair_count`-`era_size`-`key_size`-`value_type`
  // where value_type = symmetric ? 'mir' : 'ran'
  // The standard secure-trie test is `1k-9-32-ran`
  // https://eth.wiki/en/fundamentals/benchmarks#results-1

  await mark(`1k-3-32-ran`, async () => {
    await runTrie(db, 3, false)
  })

  await mark(`1k-5-32-ran`, async () => {
    await runTrie(db, 5, false)
  })

  await mark(`1k-9-32-ran`, async () => {
    await runTrie(db, 9, false)
  })

  await mark(`1k-1k-32-ran`, async () => {
    await runTrie(db, 1000, false)
  })

  await mark(`1k-1k-32-mir`, async () => {
    await runTrie(db, 1000, true)
  })

  await mark(`Checkpointing: 100 iterations`, async () => {
    await iterTest(db, 100)
  })

  await mark(`Checkpointing: 500 iterations`, async () => {
    await iterTest(db, 500)
  })

  await mark(`Checkpointing: 1000 iterations`, async () => {
    await iterTest(db, 1000)
  })

  await mark(`Checkpointing: 5000 iterations`, async () => {
    await iterTest(db, 5000)
  })

  logMem()

  getTime()
})
