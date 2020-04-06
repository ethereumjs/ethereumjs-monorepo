// https://github.com/ethereum/wiki/wiki/Benchmarks
'use strict'
import { keccak256 } from 'ethereumjs-util'
import { BaseTrie } from '../dist'

const ROUNDS = 1000
const SYMMETRIC = true
const ERA_SIZE = 1000

let trie = new BaseTrie()
let seed = Buffer.alloc(32).fill(0)

const go = async () => {
  let testName = `rounds: ${ROUNDS} | ERA_SIZE: ${ERA_SIZE} | ${SYMMETRIC ? 'sys' : 'rand'}`
  console.time(testName)
  await run()
  console.timeEnd(testName)
}

const run = async (): Promise<void> => {
  let i = 0
  while (i <= ROUNDS) {
    seed = keccak256(seed)

    const genRoot = () => {
      if (i % ERA_SIZE === 0) {
        seed = trie.root
      }
    }

    if (SYMMETRIC) {
      await trie.put(seed, seed)
      genRoot()
    } else {
      let val = keccak256(seed)
      await trie.put(seed, val)
      genRoot()
    }

    i++
  }
}

go()
