//https://github.com/ethereum/wiki/wiki/Benchmarks
'use strict'
const Trie = require('../')
const ethUtil = require('ethereumjs-util')
const async = require('async')

const ROUNDS = 1000
const SYMMETRIC = false
const ERA_SIZE = 4

let trie = new Trie()
let seed = new Buffer(32).fill(0)

let testName = 'rounds ' + ROUNDS + ' ' + ERA_SIZE + ' ' + SYMMETRIC ? 'sys' : 'rand'
console.time(testName)
run(() => {
  console.timeEnd(testName)
})

function run (cb) {
  let i = 0
  trie.checkpoint()
  async.whilst(
     () => {
      i++
      return i <= ROUNDS
    },
    function (done) {
      seed = ethUtil.sha3(seed)
      if (SYMMETRIC) {
        trie.put(seed, seed, genRoot)
      } else {
        let val = ethUtil.sha3(seed)
        trie.put(seed, val, genRoot)
      }
      function genRoot () {
        if (i % ERA_SIZE === 0) {
          trie.commit(() => {
            seed = trie.root
            trie.checkpoint()
            done()
          })
          return
        }
        done()
      }
    }, cb
  )
}
