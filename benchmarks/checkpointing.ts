import { pseudoRandomBytes } from 'crypto'
import { CheckpointTrie } from '../dist'

const iterations = 5000
const samples = 5

const iterTest = async (numOfIter: number): Promise<Array<number>> => {
  const vals = [] as any
  const keys = [] as any

  for (let i = 0; i <= numOfIter; i++) {
    vals.push(pseudoRandomBytes(32))
    keys.push(pseudoRandomBytes(32))
  }

  const hrstart = process.hrtime()
  let numOfOps = 0
  const trie = new CheckpointTrie()
  for (let i = 0; i < numOfIter; i++) {
    trie.checkpoint()
    await trie.put(vals[i], keys[i])
    await trie.get(Buffer.from('test'))
    numOfOps++
    if (numOfOps === numOfIter) {
      const hrend = process.hrtime(hrstart)
      return hrend
    }
    await trie.commit()
  }
}

const go = async () => {
  let i = 1
  const avg = [0, 0]

  console.log(`Benchmark 'checkpointing' starting...`)
  while (i <= samples) {
    console.log(`Sample ${i} with ${iterations} iterations.`)
    const hrend = await iterTest(iterations)
    avg[0] += hrend[0]
    avg[1] += hrend[1]
    // console.log('benchmarks/checkpointing.ts | execution time: %ds %dms', hrend[0], (hrend[1] / 1000000).toFixed(3))
    i++
  }
  console.log(
    'benchmarks/checkpointing.ts | average execution time: %ds %dms',
    avg[0] / samples,
    (avg[1] / 1000000 / samples).toFixed(3)
  )
}

go().catch(console.error)
