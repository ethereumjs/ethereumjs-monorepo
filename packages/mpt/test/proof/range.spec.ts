import {
  MapDB,
  compareBytes,
  concatBytes,
  hexToBytes,
  intToBytes,
  randomBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { MerklePatriciaTrie, createMerkleProof, verifyMerkleRangeProof } from '../../src/index.ts'

import type { DB } from '@ethereumjs/util'

// reference: https://github.com/ethereum/go-ethereum/blob/20356e57b119b4e70ce47665a71964434e15200d/trie/proof_test.go

const TRIE_SIZE = 512

/**
 * Create a random trie.
 * @param addKey - whether to add 100 ordered keys
 * @returns MerklePatriciaTrie object and sorted entries
 */
async function randomTrie(db: DB<string, string>, addKey: boolean = true) {
  const entries: [Uint8Array, Uint8Array][] = []
  const trie = new MerklePatriciaTrie({ db })

  if (addKey) {
    for (let i = 0; i < 100; i++) {
      const indexBytes = intToBytes(i)
      const key = setLengthLeft(indexBytes, 32)
      const val = indexBytes
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
      return concatBytes(key.slice(0, i), intToBytes(key[i] - 1), key.slice(i + 1))
    }
  }
}

function increaseKey(key: Uint8Array) {
  for (let i = key.length - 1; i >= 0; i--) {
    if (key[i] < 255) {
      return concatBytes(key.slice(0, i), intToBytes(key[i] + 1), key.slice(i + 1))
    }
  }
}

async function verify(
  trie: MerklePatriciaTrie,
  entries: [Uint8Array, Uint8Array][],
  start: number,
  end: number,
  startKey?: Uint8Array,
  endKey?: Uint8Array,
  keys?: Uint8Array[],
  values?: Uint8Array[],
) {
  startKey = startKey ?? entries[start][0]
  endKey = endKey ?? entries[end][0]
  const targetRange = entries.slice(start, end + 1)
  return verifyMerkleRangeProof(
    trie.root(),
    startKey,
    endKey,
    keys ?? targetRange.map(([key]) => key),
    values ?? targetRange.map(([, val]) => val),
    [...(await createMerkleProof(trie, startKey)), ...(await createMerkleProof(trie, endKey))],
  )
}

describe('[MPT/Proof]: merkle range proofs', () => {
  it('create a range proof and verify it', async () => {
    const { trie, entries } = await randomTrie(new MapDB())

    for (let i = 0; i < 10; i++) {
      const start = getRandomIntInclusive(0, entries.length - 2)
      const end = getRandomIntInclusive(start + 1, entries.length - 1)
      assert.strictEqual(await verify(trie, entries, start, end), end !== entries.length - 1)
    }

    assert.strictEqual(await verify(trie, entries, entries.length - 2, entries.length - 1), false)
  })

  it('create a non-existent range proof and verify it', async () => {
    const { trie, entries } = await randomTrie(new MapDB())

    for (let i = 0; i < 10; i++) {
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

      assert.strictEqual(
        await verify(trie, entries, start, end, startKey, endKey),
        end !== entries.length - 1,
      )
    }

    // Special case, two edge proofs for two edge key.
    const startKey = hexToBytes(`0x${'00'.repeat(32)}`)
    const endKey = hexToBytes(`0x${'ff'.repeat(32)}`)
    assert.strictEqual(await verify(trie, entries, 0, entries.length - 1, startKey, endKey), false)
  })

  it('create invalid non-existent range proof and verify it', async () => {
    const { trie, entries } = await randomTrie(new MapDB())

    const start = 100
    const end = 200
    const startKey = entries[start][0]
    const endKey = entries[end][0]
    const decreasedStartKey = decreaseKey(startKey)!
    const increasedEndKey = increaseKey(endKey)!

    assert.strictEqual(await verify(trie, entries, start, end, decreasedStartKey, endKey), true)
    try {
      await verify(trie, entries, start + 5, end, decreasedStartKey)
      assert.fail()
    } catch {
      // Ignore
    }

    assert.strictEqual(await verify(trie, entries, start, end, startKey, increasedEndKey), true)
    try {
      await verify(trie, entries, start, end + 5, startKey, increasedEndKey)
      assert.fail()
    } catch {
      // Ignore
    }
  })

  it('create a one element range proof and verify it', async () => {
    const { trie, entries } = await randomTrie(new MapDB())

    const start = 255
    const startKey = entries[start][0]
    const endKey = startKey
    const decreasedStartKey = decreaseKey(startKey)!
    const increasedEndKey = increaseKey(endKey)!

    // One element with existent edge proof, both edge proofs
    // point to the SAME key.
    assert.strictEqual(await verify(trie, entries, start, start, startKey), true)

    // One element with left non-existent edge proof
    assert.strictEqual(await verify(trie, entries, start, start, decreasedStartKey), true)

    // One element with right non-existent edge proof
    assert.strictEqual(await verify(trie, entries, start, start, undefined, increasedEndKey), true)

    // One element with two non-existent edge proofs
    assert.strictEqual(
      await verify(trie, entries, start, start, decreasedStartKey, increasedEndKey),
      true,
    )

    // Test the mini trie with only a single element.
    const tinyTrie = new MerklePatriciaTrie()
    const tinyEntries: [Uint8Array, Uint8Array][] = [[randomBytes(32), randomBytes(20)]]
    await tinyTrie.put(tinyEntries[0][0], tinyEntries[0][1])

    const tinyStartKey = hexToBytes(`0x${'00'.repeat(32)}`)
    assert.strictEqual(await verify(tinyTrie, tinyEntries, 0, 0, tinyStartKey), false)
  })

  it('create all element range proof and verify it', async () => {
    const { trie, entries } = await randomTrie(new MapDB())

    assert.strictEqual(
      await verifyMerkleRangeProof(
        trie.root(),
        null,
        null,
        entries.map(([key]) => key),
        entries.map(([, val]) => val),
        null,
      ),
      false,
    )

    // With edge proofs, it should still work.
    assert.strictEqual(await verify(trie, entries, 0, entries.length - 1), false)

    // Even with non-existent edge proofs, it should still work.
    assert.strictEqual(
      await verify(
        trie,
        entries,
        0,
        entries.length - 1,
        hexToBytes(`0x${'00'.repeat(32)}`),
        hexToBytes(`0x${'ff'.repeat(32)}`),
      ),
      false,
    )
  })

  it('create a single side range proof and verify it', async () => {
    const startKey = hexToBytes(`0x${'00'.repeat(32)}`)
    const { trie, entries } = await randomTrie(new MapDB(), false)

    const cases = [0, 1, 200, entries.length - 1]
    for (const end of cases) {
      assert.strictEqual(await verify(trie, entries, 0, end, startKey), end !== entries.length - 1)
    }
  })

  it('create a revert single side range proof and verify it', async () => {
    const endKey = hexToBytes(`0x${'ff'.repeat(32)}`)
    const { trie, entries } = await randomTrie(new MapDB(), false)

    const cases = [0, 1, 200, entries.length - 1]
    for (const start of cases) {
      assert.strictEqual(
        await verify(trie, entries, start, entries.length - 1, undefined, endKey),
        false,
      )
    }
  })

  it('create a bad range proof and verify it', async () => {
    const runTest = async (
      cb: (trie: MerklePatriciaTrie, entries: [Uint8Array, Uint8Array][]) => Promise<void>,
    ) => {
      const { trie, entries } = await randomTrie(new MapDB(), false)

      let result = false
      try {
        await cb(trie, entries)
        result = true
      } catch {
        // Ignore
      }
      assert.isFalse(result)
    }

    // Modified key
    await runTest(async (trie, entries) => {
      const start = getRandomIntInclusive(0, entries.length - 2)
      const end = getRandomIntInclusive(start + 1, entries.length - 1)
      const targetIndex = getRandomIntInclusive(start, end)
      entries[targetIndex][0] = randomBytes(32)
      await verify(trie, entries, start, end)
    })

    // Modified val
    await runTest(async (trie, entries) => {
      const start = getRandomIntInclusive(0, entries.length - 2)
      const end = getRandomIntInclusive(start + 1, entries.length - 1)
      const targetIndex = getRandomIntInclusive(start, end)
      entries[targetIndex][1] = randomBytes(20)
      await verify(trie, entries, start, end)
    })

    // Gapped entry slice
    await runTest(async (trie, entries) => {
      const start = getRandomIntInclusive(0, entries.length - 3)
      const end = getRandomIntInclusive(start + 2, entries.length - 1)
      const targetIndex = getRandomIntInclusive(start + 1, end - 1)
      entries = entries.slice(0, targetIndex).concat(entries.slice(targetIndex + 1))
      await verify(trie, entries, start, end)
    })

    // Out of order
    await runTest(async (trie, entries) => {
      const start = getRandomIntInclusive(0, entries.length - 2)
      const end = getRandomIntInclusive(start + 1, entries.length - 1)
      let targetIndex1!: number
      let targetIndex2!: number
      while (targetIndex1 === targetIndex2) {
        targetIndex1 = getRandomIntInclusive(start, end)
        targetIndex2 = getRandomIntInclusive(start, end)
      }
      const temp = entries[targetIndex1]
      entries[targetIndex1] = entries[targetIndex2]
      entries[targetIndex2] = temp
      await verify(trie, entries, start, end)
    })
  })

  it('create a gapped range proof and verify it', async () => {
    const trie = new MerklePatriciaTrie()
    const entries: [Uint8Array, Uint8Array][] = []
    for (let i = 0; i < 10; i++) {
      const indexBytes = intToBytes(i)
      const key = setLengthLeft(indexBytes, 32)
      const val = indexBytes
      await trie.put(key, val)
      entries.push([key, val])
    }

    const start = 2
    const end = 8
    const targetRange: [Uint8Array, Uint8Array][] = []
    for (let i = start; i <= end; i++) {
      if (i === (start + end) / 2) {
        continue
      }
      targetRange.push(entries[i])
    }

    let result = false
    try {
      await verify(
        trie,
        entries,
        start,
        end,
        undefined,
        undefined,
        targetRange.map(([key]) => key),
        targetRange.map(([, val]) => val),
      )
      result = true
    } catch {
      // Ignore
    }
    assert.isFalse(result)
  })

  it('create a same side range proof and verify it', async () => {
    const { trie, entries } = await randomTrie(new MapDB())

    const start = 200
    const end = 200
    const startKey = entries[start][0]
    const endKey = entries[end][0]
    const decreasedStartKey = decreaseKey(decreaseKey(startKey)!)!
    const decreasedEndKey = decreaseKey(endKey)!

    let result = false
    try {
      await verify(trie, entries, start, end, decreasedStartKey, decreasedEndKey)
      result = true
    } catch {
      // Ignore
    }
    assert.isFalse(result)

    const increasedStartKey = increaseKey(startKey)!
    const increasedEndKey = increaseKey(increaseKey(endKey)!)!

    result = false
    try {
      await verify(trie, entries, start, end, increasedStartKey, increasedEndKey)
      result = true
    } catch {
      // Ignore
    }
    assert.isFalse(result)
  })

  it('hasRightElement succeed', async () => {
    const { trie, entries } = await randomTrie(new MapDB(), false)

    const cases: { start: number; end: number; expect: boolean }[] = [
      {
        start: -1,
        end: 1,
        expect: true,
      },
      {
        start: 0,
        end: 1,
        expect: true,
      },
      {
        start: 0,
        end: 10,
        expect: true,
      },
      {
        start: 50,
        end: 100,
        expect: true,
      },
      {
        start: 400,
        end: TRIE_SIZE - 1,
        expect: false,
      },
      {
        start: TRIE_SIZE - 2,
        end: TRIE_SIZE - 1,
        expect: false,
      },
      {
        start: TRIE_SIZE - 1,
        end: -1,
        expect: false,
      },
      {
        start: 0,
        end: TRIE_SIZE - 1,
        expect: false,
      },
      {
        start: -1,
        end: TRIE_SIZE - 1,
        expect: false,
      },
      {
        start: -1,
        end: -1,
        expect: false,
      },
    ]

    // eslint-disable-next-line prefer-const
    for (let { start, end, expect } of cases) {
      let startKey: Uint8Array
      let endKey: Uint8Array

      if (start === -1) {
        start = 0
        startKey = hexToBytes(`0x${'00'.repeat(32)}`)
      } else {
        startKey = entries[start][0]
      }

      if (end === -1) {
        end = entries.length - 1
        endKey = hexToBytes(`0x${'ff'.repeat(32)}`)
      } else {
        endKey = entries[end][0]
      }

      assert.strictEqual(await verify(trie, entries, start, end, startKey, endKey), expect)
    }
  })

  it('create a bloated range proof and verify it', async () => {
    const { trie, entries } = await randomTrie(new MapDB(), false)

    let bloatedProof: Uint8Array[] = []
    for (let i = 0; i < TRIE_SIZE; i++) {
      bloatedProof = bloatedProof.concat(await createMerkleProof(trie, entries[i][0]))
    }

    assert.strictEqual(await verify(trie, entries, 0, entries.length - 1), false)
  })

  it('putSortedLeaves() uses at least 3x fewer node hashes than sequential put on 500 leaves', async () => {
    // Dense sequential 32-byte keys share a long prefix; batch hashing saves ~3× here and
    // more on longer spans (snap-scale packets), vs one saveStack per sequential put.
    const LEAF_COUNT = 500
    const keys: Uint8Array[] = []
    const values: Uint8Array[] = []
    for (let i = 0; i < LEAF_COUNT; i++) {
      keys.push(setLengthLeft(intToBytes(i), 32))
      values.push(setLengthLeft(intToBytes(i), 20))
    }

    let putHashCount = 0
    const countingPut = ((input: Uint8Array) => {
      putHashCount++
      return keccak_256(input)
    }) as typeof keccak_256

    const triePut = new MerklePatriciaTrie({ db: new MapDB(), useKeyHashingFunction: countingPut })
    const putStart = performance.now()
    for (let i = 0; i < LEAF_COUNT; i++) {
      await triePut.put(keys[i]!, values[i]!)
    }
    const putMs = performance.now() - putStart

    let verifyHashCount = 0
    const countingVerify = ((input: Uint8Array) => {
      verifyHashCount++
      return keccak_256(input)
    }) as typeof keccak_256

    await verifyMerkleRangeProof(triePut.root(), null, null, keys, values, null, countingVerify)

    assert.ok(
      verifyHashCount * 4 <= putHashCount,
      `expected at least 4x hash reduction, got ${(putHashCount / verifyHashCount).toFixed(2)}x`,
    )
    if (putMs > 20) {
      let batchHashCount = 0
      const countingBatch = ((input: Uint8Array) => {
        batchHashCount++
        return keccak_256(input)
      }) as typeof keccak_256
      const trieBatch = new MerklePatriciaTrie({
        db: new MapDB(),
        useKeyHashingFunction: countingBatch,
      })
      const batchStart = performance.now()
      await trieBatch.putSortedLeaves(keys, values)
      const batchMs = performance.now() - batchStart
      assert.strictEqual(batchMs < putMs, true)
      assert.ok(batchHashCount * 4 <= putHashCount)
    }
  })

  it('verifyMerkleRangeProof() threads useKeyHashingFunction on all proof shapes', async () => {
    const { trie, entries } = await randomTrie(new MapDB())
    let hashCount = 0
    const countingHash = ((input: Uint8Array) => {
      hashCount++
      return keccak_256(input)
    }) as typeof keccak_256

    const allKeys = entries.map(([key]) => key)
    const allValues = entries.map(([, val]) => val)
    hashCount = 0
    await verifyMerkleRangeProof(trie.root(), null, null, allKeys, allValues, null, countingHash)
    assert.ok(hashCount > 0, 'all-elements proof must hash trie nodes')

    const start = 255
    const oneKey = entries[start]![0]
    const oneVal = entries[start]![1]
    const oneProof = [
      ...(await createMerkleProof(trie, oneKey)),
      ...(await createMerkleProof(trie, oneKey)),
    ]
    hashCount = 0
    await verifyMerkleRangeProof(
      trie.root(),
      oneKey,
      oneKey,
      [oneKey],
      [oneVal],
      oneProof,
      countingHash,
    )
    assert.ok(hashCount > 0, 'one-element proof must hash trie nodes')

    const zeroTrie = new MerklePatriciaTrie({ db: new MapDB() })
    const loneKey = hexToBytes(`0x${'ff'.repeat(32)}`)
    await zeroTrie.put(loneKey, randomBytes(20))
    const zeroOrigin = hexToBytes(`0x${'00'.repeat(32)}`)
    const zeroProof = await createMerkleProof(zeroTrie, zeroOrigin)
    hashCount = 0
    await verifyMerkleRangeProof(zeroTrie.root(), zeroOrigin, null, [], [], zeroProof, countingHash)
    assert.ok(hashCount > 0, 'zero-element proof must hash trie nodes')

    hashCount = 0
    await verify(trie, entries, 0, entries.length - 1, undefined, undefined, allKeys, allValues)
    assert.strictEqual(hashCount, 0, 'default verify() must not use a custom hasher')

    hashCount = 0
    const firstKey = entries[0]![0]
    const lastKey = entries[entries.length - 1]![0]
    const edgeProof = [
      ...(await createMerkleProof(trie, firstKey)),
      ...(await createMerkleProof(trie, lastKey)),
    ]
    await verifyMerkleRangeProof(
      trie.root(),
      firstKey,
      lastKey,
      allKeys,
      allValues,
      edgeProof,
      countingHash,
    )
    assert.ok(hashCount > 0, 'two-edge proof must hash trie nodes')
  })

  it('putSortedLeaves() two-edge proof on sequential keys matches root and hasRight', async () => {
    const LEAF_COUNT = 500
    const entries: [Uint8Array, Uint8Array][] = []
    const trie = new MerklePatriciaTrie({ db: new MapDB() })
    for (let i = 0; i < LEAF_COUNT; i++) {
      const key = setLengthLeft(intToBytes(i), 32)
      const val = setLengthLeft(intToBytes(i), 20)
      await trie.put(key, val)
      entries.push([key, val])
    }
    const firstKey = entries[0]![0]
    const lastKey = entries[LEAF_COUNT - 1]![0]
    const keys = entries.map(([k]) => k)
    const values = entries.map(([, v]) => v)
    const hasRight = await verify(trie, entries, 0, LEAF_COUNT - 1, firstKey, lastKey, keys, values)
    assert.strictEqual(hasRight, false)
  })

  it('putSortedLeaves() matches sequential put() on empty-byte and variable-length keys', async () => {
    const pairs: [Uint8Array, Uint8Array][] = [
      [new Uint8Array(0), new Uint8Array([0x01])],
      [new Uint8Array([0x00]), new Uint8Array([0x02])],
      [new Uint8Array([0x00, 0x01]), new Uint8Array([0x03])],
      [new Uint8Array([0x00, 0x01, 0x02]), new Uint8Array([0x04])],
      [new Uint8Array([0x00, 0x0f]), new Uint8Array([0x05])],
      [new Uint8Array([0x10]), new Uint8Array([0x06])],
    ]
    const trieSeq = new MerklePatriciaTrie({ db: new MapDB() })
    for (const [k, v] of pairs) {
      await trieSeq.put(k, v)
    }
    const trieBatch = new MerklePatriciaTrie({ db: new MapDB() })
    await trieBatch.putSortedLeaves(
      pairs.map(([k]) => k),
      pairs.map(([, v]) => v),
    )
    assert.deepEqual(trieBatch.root(), trieSeq.root())
    for (const [k, v] of pairs) {
      assert.deepEqual(await trieBatch.get(k), v)
    }
  })
})
