import { RLP } from '@ethereumjs/rlp'
import {
  MapDB,
  compareBytes,
  equalsBytes,
  intToBytes,
  randomBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, expect, it } from 'vitest'

import {
  BinaryPathMPT,
  BranchMPTNode,
  MerklePatriciaTrie,
  verifyMerkleProof,
  verifyMerkleRangeProof,
} from '../../src/index.ts'
import type { NodeReferenceOrRawMPTNode } from '../../src/types.ts'

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

  it('16-way prefixed subtrees match classic full trie root', async () => {
    const classic = classicTrie()
    const subtrees = Array.from({ length: 16 }, (_, n) => new BinaryPathMPT({ prefixNibbles: [n] }))
    const keys: Uint8Array[] = []

    for (let i = 0; i < 2000; i++) {
      const n = i % 16
      const key = keyWithLeadingNibble(n)
      const val = randomBytes(20)
      keys.push(key)
      await classic.put(key, val)
      await subtrees[n]!.put(key, val)
    }

    await assert16WayAssembly(classic, subtrees)

    for (let round = 0; round < 30; round++) {
      const key = keys[randomBytes(2)[0]! % keys.length]!
      const n = key[0]! >> 4
      const op = randomBytes(1)[0]! % 2
      if (op === 0) {
        const nv = randomBytes(24)
        await classic.put(key, nv)
        await subtrees[n]!.put(key, nv)
      } else {
        await classic.del(key)
        await subtrees[n]!.del(key)
        const idx = keys.findIndex((k) => equalsBytes(k, key))
        if (idx >= 0) keys.splice(idx, 1)
        const nk = keyWithLeadingNibble(n)
        const nv = randomBytes(20)
        keys.push(nk)
        await classic.put(nk, nv)
        await subtrees[n]!.put(nk, nv)
      }
      await assert16WayAssembly(classic, subtrees)
    }
  })

  it('external leaf store backs values without duplicating leaf path records', async () => {
    const leafMap = new Map<string, Uint8Array>()
    const leaves = {
      get: async (key: Uint8Array) => leafMap.get(Buffer.from(key).toString('hex')) ?? null,
      put: async (key: Uint8Array, val: Uint8Array) => {
        leafMap.set(Buffer.from(key).toString('hex'), val)
      },
      del: async (key: Uint8Array) => {
        leafMap.delete(Buffer.from(key).toString('hex'))
      },
    }
    const classic = classicTrie()
    const binary = new BinaryPathMPT({ leaves })
    for (let i = 0; i < 100; i++) {
      const key = randomBytes(32)
      const val = randomBytes(16)
      await classic.put(key, val)
      await binary.put(key, val)
      await assertRootsMatch(classic, binary)
      expect(await binary.get(key)).toEqual(val)
    }
    const rootPath = new Uint8Array([0])
    const rootRecord = await binary._inner.pathStore.getNode(rootPath)
    expect(rootRecord === null || !hasLeafTag(rootRecord)).toBe(true)
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

async function assert16WayAssembly(classic: MerklePatriciaTrie, subtrees: BinaryPathMPT[]) {
  const slots = subtrees.map((t) => t.branchSlotReference())
  for (let n = 0; n < 16; n++) {
    const fromClassic = await classicBranchSlot(classic, n)
    assert(equalsBytes(fromClassic, subtrees[n]!.root()), `subtree ${n} root vs classic slot`)
    assert(equalsBytes(slots[n]!, fromClassic), `branchSlotReference ${n}`)
  }
  assert(equalsBytes(classic.root(), assemble16WayRoot(slots)))
}

function assemble16WayRoot(slots: ReadonlyArray<Uint8Array>): Uint8Array {
  const branch: Uint8Array[] = []
  for (let i = 0; i < 16; i++) {
    branch.push(slots[i] ?? new Uint8Array(0))
  }
  branch.push(new Uint8Array(0))
  return keccak_256(RLP.encode(branch))
}

async function classicBranchSlot(trie: MerklePatriciaTrie, slot: number): Promise<Uint8Array> {
  if (equalsBytes(trie.root(), trie.EMPTY_TRIE_ROOT)) {
    return new Uint8Array(0)
  }
  const root = await trie.lookupNode(trie.root())
  if (!(root instanceof BranchMPTNode)) {
    return trie.root()
  }
  const ref = root.getBranch(slot)
  if (ref === null) return new Uint8Array(0)
  return branchRefToSlotBytes(ref)
}

function branchRefToSlotBytes(ref: NodeReferenceOrRawMPTNode): Uint8Array {
  if (ref instanceof Uint8Array) {
    return ref
  }
  return RLP.encode(ref)
}

function hasLeafTag(record: Uint8Array): boolean {
  const bodyEnd = record.length - 32
  return bodyEnd > 0 && record[0] === 0x03
}

function hexToKey(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}
