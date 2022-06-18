import * as crypto from 'crypto'
import * as tape from 'tape'
import { setLengthLeft, toBuffer } from '@ethereumjs/util'
import { DB, LevelDB, Trie } from '../../src'

// reference: https://github.com/ethereum/go-ethereum/blob/20356e57b119b4e70ce47665a71964434e15200d/trie/proof_test.go

const TRIE_SIZE = 512

/**
 * Create a random trie.
 * @param addKey - whether to add 100 ordered keys
 * @returns Trie object and sorted entries
 */
async function randomTrie(db: DB, addKey: boolean = true) {
  const entries: [Buffer, Buffer][] = []
  const trie = new Trie({ db })

  if (addKey) {
    for (let i = 0; i < 100; i++) {
      const key = setLengthLeft(toBuffer(i), 32)
      const val = toBuffer(i)
      await trie.put(key, val)
      entries.push([key, val])
    }
  }

  for (let i = 0; i < TRIE_SIZE; i++) {
    const key = crypto.randomBytes(32)
    const val = crypto.randomBytes(20)
    if ((await trie.get(key)) === null) {
      await trie.put(key, val)
      entries.push([key, val])
    }
  }

  return {
    trie,
    entries: entries.sort(([k1], [k2]) => k1.compare(k2)),
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

function decreaseKey(key: Buffer) {
  for (let i = key.length - 1; i >= 0; i--) {
    if (key[i] > 0) {
      return Buffer.concat([key.slice(0, i), toBuffer(key[i] - 1), key.slice(i + 1)])
    }
  }
}

function increaseKey(key: Buffer) {
  for (let i = key.length - 1; i >= 0; i--) {
    if (key[i] < 255) {
      return Buffer.concat([key.slice(0, i), toBuffer(key[i] + 1), key.slice(i + 1)])
    }
  }
}

async function verify(
  trie: Trie,
  entries: [Buffer, Buffer][],
  start: number,
  end: number,
  startKey?: Buffer,
  endKey?: Buffer,
  keys?: Buffer[],
  vals?: Buffer[]
) {
  startKey = startKey ?? entries[start][0]
  endKey = endKey ?? entries[end][0]
  const targetRange = entries.slice(start, end + 1)
  return await Trie.verifyRangeProof(
    trie.root,
    startKey,
    endKey,
    keys ?? targetRange.map(([key]) => key),
    vals ?? targetRange.map(([, val]) => val),
    [...(await Trie.createProof(trie, startKey)), ...(await Trie.createProof(trie, endKey))]
  )
}

tape('simple merkle range proofs generation and verification', function (tester) {
  const it = tester.test

  it('create a range proof and verify it', async (t) => {
    const { trie, entries } = await randomTrie(new LevelDB())

    for (let i = 0; i < 10; i++) {
      const start = getRandomIntInclusive(0, entries.length - 2)
      const end = getRandomIntInclusive(start + 1, entries.length - 1)
      t.equal(await verify(trie, entries, start, end), end !== entries.length - 1)
    }

    t.equal(await verify(trie, entries, entries.length - 2, entries.length - 1), false)

    t.end()
  })

  it('create a non-existent range proof and verify it', async (t) => {
    const { trie, entries } = await randomTrie(new LevelDB())

    for (let i = 0; i < 10; i++) {
      const start = getRandomIntInclusive(0, entries.length - 1)
      const end = getRandomIntInclusive(start, entries.length - 1)

      const startKey = decreaseKey(entries[start][0])
      if (!startKey || (start > 0 && entries[start - 1][0].compare(startKey) >= 0)) {
        continue
      }

      const endKey = increaseKey(entries[end][0])
      if (!endKey || (end < entries.length - 1 && endKey.compare(entries[end + 1][0]) >= 0)) {
        continue
      }

      t.equal(await verify(trie, entries, start, end, startKey, endKey), end !== entries.length - 1)
    }

    // Special case, two edge proofs for two edge key.
    const startKey = Buffer.from('00'.repeat(32), 'hex')
    const endKey = Buffer.from('ff'.repeat(32), 'hex')
    t.equal(await verify(trie, entries, 0, entries.length - 1, startKey, endKey), false)

    t.end()
  })

  it('create invalid non-existent range proof and verify it', async (t) => {
    const { trie, entries } = await randomTrie(new LevelDB())

    const start = 100
    const end = 200
    const startKey = entries[start][0]
    const endKey = entries[end][0]
    const decreasedStartKey = decreaseKey(startKey)!
    const increasedEndKey = increaseKey(endKey)!

    t.equal(await verify(trie, entries, start, end, decreasedStartKey, endKey), true)
    try {
      await verify(trie, entries, start + 5, end, decreasedStartKey)
      t.fail()
    } catch (err) {
      // ignore ..
    }

    t.equal(await verify(trie, entries, start, end, startKey, increasedEndKey), true)
    try {
      await verify(trie, entries, start, end + 5, startKey, increasedEndKey)
      t.fail()
    } catch (err) {
      // ignore ..
    }
  })

  it('create a one element range proof and verify it', async (t) => {
    const { trie, entries } = await randomTrie(new LevelDB())

    const start = 255
    const startKey = entries[start][0]
    const endKey = startKey
    const decreasedStartKey = decreaseKey(startKey)!
    const increasedEndKey = increaseKey(endKey)!

    // One element with existent edge proof, both edge proofs
    // point to the SAME key.
    t.equal(await verify(trie, entries, start, start, startKey), true)

    // One element with left non-existent edge proof
    t.equal(await verify(trie, entries, start, start, decreasedStartKey), true)

    // One element with right non-existent edge proof
    t.equal(await verify(trie, entries, start, start, undefined, increasedEndKey), true)

    // One element with two non-existent edge proofs
    t.equal(await verify(trie, entries, start, start, decreasedStartKey, increasedEndKey), true)

    // Test the mini trie with only a single element.
    const tinyTrie = new Trie({ db: new LevelDB() })
    const tinyEntries: [Buffer, Buffer][] = [[crypto.randomBytes(32), crypto.randomBytes(20)]]
    await tinyTrie.put(tinyEntries[0][0], tinyEntries[0][1])

    const tinyStartKey = Buffer.from('00'.repeat(32), 'hex')
    t.equal(await verify(tinyTrie, tinyEntries, 0, 0, tinyStartKey), false)
  })

  it('create all element range proof and verify it', async (t) => {
    const { trie, entries } = await randomTrie(new LevelDB())

    t.equal(
      await Trie.verifyRangeProof(
        trie.root,
        null,
        null,
        entries.map(([key]) => key),
        entries.map(([, val]) => val),
        null
      ),
      false
    )

    // With edge proofs, it should still work.
    t.equal(await verify(trie, entries, 0, entries.length - 1), false)

    // Even with non-existent edge proofs, it should still work.
    t.equal(
      await verify(
        trie,
        entries,
        0,
        entries.length - 1,
        Buffer.from('00'.repeat(32), 'hex'),
        Buffer.from('ff'.repeat(32), 'hex')
      ),
      false
    )
  })

  it('create a single side range proof and verify it', async (t) => {
    const startKey = Buffer.from('00'.repeat(32), 'hex')
    const { trie, entries } = await randomTrie(new LevelDB(), false)

    const cases = [0, 1, 200, entries.length - 1]
    for (const end of cases) {
      t.equal(await verify(trie, entries, 0, end, startKey), end !== entries.length - 1)
    }
  })

  it('create a revert single side range proof and verify it', async (t) => {
    const endKey = Buffer.from('ff'.repeat(32), 'hex')
    const { trie, entries } = await randomTrie(new LevelDB(), false)

    const cases = [0, 1, 200, entries.length - 1]
    for (const start of cases) {
      t.equal(await verify(trie, entries, start, entries.length - 1, undefined, endKey), false)
    }
  })

  it('create a bad range proof and verify it', async (t) => {
    const runTest = async (cb: (trie: Trie, entries: [Buffer, Buffer][]) => Promise<void>) => {
      const { trie, entries } = await randomTrie(new LevelDB(), false)

      let result = false
      try {
        await cb(trie, entries)
        result = true
      } catch (err) {
        // ignore
      }
      t.assert(!result)
    }

    // Modified key
    await runTest(async (trie, entries) => {
      const start = getRandomIntInclusive(0, entries.length - 2)
      const end = getRandomIntInclusive(start + 1, entries.length - 1)
      const targetIndex = getRandomIntInclusive(start, end)
      entries[targetIndex][0] = crypto.randomBytes(32)
      await verify(trie, entries, start, end)
    })

    // Modified val
    await runTest(async (trie, entries) => {
      const start = getRandomIntInclusive(0, entries.length - 2)
      const end = getRandomIntInclusive(start + 1, entries.length - 1)
      const targetIndex = getRandomIntInclusive(start, end)
      entries[targetIndex][1] = crypto.randomBytes(20)
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

  it('create a gapped range proof and verify it', async (t) => {
    const trie = new Trie({ db: new LevelDB() })
    const entries: [Buffer, Buffer][] = []
    for (let i = 0; i < 10; i++) {
      const key = setLengthLeft(toBuffer(i), 32)
      const val = toBuffer(i)
      await trie.put(key, val)
      entries.push([key, val])
    }

    const start = 2
    const end = 8
    const targetRange: [Buffer, Buffer][] = []
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
        targetRange.map(([, val]) => val)
      )
      result = true
    } catch (err) {
      // ignore
    }
    t.assert(!result)
  })

  it('create a same side range proof and verify it', async (t) => {
    const { trie, entries } = await randomTrie(new LevelDB())

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
    } catch (err) {
      // ignore
    }
    t.assert(!result)

    const increasedStartKey = increaseKey(startKey)!
    const increasedEndKey = increaseKey(increaseKey(endKey)!)!

    result = false
    try {
      await verify(trie, entries, start, end, increasedStartKey, increasedEndKey)
      result = true
    } catch (err) {
      // ignore
    }
    t.assert(!result)
  })

  it('should hasRightElement succeed', async (t) => {
    const { trie, entries } = await randomTrie(new LevelDB(), false)

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
      let startKey: Buffer
      let endKey: Buffer

      if (start === -1) {
        start = 0
        startKey = Buffer.from('00'.repeat(32), 'hex')
      } else {
        startKey = entries[start][0]
      }

      if (end === -1) {
        end = entries.length - 1
        endKey = Buffer.from('ff'.repeat(32), 'hex')
      } else {
        endKey = entries[end][0]
      }

      t.equal(await verify(trie, entries, start, end, startKey, endKey), expect)
    }
  })

  it('create a bloated range proof and verify it', async (t) => {
    const { trie, entries } = await randomTrie(new LevelDB(), false)

    let bloatedProof: Buffer[] = []
    for (let i = 0; i < TRIE_SIZE; i++) {
      bloatedProof = bloatedProof.concat(await Trie.createProof(trie, entries[i][0]))
    }

    t.equal(await verify(trie, entries, 0, entries.length - 1), false)
  })
})
