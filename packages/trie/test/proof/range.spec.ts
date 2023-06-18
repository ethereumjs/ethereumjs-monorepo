import {
  MapDB,
  compareBytes,
  concatBytes,
  hexStringToBytes,
  randomBytes,
  setLengthLeft,
  toBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Trie, bytesToNibbles, verifyRangeProof } from '../../src/index.js'

import type { DB } from '@ethereumjs/util'

// reference: https://github.com/ethereum/go-ethereum/blob/20356e57b119b4e70ce47665a71964434e15200d/trie/proof_test.go

const TRIE_SIZE = 512

/**
 * Create a random trie.
 * @param addKey - whether to add 100 ordered keys
 * @returns Trie object and sorted entries
 */
async function randomTrie(db: DB<string, string>, addKey: boolean = true) {
  const entries: [Uint8Array, Uint8Array][] = []
  const trie = new Trie({
    db,
  })

  if (addKey) {
    for (let i = 0; i < 100; i++) {
      const key = setLengthLeft(toBytes(i), 32)
      const val = toBytes(i)
      await trie.put(key, val)
      entries.push([key, val])
    }
  }

  for (let i = 0; i < TRIE_SIZE; i++) {
    const key = randomBytes(32)
    const val = randomBytes(20)
    if ((await trie.get(key)) === null) {
      await trie.put(key, val)
      entries.push([key, val])
    }
  }

  return {
    trie,
    entries: entries.sort(([k1], [k2]) => compareBytes(k1, k2)),
  }
}

function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  if (max < min) {
    throw new Error('The maximum value should be greater than the minimum value')
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function decreaseKey(key: Uint8Array) {
  for (let i = key.length - 1; i >= 0; i--) {
    if (key[i] > 0) {
      return concatBytes(key.slice(0, i), toBytes(key[i] - 1), key.slice(i + 1))
    }
  }
}

function increaseKey(key: Uint8Array) {
  for (let i = key.length - 1; i >= 0; i--) {
    if (key[i] < 255) {
      return concatBytes(key.slice(0, i), toBytes(key[i] + 1), key.slice(i + 1))
    }
  }
}

async function verify(
  trie: Trie,
  entries: [Uint8Array, Uint8Array][],
  start: number,
  end: number,
  startKey?: Uint8Array,
  endKey?: Uint8Array,
  keys?: Uint8Array[],
  vals?: Uint8Array[]
) {
  startKey = startKey ?? entries[start][0]
  endKey = endKey ?? entries[end][0]
  const targetRange = entries.slice(start, end + 1)
  return verifyRangeProof(
    trie.root(),
    bytesToNibbles(startKey),
    bytesToNibbles(endKey),
    keys ? keys.map((key) => bytesToNibbles(key)) : targetRange.map(([key]) => bytesToNibbles(key)),
    vals ?? targetRange.map(([, val]) => val),
    [...(await trie.createProof(startKey)), ...(await trie.createProof(endKey))],
    trie.hashFunction
  )
}

describe('create a range proof and verify it', async () => {
  const { trie, entries } = await randomTrie(new MapDB())
  it('should build a randomTrie', async () => {
    assert.notDeepEqual(trie.root(), trie.EMPTY_TRIE_ROOT)
  })
  it('should put all entries into randomTrie', async () => {
    for await (const [key, val] of entries) {
      assert.deepEqual(await trie.get(key), val)
    }
  })

  for await (const _ of Array.from({ length: 10 }, (_, k) => k)) {
    it(
      'should verify a range proof',
      async () => {
        const start = getRandomIntInclusive(0, entries.length - 2)
        const end = getRandomIntInclusive(start + 1, entries.length - 1)
        assert.equal(await verify(trie, entries, start, end), end !== entries.length - 1)
      },
      { timeout: 10000 }
    )
  }
  it('should verify a range proof', async () => {
    assert.equal(await verify(trie, entries, entries.length - 2, entries.length - 1), false)
  })
})

describe('create a non-existent range proof and verify it', async () => {
  const { trie, entries } = await randomTrie(new MapDB())
  for await (const i of Array.from({ length: 10 }, (_, k) => k)) {
    const start = getRandomIntInclusive(0, entries.length - 1)
    const end = getRandomIntInclusive(start, entries.length - 1)

    const startKey = decreaseKey(entries[start][0])
    if (
      startKey === undefined ||
      (start > 0 && compareBytes(entries[start - 1][0], startKey) >= 0)
    ) {
      continue
    }

    const endKey = increaseKey(entries[end][0])
    if (
      endKey === undefined ||
      (end < entries.length - 1 && compareBytes(endKey, entries[end + 1][0]) >= 0)
    ) {
      continue
    }
    it(`Should run test #${i}`, async () => {
      it('should select random keys', async () => {
        assert.ok(startKey)
        assert.ok(start)
        assert.ok(end)
        assert.ok(endKey)
      })
      it('should verify a non-existent range proof', async () => {
        assert.equal(
          await verify(trie, entries, start, end, startKey, endKey),
          end !== entries.length - 1
        )
      })
    })
  }
  it('should verify a non-existent range proof', async () => {
    // Special case, two edge proofs for two edge key.
    const startKey = hexStringToBytes('00'.repeat(32))
    const endKey = hexStringToBytes('ff'.repeat(32))
    assert.equal(await verify(trie, entries, 0, entries.length - 1, startKey, endKey), false)
  })
})

// describe('create invalid non-existent range proof and verify it', async () => {
//   const { trie, entries } = await randomTrie(new MapDB())

//   const start = 100
//   const end = 200
//   const startKey = entries[start][0]
//   const endKey = entries[end][0]
//   const decreasedStartKey = decreaseKey(startKey)!
//   const increasedEndKey = increaseKey(endKey)!

//   assert.equal(await verify(trie, entries, start, end, decreasedStartKey, endKey), true)
//   try {
//     await verify(trie, entries, start + 5, end, decreasedStartKey)
//     assert.fail()
//   } catch (err) {
//     // ignore ..
//   }

//   assert.equal(await verify(trie, entries, start, end, startKey, increasedEndKey), true)
//   try {
//     await verify(trie, entries, start, end + 5, startKey, increasedEndKey)
//     assert.fail()
//   } catch (err) {
//     // ignore ..
//   }
// })

// describe('create a one element range proof and verify it', async () => {
//   const { trie, entries } = await randomTrie(new MapDB())

//   const start = 255
//   const startKey = entries[start][0]
//   const endKey = startKey
//   const decreasedStartKey = decreaseKey(startKey)!
//   const increasedEndKey = increaseKey(endKey)!

//   // One element with existent edge proof, both edge proofs
//   // point to the SAME key.
//   assert.equal(await verify(trie, entries, start, start, startKey), true)

//   // One element with left non-existent edge proof
//   assert.equal(await verify(trie, entries, start, start, decreasedStartKey), true)

//   // One element with right non-existent edge proof
//   assert.equal(await verify(trie, entries, start, start, undefined, increasedEndKey), true)

//   // One element with two non-existent edge proofs
//   assert.equal(await verify(trie, entries, start, start, decreasedStartKey, increasedEndKey), true)

//   // Test the mini trie with only a single element.
//   const tinyTrie = new Trie()
//   const tinyEntries: [Uint8Array, Uint8Array][] = [[randomBytes(32), randomBytes(20)]]
//   await tinyTrie.put(tinyEntries[0][0], tinyEntries[0][1])

//   const tinyStartKey = hexStringToBytes('00'.repeat(32))
//   assert.equal(await verify(tinyTrie, tinyEntries, 0, 0, tinyStartKey), false)
// })

// describe('create all element range proof and verify it', async () => {
//   const { trie, entries } = await randomTrie(new MapDB())

//   assert.equal(
//     await trie.verifyRangeProof(
//       trie.root(),
//       undefined,
//       undefined,
//       entries.map(([key]) => bytesToNibbles(key)),
//       entries.map(([, val]) => val),
//       undefined
//     ),
//     false
//   )

//   // With edge proofs, it should still work.
//   assert.equal(await verify(trie, entries, 0, entries.length - 1), false)

//   // Even with non-existent edge proofs, it should still work.
//   assert.equal(
//     await verify(
//       trie,
//       entries,
//       0,
//       entries.length - 1,
//       hexStringToBytes('00'.repeat(32)),
//       hexStringToBytes('ff'.repeat(32))
//     ),
//     false
//   )
// })

// describe('create a single side range proof and verify it', async () => {
//   const startKey = hexStringToBytes('00'.repeat(32))
//   const { trie, entries } = await randomTrie(new MapDB(), false)

//   const cases = [0, 1, 200, entries.length - 1]
//   for (const end of cases) {
//     assert.equal(await verify(trie, entries, 0, end, startKey), end !== entries.length - 1)
//   }
// })

// describe('create a revert single side range proof and verify it', async () => {
//   const endKey = hexStringToBytes('ff'.repeat(32))
//   const { trie, entries } = await randomTrie(new MapDB(), false)

//   const cases = [0, 1, 200, entries.length - 1]
//   for (const start of cases) {
//     assert.equal(await verify(trie, entries, start, entries.length - 1, undefined, endKey), false)
//   }
// })

// describe('create a bad range proof and verify it', async () => {
//   const runTest = async (
//     cb: (trie: Trie, entries: [Uint8Array, Uint8Array][]) => Promise<void>
//   ) => {
//     const { trie, entries } = await randomTrie(new MapDB(), false)

//     let result = false
//     try {
//       await cb(trie, entries)
//       result = true
//     } catch (err) {
//       // ignore
//     }
//     assert.isFalse(result)
//   }

//   // Modified key
//   await runTest(async (trie, entries) => {
//     const start = getRandomIntInclusive(0, entries.length - 2)
//     const end = getRandomIntInclusive(start + 1, entries.length - 1)
//     const targetIndex = getRandomIntInclusive(start, end)
//     entries[targetIndex][0] = randomBytes(32)
//     await verify(trie, entries, start, end)
//   })

//   // Modified val
//   await runTest(async (trie, entries) => {
//     const start = getRandomIntInclusive(0, entries.length - 2)
//     const end = getRandomIntInclusive(start + 1, entries.length - 1)
//     const targetIndex = getRandomIntInclusive(start, end)
//     entries[targetIndex][1] = randomBytes(20)
//     await verify(trie, entries, start, end)
//   })

//   // Gapped entry slice
//   await runTest(async (trie, entries) => {
//     const start = getRandomIntInclusive(0, entries.length - 3)
//     const end = getRandomIntInclusive(start + 2, entries.length - 1)
//     const targetIndex = getRandomIntInclusive(start + 1, end - 1)
//     entries = entries.slice(0, targetIndex).concat(entries.slice(targetIndex + 1))
//     await verify(trie, entries, start, end)
//   })

//   // Out of order
//   await runTest(async (trie, entries) => {
//     const start = getRandomIntInclusive(0, entries.length - 2)
//     const end = getRandomIntInclusive(start + 1, entries.length - 1)
//     let targetIndex1!: number
//     let targetIndex2!: number
//     while (targetIndex1 === targetIndex2) {
//       targetIndex1 = getRandomIntInclusive(start, end)
//       targetIndex2 = getRandomIntInclusive(start, end)
//     }
//     const temp = entries[targetIndex1]
//     entries[targetIndex1] = entries[targetIndex2]
//     entries[targetIndex2] = temp
//     await verify(trie, entries, start, end)
//   })
// })

// describe('create a gapped range proof and verify it', async () => {
//   const trie = new Trie()
//   const entries: [Uint8Array, Uint8Array][] = []
//   for (let i = 0; i < 10; i++) {
//     const key = setLengthLeft(toBytes(i), 32)
//     const val = toBytes(i)
//     await trie.put(key, val)
//     entries.push([key, val])
//   }

//   const start = 2
//   const end = 8
//   const targetRange: [Uint8Array, Uint8Array][] = []
//   for (let i = start; i <= end; i++) {
//     if (i === (start + end) / 2) {
//       continue
//     }
//     targetRange.push(entries[i])
//   }

//   let result = false
//   try {
//     await verify(
//       trie,
//       entries,
//       start,
//       end,
//       undefined,
//       undefined,
//       targetRange.map(([key]) => key),
//       targetRange.map(([, val]) => val)
//     )
//     result = true
//   } catch (err) {
//     // ignore
//   }
//   assert.isFalse(result)
// })

// describe('create a same side range proof and verify it', async () => {
//   const { trie, entries } = await randomTrie(new MapDB())

//   const start = 200
//   const end = 200
//   const startKey = entries[start][0]
//   const endKey = entries[end][0]
//   const decreasedStartKey = decreaseKey(decreaseKey(startKey)!)!
//   const decreasedEndKey = decreaseKey(endKey)!

//   let result = false
//   try {
//     await verify(trie, entries, start, end, decreasedStartKey, decreasedEndKey)
//     result = true
//   } catch (err) {
//     // ignore
//   }
//   assert.isFalse(result)

//   const increasedStartKey = increaseKey(startKey)!
//   const increasedEndKey = increaseKey(increaseKey(endKey)!)!

//   result = false
//   try {
//     await verify(trie, entries, start, end, increasedStartKey, increasedEndKey)
//     result = true
//   } catch (err) {
//     // ignore
//   }
//   assert.isFalse(result)
// })

// describe('should hasRightElement succeed', async () => {
//   const { trie, entries } = await randomTrie(new MapDB(), false)

//   const cases: { start: number; end: number; expect: boolean }[] = [
//     {
//       start: -1,
//       end: 1,
//       expect: true,
//     },
//     {
//       start: 0,
//       end: 1,
//       expect: true,
//     },
//     {
//       start: 0,
//       end: 10,
//       expect: true,
//     },
//     {
//       start: 50,
//       end: 100,
//       expect: true,
//     },
//     {
//       start: 400,
//       end: TRIE_SIZE - 1,
//       expect: false,
//     },
//     {
//       start: TRIE_SIZE - 2,
//       end: TRIE_SIZE - 1,
//       expect: false,
//     },
//     {
//       start: TRIE_SIZE - 1,
//       end: -1,
//       expect: false,
//     },
//     {
//       start: 0,
//       end: TRIE_SIZE - 1,
//       expect: false,
//     },
//     {
//       start: -1,
//       end: TRIE_SIZE - 1,
//       expect: false,
//     },
//     {
//       start: -1,
//       end: -1,
//       expect: false,
//     },
//   ]
//   it('create a range proof and verify it', async () => {
//     // eslint-disable-next-line prefer-const
//     for (let { start, end, expect } of cases) {
//       let startKey: Uint8Array
//       let endKey: Uint8Array

//       if (start === -1) {
//         start = 0
//         startKey = hexStringToBytes('00'.repeat(32))
//       } else {
//         startKey = entries[start][0]
//       }

//       if (end === -1) {
//         end = entries.length - 1
//         endKey = hexStringToBytes('ff'.repeat(32))
//       } else {
//         endKey = entries[end][0]
//       }

//       assert.equal(await verify(trie, entries, start, end, startKey, endKey), expect)
//     }
//   })
// })

// describe('create a bloated range proof and verify it', async () => {
//   const { trie, entries } = await randomTrie(new MapDB(), false)

//   let bloatedProof: Uint8Array[] = []
//   for (let i = 0; i < TRIE_SIZE; i++) {
//     bloatedProof = bloatedProof.concat(await trie.createProof(entries[i][0]))
//   }
//   it('should verify bloated proof', async () => {
//     assert.equal(await verify(trie, entries, 0, entries.length - 1), false)
//   })
// })
