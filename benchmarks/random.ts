// https://github.com/ethereum/wiki/wiki/Benchmarks
const crypto = require('crypto')
import { CheckpointTrie } from '../dist'

const ROUNDS = 50000
const SYMMETRIC = true
const ERA_SIZE = 10000

const trie = new CheckpointTrie()

const run = async (): Promise<void> => {
  console.log(`Benchmark 'random' starting...`)
  let i = 0
  while (i <= ROUNDS) {
    let key = crypto.randomBytes(32)

    const genRoot = () => {
      if (i % ERA_SIZE === 0) {
        key = trie.root
        console.log(`${i} rounds.`)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (SYMMETRIC) {
      await trie.put(key, key)
      genRoot()
    } else {
      const value = crypto.randomBytes(32)
      await trie.put(key, value)
      genRoot()
    }

    i++
  }
}

const go = async () => {
  const testName = `benchmarks/random.ts | rounds: ${ROUNDS}, ERA_SIZE: ${ERA_SIZE}, ${
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    SYMMETRIC ? 'sys' : 'rand'
  }`
  console.time(testName)
  await run()
  console.timeEnd(testName)
}

go().catch(console.error)
