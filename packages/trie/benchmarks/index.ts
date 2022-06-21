import * as Benchmark from 'benchmark'
import { runTrie } from './random'
import { iterTest } from './checkpointing'
import { LevelDB } from '../dist'

const suite = new Benchmark.Suite()

const db = new LevelDB()

// random.ts
// Test ID is defined as: `pair_count`-`era_size`-`key_size`-`value_type`
// where value_type = symmetric ? 'mir' : 'ran'
// The standard secure-trie test is `1k-9-32-ran`
// https://eth.wiki/en/fundamentals/benchmarks#results-1
suite
  .add(`1k-3-32-ran`, async () => {
    await runTrie(db, 3, false)
  })
  .add(`1k-5-32-ran`, async () => {
    await runTrie(db, 5, false)
  })
  .add(`1k-9-32-ran`, async () => {
    await runTrie(db, 9, false)
  })
  .add(`1k-1k-32-ran`, async () => {
    await runTrie(db, 1000, false)
  })
  .add(`1k-1k-32-mir`, async () => {
    await runTrie(db, 1000, true)
  })

// checkpointing.ts
suite
  .add(`Checkpointing: 100 iterations`, async () => {
    await iterTest(db, 100)
  })
  .add(`Checkpointing: 500 iterations`, async () => {
    await iterTest(db, 500)
  })
  .add(`Checkpointing: 1000 iterations`, async () => {
    await iterTest(db, 1000)
  })
  .add(`Checkpointing: 5000 iterations`, async () => {
    await iterTest(db, 5000)
  })

suite
  .on('cycle', (event: any) => {
    console.log(String(event.target))
  })
  .run()

process.exit()
