// https://github.com/ethereum/wiki/wiki/Benchmarks
'use strict'
import * as async from 'async'
import * as ethUtil from 'ethereumjs-util'
const Trie = require('../dist/index.js').BaseTrie

const ROUNDS = 1000
const SYMMETRIC = true
const ERA_SIZE = 1000

let trie = new Trie()
let seed = Buffer.alloc(32).fill(0)

let testName = 'rounds ' + ROUNDS + ' ' + ERA_SIZE + ' ' + SYMMETRIC ? 'sys' : 'rand'
console.time(testName)
run(() => {
  console.timeEnd(testName)
})

function run(cb: any) {
  let i = 0
  async.whilst(
    () => {
      i++
      return i <= ROUNDS
    },
    function (done) {
      seed = ethUtil.keccak256(seed)
      if (SYMMETRIC) {
        trie.put(seed, seed, genRoot)
      } else {
        let val = ethUtil.keccak256(seed)
        trie.put(seed, val, genRoot)
      }

      function genRoot() {
        if (i % ERA_SIZE === 0) {
          seed = trie.root
        }
        done()
      }
    },
    cb,
  )
}
