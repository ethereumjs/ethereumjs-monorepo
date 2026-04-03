import { keccak_256 as nobleKeccak } from '@noble/hashes/sha3.js'
//@ts-expect-error - package has no types...
import { mark } from 'micro-bmark' // cspell:disable-line
import { keccak_256 as unrolledKeccak } from 'unrolled-nbl-hashes-sha3'

const ITERATIONS = 50000

async function main() {
  for (const size of [32, 100, 500, 2000]) {
    const input = new Uint8Array(size)
    for (let i = 0; i < size; i++) input[i] = i & 0xff

    await mark(`noble keccak256 (${size} bytes)`, ITERATIONS, () => {
      nobleKeccak(input)
    })

    await mark(`unrolled keccak256 (${size} bytes)`, ITERATIONS, () => {
      unrolledKeccak(input)
    })
  }

  // Verify output equivalence
  const testInput = new Uint8Array([1, 2, 3, 4, 5])
  const nobleResult = nobleKeccak(testInput)
  const unrolledResult = unrolledKeccak(testInput)
  const match = nobleResult.every((b: number, i: number) => b === unrolledResult[i])
  console.log(`\nOutput equivalence check: ${match ? 'PASS' : 'FAIL'}`)
}

main()
