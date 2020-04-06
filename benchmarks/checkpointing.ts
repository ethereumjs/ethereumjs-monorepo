import * as crypto from 'crypto'
import { CheckpointTrie } from '../dist'

const iterations = 500
const samples = 20
let i = 0
let avg = [0, 0]

const iterTest = async (numOfIter: number): Promise<Array<number>> => {
  return new Promise(async (resolve) => {
    let vals = [] as any
    let keys = [] as any

    for (i = 0; i <= numOfIter; i++) {
      vals.push(crypto.pseudoRandomBytes(32))
      keys.push(crypto.pseudoRandomBytes(32))
    }

    let hrstart = process.hrtime()
    let numOfOps = 0
    let trie = new CheckpointTrie()

    for (i = 0; i < numOfIter; i++) {
      await trie.put(vals[i], keys[i])
      trie.checkpoint()
      const value = await trie.get(Buffer.from('test'))
      numOfOps++
      if (numOfOps === numOfIter) {
        const hrend = process.hrtime(hrstart)
        resolve(hrend)
      }
    }
  })
}

const go = async () => {
  while (i <= samples) {
    const hrend = await iterTest(iterations)
    avg[0] += hrend[0]
    avg[1] += hrend[1]
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  }
  return console.info(
    'Average Execution time (hr): %ds %dms',
    avg[0] / samples,
    avg[1] / 1000000 / samples,
  )
}

go()
