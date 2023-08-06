import {
  MapDB,
  bytesToUtf8,
  compareBytes,
  concatBytes,
  hexToBytes,
  setLengthLeft,
  toBytes,
  utf8ToBytes,
} from '@ethereumjs/util'
import * as crypto from 'crypto'
import { randomBytes } from 'crypto'
import { assert, describe, it } from 'vitest'

import { Trie } from '../../src/index.js'

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
  const trie = new Trie({ db })

  if (addKey) {
    for (let i = 0; i < 100; i++) {
      const key = setLengthLeft(toBytes(i), 32)
      const val = toBytes(i)
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
  return trie.verifyRangeProof(
    trie.root(),
    startKey,
    endKey,
    keys ?? targetRange.map(([key]) => key),
    vals ?? targetRange.map(([, val]) => val),
    [...(await trie.createProof(startKey)), ...(await trie.createProof(endKey))]
  )
}

describe('simple merkle proofs generation and verification', () => {
  it('create a merkle proof and verify it', async () => {
    const trie = new Trie()

    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('0123456789012345678901234567890123456789xx'))
    await trie.put(utf8ToBytes('key2bb'), utf8ToBytes('aval2'))
    await trie.put(utf8ToBytes('key3cc'), utf8ToBytes('aval3'))

    let proof = await trie.createProof(utf8ToBytes('key2bb'))
    let val = await trie.verifyProof(trie.root(), utf8ToBytes('key2bb'), proof)
    assert.equal(bytesToUtf8(val!), 'aval2')

    proof = await trie.createProof(utf8ToBytes('key1aa'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
    assert.equal(bytesToUtf8(val!), '0123456789012345678901234567890123456789xx')

    proof = await trie.createProof(utf8ToBytes('key2bb'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('key2'), proof)
    // In this case, the proof _happens_ to contain enough nodes to prove `key2` because
    // traversing into `key22` would touch all the same nodes as traversing into `key2`
    assert.equal(val, null, 'Expected value at a random key to be null')

    let myKey = utf8ToBytes('anyrandomkey')
    proof = await trie.createProof(myKey)
    val = await trie.verifyProof(trie.root(), myKey, proof)
    assert.equal(val, null, 'Expected value to be null')

    myKey = utf8ToBytes('anothergarbagekey') // should generate a valid proof of null
    proof = await trie.createProof(myKey)
    proof.push(utf8ToBytes('123456')) // extra nodes are just ignored
    val = await trie.verifyProof(trie.root(), myKey, proof)
    assert.equal(val, null, 'Expected value to be null')

    await trie.put(utf8ToBytes('another'), utf8ToBytes('3498h4riuhgwe'))

    // to fail our proof we can request a proof for one key
    proof = await trie.createProof(utf8ToBytes('another'))
    // and try to use that proof on another key
    try {
      await trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
      assert.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      assert.equal(e.message, 'Invalid proof provided')
    }

    // we can also corrupt a valid proof
    proof = await trie.createProof(utf8ToBytes('key2bb'))
    proof[0].reverse()
    try {
      await trie.verifyProof(trie.root(), utf8ToBytes('key2bb'), proof)
      assert.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      assert.equal(e.message, 'Invalid proof provided')
    }

    // test an invalid exclusion proof by creating
    // a valid exclusion proof then making it non-null
    myKey = utf8ToBytes('anyrandomkey')
    proof = await trie.createProof(myKey)
    val = await trie.verifyProof(trie.root(), myKey, proof)
    assert.equal(val, null, 'Expected value to be null')
    // now make the key non-null so the exclusion proof becomes invalid
    await trie.put(myKey, utf8ToBytes('thisisavalue'))
    try {
      await trie.verifyProof(trie.root(), myKey, proof)
      assert.fail('expected error: Invalid proof provided')
    } catch (e: any) {
      assert.equal(e.message, 'Invalid proof provided')
    }
  })

  it('create a merkle proof and verify it with a single long key', async () => {
    const trie = new Trie()

    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('0123456789012345678901234567890123456789xx'))

    const proof = await trie.createProof(utf8ToBytes('key1aa'))
    const val = await trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
    assert.equal(bytesToUtf8(val!), '0123456789012345678901234567890123456789xx')
  })

  it('create a merkle proof and verify it with a single short key', async () => {
    const trie = new Trie()

    await trie.put(utf8ToBytes('key1aa'), utf8ToBytes('01234'))

    const proof = await trie.createProof(utf8ToBytes('key1aa'))
    const val = await trie.verifyProof(trie.root(), utf8ToBytes('key1aa'), proof)
    assert.equal(bytesToUtf8(val!), '01234')
  })

  it('create a merkle proof and verify it whit keys in the middle', async () => {
    const trie = new Trie()

    await trie.put(
      utf8ToBytes('key1aa'),
      utf8ToBytes('0123456789012345678901234567890123456789xxx')
    )
    await trie.put(
      utf8ToBytes('key1'),
      utf8ToBytes('0123456789012345678901234567890123456789Very_Long')
    )
    await trie.put(utf8ToBytes('key2bb'), utf8ToBytes('aval3'))
    await trie.put(utf8ToBytes('key2'), utf8ToBytes('short'))
    await trie.put(utf8ToBytes('key3cc'), utf8ToBytes('aval3'))
    await trie.put(utf8ToBytes('key3'), utf8ToBytes('1234567890123456789012345678901'))

    let proof = await trie.createProof(utf8ToBytes('key1'))
    let val = await trie.verifyProof(trie.root(), utf8ToBytes('key1'), proof)
    assert.equal(bytesToUtf8(val!), '0123456789012345678901234567890123456789Very_Long')

    proof = await trie.createProof(utf8ToBytes('key2'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('key2'), proof)
    assert.equal(bytesToUtf8(val!), 'short')

    proof = await trie.createProof(utf8ToBytes('key3'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('key3'), proof)
    assert.equal(bytesToUtf8(val!), '1234567890123456789012345678901')
  })

  it('should succeed with a simple embedded extension-branch', async () => {
    const trie = new Trie()

    await trie.put(utf8ToBytes('a'), utf8ToBytes('a'))
    await trie.put(utf8ToBytes('b'), utf8ToBytes('b'))
    await trie.put(utf8ToBytes('c'), utf8ToBytes('c'))

    let proof = await trie.createProof(utf8ToBytes('a'))
    let val = await trie.verifyProof(trie.root(), utf8ToBytes('a'), proof)
    assert.equal(bytesToUtf8(val!), 'a')

    proof = await trie.createProof(utf8ToBytes('b'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('b'), proof)
    assert.equal(bytesToUtf8(val!), 'b')

    proof = await trie.createProof(utf8ToBytes('c'))
    val = await trie.verifyProof(trie.root(), utf8ToBytes('c'), proof)
    assert.equal(bytesToUtf8(val!), 'c')
  })
})

describe('createRangeProof()', function () {
  it('throws when lKey is higher than rKey', async () => {
    const trie = new Trie({
      useKeyHashing: true,
    })

    await trie.put(hexToBytes('0x1000'), hexToBytes('0xa'))
    await trie.put(hexToBytes('0x1100'), hexToBytes('0xa'))

    const lKey = hexToBytes('0xff'.repeat(32))
    const rKey = hexToBytes('0x00'.repeat(32))
    try {
      await trie.createRangeProof(lKey, rKey)
      assert.fail('cannot reach this')
    } catch (e) {
      assert.ok('succesfully threw')
    }
  })
})

describe('simple merkle range proofs generation and verification', () => {
  it('create a range proof and verify it', async () => {
    const { trie, entries } = await randomTrie(new MapDB())

    for (let i = 0; i < 10; i++) {
      const start = getRandomIntInclusive(0, entries.length - 2)
      const end = getRandomIntInclusive(start + 1, entries.length - 1)
      assert.equal(await verify(trie, entries, start, end), end !== entries.length - 1)
    }

    assert.equal(await verify(trie, entries, entries.length - 2, entries.length - 1), false)
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

      assert.equal(
        await verify(trie, entries, start, end, startKey, endKey),
        end !== entries.length - 1
      )
    }

    // Special case, two edge proofs for two edge key.
    const startKey = hexToBytes('0x' + '00'.repeat(32))
    const endKey = hexToBytes('0x' + 'ff'.repeat(32))
    assert.equal(await verify(trie, entries, 0, entries.length - 1, startKey, endKey), false)
  })

  it('create invalid non-existent range proof and verify it', async () => {
    const { trie, entries } = await randomTrie(new MapDB())

    const start = 100
    const end = 200
    const startKey = entries[start][0]
    const endKey = entries[end][0]
    const decreasedStartKey = decreaseKey(startKey)!
    const increasedEndKey = increaseKey(endKey)!

    assert.equal(await verify(trie, entries, start, end, decreasedStartKey, endKey), true)
    try {
      await verify(trie, entries, start + 5, end, decreasedStartKey)
      assert.fail()
    } catch (err) {
      // ignore ..
    }

    assert.equal(await verify(trie, entries, start, end, startKey, increasedEndKey), true)
    try {
      await verify(trie, entries, start, end + 5, startKey, increasedEndKey)
      assert.fail()
    } catch (err) {
      // ignore ..
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
    assert.equal(await verify(trie, entries, start, start, startKey), true)

    // One element with left non-existent edge proof
    assert.equal(await verify(trie, entries, start, start, decreasedStartKey), true)

    // One element with right non-existent edge proof
    assert.equal(await verify(trie, entries, start, start, undefined, increasedEndKey), true)

    // One element with two non-existent edge proofs
    assert.equal(
      await verify(trie, entries, start, start, decreasedStartKey, increasedEndKey),
      true
    )

    // Test the mini trie with only a single element.
    const tinyTrie = new Trie()
    const tinyEntries: [Uint8Array, Uint8Array][] = [
      [crypto.randomBytes(32), crypto.randomBytes(20)],
    ]
    await tinyTrie.put(tinyEntries[0][0], tinyEntries[0][1])

    const tinyStartKey = hexToBytes('0x' + '00'.repeat(32))
    assert.equal(await verify(tinyTrie, tinyEntries, 0, 0, tinyStartKey), false)
  })

  it('create all element range proof and verify it', async () => {
    const { trie, entries } = await randomTrie(new MapDB())

    assert.equal(
      await trie.verifyRangeProof(
        trie.root(),
        null,
        null,
        entries.map(([key]) => key),
        entries.map(([, val]) => val),
        null
      ),
      false
    )

    // With edge proofs, it should still work.
    assert.equal(await verify(trie, entries, 0, entries.length - 1), false)

    // Even with non-existent edge proofs, it should still work.
    assert.equal(
      await verify(
        trie,
        entries,
        0,
        entries.length - 1,
        hexToBytes('0x' + '00'.repeat(32)),
        hexToBytes('0x' + 'ff'.repeat(32))
      ),
      false
    )
  })

  it('create a single side range proof and verify it', async () => {
    const startKey = hexToBytes('0x' + '00'.repeat(32))
    const { trie, entries } = await randomTrie(new MapDB(), false)

    const cases = [0, 1, 200, entries.length - 1]
    for (const end of cases) {
      assert.equal(await verify(trie, entries, 0, end, startKey), end !== entries.length - 1)
    }
  })

  it('create a revert single side range proof and verify it', async () => {
    const endKey = hexToBytes('0x' + 'ff'.repeat(32))
    const { trie, entries } = await randomTrie(new MapDB(), false)

    const cases = [0, 1, 200, entries.length - 1]
    for (const start of cases) {
      assert.equal(await verify(trie, entries, start, entries.length - 1, undefined, endKey), false)
    }
  })

  /**
   * TODO: Analyze tests below.
   * Should proof really fail for all of these reasons?
  it.skip('create a bad range proof and verify it', async () => {
    const runTest = async (
      cb: (trie: Trie, entries: [Uint8Array, Uint8Array][]) => Promise<void>
    ) => {
      const { trie, entries } = await randomTrie(new MapDB(), false)
 
      let result = false
      try {
        await cb(trie, entries)
        result = true
      } catch (err) {
        // ignore
      }
      assert.isFalse(result)
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
 
  it.skip('create a gapped range proof and verify it', async () => {
    const trie = new Trie()
    const entries: [Uint8Array, Uint8Array][] = []
    for (let i = 0; i < 10; i++) {
      const key = setLengthLeft(toBytes(i), 32)
      const val = toBytes(i)
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
        targetRange.map(([, val]) => val)
      )
      result = true
    } catch (err) {
      // ignore
    }
    assert.isFalse(result)
  })
 
  it.skip('create a same side range proof and verify it', async () => {
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
    } catch (err) {
      // ignore
    }
    assert.isFalse(result)
 
    const increasedStartKey = increaseKey(startKey)!
    const increasedEndKey = increaseKey(increaseKey(endKey)!)!
 
    result = false
    try {
      await verify(trie, entries, start, end, increasedStartKey, increasedEndKey)
      result = true
    } catch (err) {
      // ignore
    }
    assert.isFalse(result)
  })
  */

  it('should hasRightElement succeed', async () => {
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
        startKey = hexToBytes('0x' + '00'.repeat(32))
      } else {
        startKey = entries[start][0]
      }

      if (end === -1) {
        end = entries.length - 1
        endKey = hexToBytes('0x' + 'ff'.repeat(32))
      } else {
        endKey = entries[end][0]
      }

      assert.equal(await verify(trie, entries, start, end, startKey, endKey), expect)
    }
  })

  it('create a bloated range proof and verify it', async () => {
    const { trie, entries } = await randomTrie(new MapDB(), false)

    let bloatedProof: Uint8Array[] = []
    for (let i = 0; i < TRIE_SIZE; i++) {
      bloatedProof = bloatedProof.concat(await trie.createProof(entries[i][0]))
    }

    assert.equal(await verify(trie, entries, 0, entries.length - 1), false)
  })

  it(
    'passes randomly created tries with randomly selected ranges',
    async () => {
      for (let i = 0; i < 1; i++) {
        const trie = new Trie({
          useKeyHashing: true,
        })
        // Generate [100, 1000) key/value pairs
        const keyCount = 100 + Math.floor(Math.random() * 900)
        for (let j = 0; j < keyCount; j++) {
          await trie.put(randomBytes(32), randomBytes(32))
        }

        // 1000 verified requests
        for (let j = 0; j < 1; j++) {
          const lKey = randomBytes(32)
          let rKey = randomBytes(32)
          while (compareBytes(lKey, rKey) > 0) {
            rKey = randomBytes(32)
          }
          const proof = await trie.createRangeProof(lKey, rKey)
          const proverTrie = new Trie()
          if (proof.values.length === 1) {
            const reportedLKey = proof.keys[0]
            if (compareBytes(reportedLKey, rKey) > 0) {
              try {
                await proverTrie.verifyRangeProof(
                  trie.root(),
                  reportedLKey,
                  reportedLKey,
                  proof.keys,
                  proof.values,
                  proof.proof
                )
                assert.ok('succesfully verified')
              } catch (e: any) {
                assert.fail('could not verify')
              }
            } else {
              try {
                await proverTrie.verifyRangeProof(
                  trie.root(),
                  lKey,
                  rKey,
                  proof.keys,
                  proof.values,
                  proof.proof
                )
                assert.ok('succesfully verified')
              } catch (e: any) {
                assert.fail('could not verify')
              }
            }
          }
        }
      }
    },
    { retry: 3 }
  )
})
