import { pseudoRandomBytes } from 'crypto'
import { CheckpointTrie } from '../dist'

const iterations = 500
const samples = 20

const iterTest = async (numOfIter: number): Promise<Array<number>> => {
  return new Promise(async (resolve) => {
    let vals = [] as any
    let keys = [] as any

    for (let i = 0; i <= numOfIter; i++) {
      vals.push(pseudoRandomBytes(32))
      keys.push(pseudoRandomBytes(32))
    }

    let hrstart = process.hrtime()
    let numOfOps = 0
    let trie = new CheckpointTrie()

    for (let i = 0; i < numOfIter; i++) {
      await trie.put(vals[i], keys[i])
      trie.checkpoint()
      await trie.get(Buffer.from('test'))
      numOfOps++
      if (numOfOps === numOfIter) {
        const hrend = process.hrtime(hrstart)
        resolve(hrend)
      }
    }
  })
}

const go = async () => {
  let i = 0
  let avg = [0, 0]

  while (i <= samples) {
    const hrend = await iterTest(iterations)
    avg[0] += hrend[0]
    avg[1] += hrend[1]
    // console.log('benchmarks/checkpointing.ts | execution time: %ds %dms', hrend[0], (hrend[1] / 1000000).toFixed(3))
    i++
  }
  console.log(
    'benchmarks/checkpointing.ts | average execution time: %ds %dms',
    avg[0] / samples,
    (avg[1] / 1000000 / samples).toFixed(3),
  )
}

go()
