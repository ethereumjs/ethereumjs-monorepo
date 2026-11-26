import {
  MapDB,
  compareBytes,
  equalsBytes,
  intToBytes,
  randomBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import {
  BinaryPathMPT,
  MerklePatriciaTrie,
  verifyMerkleProof,
  verifyMerkleRangeProof,
} from '../../src/index.ts'

function classicTrie() {
  return new MerklePatriciaTrie({ useKeyHashing: false, db: new MapDB() })
}

function keyWithLeadingNibble(n: number): Uint8Array {
  const k = randomBytes(32)
  k[0] = (n << 4) | (k[0]! & 0x0f)
  return k
}

async function assertRootsMatch(classic: MerklePatriciaTrie, binary: BinaryPathMPT) {
  assert(equalsBytes(classic.root(), binary.root()), 'root mismatch vs classic oracle')
}

describe('BinaryPathMPT', () => {
  it('matches classic trie — empty, single key, delete, stream build', async () => {
    const classic = classicTrie()
    const binary = new BinaryPathMPT()
    await assertRootsMatch(classic, binary)

    const k = randomBytes(32)
    const v = randomBytes(8)
    await classic.put(k, v)
    await binary.put(k, v)
    await assertRootsMatch(classic, binary)
    expect(await binary.get(k)).toEqual(v)

    await classic.del(k)
    await binary.del(k)
    await assertRootsMatch(classic, binary)

    const streamEntries: { key: Uint8Array; value: Uint8Array }[] = []
    const classic2 = classicTrie()
    for (let i = 0; i < 64; i++) {
      const key = setLengthLeft(intToBytes(i), 32)
      const value = randomBytes(20)
      streamEntries.push({ key, value })
      await classic2.put(key, value)
    }
    streamEntries.sort((a, b) => compareBytes(a.key, b.key))
    const fromStream = await BinaryPathMPT.buildFromSortedStream(streamEntries)
    await assertRootsMatch(classic2, fromStream)
  })

  it('matches classic trie — 500 random keys, 20 mutation rounds', async () => {
    const classic = classicTrie()
    const binary = new BinaryPathMPT()
    const entries = new Map<string, Uint8Array>()

    for (let i = 0; i < 500; i++) {
      const key = randomBytes(32)
      const val = randomBytes((randomBytes(1)[0]! % 24) + 1)
      entries.set(Buffer.from(key).toString('hex'), val)
      await classic.put(key, val)
      await binary.put(key, val)
      await assertRootsMatch(classic, binary)
    }

    for (let round = 0; round < 20; round++) {
      const keys = [...entries.keys()]
      const pick = hexToKey(keys[randomBytes(1)[0]! % keys.length]!)
      const op = randomBytes(1)[0]! % 3
      if (op === 0) {
        const nv = randomBytes(16)
        entries.set(Buffer.from(pick).toString('hex'), nv)
        await classic.put(pick, nv)
        await binary.put(pick, nv)
      } else if (op === 1 && entries.size > 10) {
        entries.delete(Buffer.from(pick).toString('hex'))
        await classic.del(pick)
        await binary.del(pick)
      } else {
        const nk = randomBytes(32)
        const nv = randomBytes(12)
        entries.set(Buffer.from(nk).toString('hex'), nv)
        await classic.put(nk, nv)
        await binary.put(nk, nv)
      }
      await assertRootsMatch(classic, binary)
    }

    const batch = [...entries.entries()].map(([hex, value]) => ({
      key: hexToKey(hex),
      value,
    }))
    batch.sort((a, b) => compareBytes(a.key, b.key))
    const classicBatch = classicTrie()
    for (const row of batch) {
      await classicBatch.put(row.key, row.value)
    }
    const binaryBatch = new BinaryPathMPT()
    await binaryBatch.applyBatch(batch)
    await assertRootsMatch(classicBatch, binaryBatch)
  })

  it('prefixNibbles rejects keys outside custody bucket', async () => {
    const trie = new BinaryPathMPT({ prefixNibbles: [0xa] })
    const ok = keyWithLeadingNibble(0xa)
    await trie.put(ok, randomBytes(8))
    await expect(trie.put(keyWithLeadingNibble(0xb), randomBytes(8))).rejects.toThrow(/prefix/)
  })

  it('proofs verify against classic — inclusion, exclusion, multi, range, anchor', async () => {
    const classic = classicTrie()
    const binary = new BinaryPathMPT()
    const sorted: { key: Uint8Array; value: Uint8Array }[] = []

    for (let i = 0; i < 200; i++) {
      const key = setLengthLeft(intToBytes(i), 32)
      const val = randomBytes(18)
      sorted.push({ key, value: val })
      await classic.put(key, val)
      await binary.put(key, val)
    }
    sorted.sort((a, b) => compareBytes(a.key, b.key))

    const anchorId = 'a1'
    const anchoredRoot = binary.captureAnchor(anchorId)

    const extraKey = randomBytes(32)
    const extraVal = randomBytes(8)
    await binary.put(extraKey, extraVal)
    await classic.put(extraKey, extraVal)

    const present = sorted[42]!.key
    const missing = randomBytes(32)

    for (const key of [present, missing]) {
      const proof = await binary.createProof(key)
      const vLive = await verifyMerkleProof(key, proof, {
        root: binary.root(),
        useKeyHashing: false,
      })
      const classicVal = await classic.get(key)
      expect(vLive).toEqual(classicVal)

      const proofAnchor = await binary.createProof(key, anchorId)
      const vAnchor = await verifyMerkleProof(key, proofAnchor, {
        root: anchoredRoot,
        useKeyHashing: false,
      })
      const expectedAtAnchor = key === present ? sorted[42]!.value : null
      if (key === present) {
        expect(vAnchor).toEqual(expectedAtAnchor)
      } else {
        expect(vAnchor).toEqual(null)
      }
    }

    const multi = await binary.createMultiProof([sorted[0]!.key, sorted[50]!.key, sorted[99]!.key])
    for (const key of [sorted[0]!.key, sorted[50]!.key, sorted[99]!.key]) {
      const v = await verifyMerkleProof(key, multi, { root: binary.root(), useKeyHashing: false })
      expect(v).toEqual(await classic.get(key))
    }

    const origin = sorted[10]!.key
    const last = sorted[80]!.key
    const rangeProof = await binary.createRangeBoundaryProof(origin, last)
    const rangeKeys = sorted.slice(10, 81).map((r) => r.key)
    const rangeVals = sorted.slice(10, 81).map((r) => r.value)
    assert(
      await verifyMerkleRangeProof(binary.root(), origin, last, rangeKeys, rangeVals, rangeProof),
    )
  })

  it('buildFromSortedStream — 10k keys within CI budget', async () => {
    const rows: { key: Uint8Array; value: Uint8Array }[] = []
    for (let i = 0; i < 10_000; i++) {
      rows.push({ key: setLengthLeft(intToBytes(i), 32), value: randomBytes(32) })
    }
    const classic = classicTrie()
    const t0 = performance.now()
    for (const row of rows) {
      await classic.put(row.key, row.value)
    }
    const classicMs = performance.now() - t0

    const t1 = performance.now()
    const binary = await BinaryPathMPT.buildFromSortedStream(rows)
    const binaryMs = performance.now() - t1

    await assertRootsMatch(classic, binary)
    expect(classicMs + binaryMs).toBeLessThan(2000)
  })
})

function hexToKey(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}
