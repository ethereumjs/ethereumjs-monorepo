import * as async from 'async'
import * as crypto from 'crypto'
const Trie = require('../dist/index.js').CheckpointTrie

let iterations = 500
let samples = 20
let i = 0

function iterTest(numOfIter: number, cb: Function) {
  let vals = [] as any
  let keys = [] as any

  for (i = 0; i <= numOfIter; i++) {
    vals.push(crypto.pseudoRandomBytes(32))
    keys.push(crypto.pseudoRandomBytes(32))
  }

  let hrstart = process.hrtime()
  let numOfOps = 0
  let trie = new Trie()

  for (i = 0; i < numOfIter; i++) {
    trie.put(vals[i], keys[i], function () {
      trie.checkpoint()
      trie.get(Buffer.from('test'), function () {
        numOfOps++
        if (numOfOps === numOfIter) {
          const hrend = process.hrtime(hrstart)
          cb(hrend)
        }
      })
    })
  }
}

i = 0
let avg = [0, 0]

async.whilst(
  function () {
    i++
    return i <= samples
  },
  function (done) {
    iterTest(iterations, function (hrend: Array<number>) {
      avg[0] += hrend[0]
      avg[1] += hrend[1]

      console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
      done()
    })
  },
  function () {
    console.info(
      'Average Execution time (hr): %ds %dms',
      avg[0] / samples,
      avg[1] / 1000000 / samples,
    )
  },
)
