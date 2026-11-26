import { RLP } from '@ethereumjs/rlp'
import {
  MapDB,
  bytesToHex,
  compareBytes,
  equalsBytes,
  hexToBytes,
  intToBytes,
  randomBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, expect, it } from 'vitest'

import { TAG_EXTERNAL_LEAF, TAG_LEAF } from '../../src/binaryPath/nodeCodec.ts'
import type { BinaryPathBatchOp, BinaryPathNodeStore } from '../../src/binaryPath/types.ts'
import {
  BinaryPathMPT,
  BranchMPTNode,
  InMemoryBinaryPathStore,
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

/** In-memory BinaryPathNodeStore with inspection helper for white-box persistence tests. */
class SpyBinaryPathStore implements BinaryPathNodeStore {
  readonly records = new Map<string, Uint8Array>()

  async getNode(pathKey: Uint8Array): Promise<Uint8Array | null> {
    const found = this.records.get(bytesToHex(pathKey))
    if (found === undefined) return null
    const copy = new Uint8Array(found.length)
    copy.set(found)
    return copy
  }

  async putNode(pathKey: Uint8Array, bytes: Uint8Array): Promise<void> {
    const copy = new Uint8Array(bytes.length)
    copy.set(bytes)
    this.records.set(bytesToHex(pathKey), copy)
  }

  async deleteNode(pathKey: Uint8Array): Promise<void> {
    this.records.delete(bytesToHex(pathKey))
  }

  async applyBatch(ops: ReadonlyArray<BinaryPathBatchOp>): Promise<void> {
    for (const op of ops) {
      const k = bytesToHex(op.pathKey)
      if (op.type === 'put') {
        const copy = new Uint8Array(op.bytes.length)
        copy.set(op.bytes)
        this.records.set(k, copy)
      } else {
        this.records.delete(k)
      }
    }
  }
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
      entries.set(bytesToHex(key), val)
      await classic.put(key, val)
      await binary.put(key, val)
      await assertRootsMatch(classic, binary)
    }

    for (let round = 0; round < 20; round++) {
      const keys = [...entries.keys()]
      const pick = hexToBytes(keys[randomBytes(1)[0]! % keys.length]! as `0x${string}`)
      const op = randomBytes(1)[0]! % 3
      if (op === 0) {
        const nv = randomBytes(16)
        entries.set(bytesToHex(pick), nv)
        await classic.put(pick, nv)
        await binary.put(pick, nv)
      } else if (op === 1 && entries.size > 10) {
        entries.delete(bytesToHex(pick))
        await classic.del(pick)
        await binary.del(pick)
      } else {
        const nk = randomBytes(32)
        const nv = randomBytes(12)
        entries.set(bytesToHex(nk), nv)
        await classic.put(nk, nv)
        await binary.put(nk, nv)
      }
      await assertRootsMatch(classic, binary)
    }

    const batch = [...entries.entries()].map(([hex, value]) => ({
      key: hexToBytes(hex as `0x${string}`),
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

  it('reopens persisted BinaryPathNodeStore cleanly via BinaryPathMPT.open()', async () => {
    const store = new InMemoryBinaryPathStore()
    const classic = classicTrie()
    const writer = new BinaryPathMPT({ store })
    const keys: Uint8Array[] = []

    for (let i = 0; i < 150; i++) {
      const key = randomBytes(32)
      const val = randomBytes(24)
      keys.push(key)
      await classic.put(key, val)
      await writer.put(key, val)
    }
    // Mutate and delete a few keys before closing
    for (let i = 0; i < 15; i++) {
      await classic.del(keys[i]!)
      await writer.del(keys[i]!)
    }
    await assertRootsMatch(classic, writer)

    // Reopen a fresh BinaryPathMPT backed ONLY by `store` (zero shared RAM state)
    const reopened = await BinaryPathMPT.open({ store })
    await assertRootsMatch(classic, reopened)

    for (let i = 0; i < 15; i++) {
      expect(await reopened.get(keys[i]!)).toBeNull()
    }
    for (let i = 15; i < 40; i++) {
      expect(await reopened.get(keys[i]!)).toEqual(await classic.get(keys[i]!))
      const proof = await reopened.createProof(keys[i]!)
      const verified = await verifyMerkleProof(keys[i]!, proof, {
        root: reopened.root(),
        useKeyHashing: false,
      })
      expect(verified).toEqual(await classic.get(keys[i]!))
    }

    // Continue mutating after reopen
    const extraKey = randomBytes(32)
    const extraVal = randomBytes(40)
    await classic.put(extraKey, extraVal)
    await reopened.put(extraKey, extraVal)
    await assertRootsMatch(classic, reopened)
  })

  it('handles inline < 32B child nodes across grow, shrink, and delete transitions', async () => {
    const classic = classicTrie()
    const binary = new BinaryPathMPT()
    const k1 = new Uint8Array([0x01, 0x01])
    const k2 = new Uint8Array([0x01, 0x02])
    const k3 = new Uint8Array([0x01, 0x03])

    // All three leaves are tiny (< 32B RLP) -> inline children
    await classic.put(k1, new Uint8Array([1]))
    await binary.put(k1, new Uint8Array([1]))
    await assertRootsMatch(classic, binary)

    await classic.put(k2, new Uint8Array([2]))
    await binary.put(k2, new Uint8Array([2]))
    await assertRootsMatch(classic, binary)

    await classic.put(k3, new Uint8Array([3]))
    await binary.put(k3, new Uint8Array([3]))
    await assertRootsMatch(classic, binary)

    for (const k of [k1, k2, k3]) {
      const proof = await binary.createProof(k)
      const val = await verifyMerkleProof(k, proof, { root: binary.root(), useKeyHashing: false })
      expect(val).toEqual(await classic.get(k))
    }

    // Grow k2 >= 32B so it moves from inline to hashed path record
    const bigVal = randomBytes(64)
    await classic.put(k2, bigVal)
    await binary.put(k2, bigVal)
    await assertRootsMatch(classic, binary)

    // Shrink k2 back < 32B so it becomes inline again (and deletes stale path record)
    await classic.put(k2, new Uint8Array([9]))
    await binary.put(k2, new Uint8Array([9]))
    await assertRootsMatch(classic, binary)

    // Delete down to empty
    for (const k of [k1, k2, k3]) {
      await classic.del(k)
      await binary.del(k)
      await assertRootsMatch(classic, binary)
    }
  })

  it('prefixNibbles rejects keys outside custody bucket', async () => {
    const trie = new BinaryPathMPT({ prefixNibbles: [0xa] })
    const ok = keyWithLeadingNibble(0xa)
    await trie.put(ok, randomBytes(8))
    await expect(trie.put(keyWithLeadingNibble(0xb), randomBytes(8))).rejects.toThrow(/prefix/)
  })

  it('16-way prefixed subtrees match classic full trie root and compose full Merkle proofs', async () => {
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

    // Verify WP-16e § 2.1 proof interop: prepend 16-way parent branch RLP to a prefixed subtree proof
    const parentBranchRlp = encode16WayBranch(subtrees.map((t) => t.branchSlotReference()))
    for (const sampleKey of keys.slice(0, 16)) {
      const bucket = sampleKey[0]! >> 4
      const subProof = await subtrees[bucket]!.createProof(sampleKey)
      const fullProof = [parentBranchRlp, ...subProof]
      const verified = await verifyMerkleProof(sampleKey, fullProof, {
        root: classic.root(),
        useKeyHashing: false,
      })
      expect(verified).toEqual(await classic.get(sampleKey))
    }
    // Exclusion proof across the 16-way boundary
    const missingKey = keyWithLeadingNibble(7)
    const missingSubProof = await subtrees[7]!.createProof(missingKey)
    const missingVerified = await verifyMerkleProof(
      missingKey,
      [parentBranchRlp, ...missingSubProof],
      {
        root: classic.root(),
        useKeyHashing: false,
      },
    )
    expect(missingVerified).toBeNull()

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

  it('external leaf store avoids duplicating leaf payloads and preserves anchor proofs on overwrite', async () => {
    const store = new SpyBinaryPathStore()
    const leafMap = new Map<string, Uint8Array>()
    const leaves = {
      get: async (key: Uint8Array) => leafMap.get(bytesToHex(key)) ?? null,
      put: async (key: Uint8Array, val: Uint8Array) => {
        leafMap.set(bytesToHex(key), val)
      },
      del: async (key: Uint8Array) => {
        leafMap.delete(bytesToHex(key))
      },
    }
    const classic = classicTrie()
    const binary = new BinaryPathMPT({ store, leaves })
    const keys: Uint8Array[] = []
    const origVals: Uint8Array[] = []

    for (let i = 0; i < 100; i++) {
      const key = randomBytes(32)
      const val = randomBytes(32)
      keys.push(key)
      origVals.push(val)
      await classic.put(key, val)
      await binary.put(key, val)
      await assertRootsMatch(classic, binary)
      expect(await binary.get(key)).toEqual(val)
    }

    // Confirm ZERO TAG_LEAF (0x03) records exist in path store and TAG_EXTERNAL_LEAF (0x04) records ARE stored
    let externalLeafCount = 0
    for (const record of store.records.values()) {
      expect(record[0]).not.toBe(TAG_LEAF)
      if (record[0] === TAG_EXTERNAL_LEAF) externalLeafCount++
    }
    expect(externalLeafCount).toBe(100)

    // Capture anchor, overwrite existing external leaf, and prove OLD value at anchor
    const anchorRoot = binary.captureAnchor('ext-1')
    const newVal = randomBytes(32)
    await binary.put(keys[0]!, newVal)
    expect(await binary.get(keys[0]!)).toEqual(newVal)

    const anchorProof = await binary.createProof(keys[0]!, 'ext-1')
    const verifiedAtAnchor = await verifyMerkleProof(keys[0]!, anchorProof, {
      root: anchorRoot,
      useKeyHashing: false,
    })
    expect(verifiedAtAnchor).toEqual(origVals[0]!)
  })

  it('walkLeaves yields ascending keys and respects anchor overlay', async () => {
    const store = new SpyBinaryPathStore()
    const leafMap = new Map<string, Uint8Array>()
    const leaves = {
      get: async (key: Uint8Array) => leafMap.get(bytesToHex(key)) ?? null,
      put: async (key: Uint8Array, val: Uint8Array) => {
        leafMap.set(bytesToHex(key), val)
      },
      del: async (key: Uint8Array) => {
        leafMap.delete(bytesToHex(key))
      },
    }
    const trie = new BinaryPathMPT({ store, leaves })
    const rows: { key: Uint8Array; value: Uint8Array }[] = []
    for (let i = 0; i < 48; i++) {
      const key = setLengthLeft(intToBytes(i * 17 + 3), 32)
      const val = randomBytes(12)
      rows.push({ key, value: val })
      await trie.put(key, val)
    }
    rows.sort((a, b) => compareBytes(a.key, b.key))

    const liveWalk: { key: Uint8Array; value: Uint8Array }[] = []
    for await (const row of trie.walkLeaves()) {
      liveWalk.push(row)
    }
    expect(liveWalk.length).toBe(rows.length)
    for (let i = 0; i < rows.length; i++) {
      expect(liveWalk[i]!.key).toEqual(rows[i]!.key)
      expect(liveWalk[i]!.value).toEqual(rows[i]!.value)
    }

    trie.captureAnchor('wl-1')
    const overwritten = randomBytes(20)
    await trie.put(rows[10]!.key, overwritten)
    await trie.del(rows[20]!.key)

    // Historical get(key, anchorId) recovers pre-mutation & pre-delete values
    expect(await trie.get(rows[10]!.key)).toEqual(overwritten)
    expect(await trie.get(rows[10]!.key, 'wl-1')).toEqual(rows[10]!.value)
    expect(await trie.get(rows[20]!.key)).toBeNull()
    expect(await trie.get(rows[20]!.key, 'wl-1')).toEqual(rows[20]!.value)

    const anchorWalk: { key: Uint8Array; value: Uint8Array }[] = []
    for await (const row of trie.walkLeaves('wl-1')) {
      anchorWalk.push(row)
    }
    expect(anchorWalk.length).toBe(rows.length)
    const idx = anchorWalk.findIndex((r) => equalsBytes(r.key, rows[10]!.key))
    expect(idx).toBeGreaterThanOrEqual(0)
    expect(anchorWalk[idx]!.value).toEqual(rows[10]!.value)
  })

  it('read-only external leaf store rejects mutations while serving reads and proofs', async () => {
    const leafMap = new Map<string, Uint8Array>()
    const rows: { key: Uint8Array; value: Uint8Array }[] = []
    for (let i = 0; i < 16; i++) {
      const key = setLengthLeft(intToBytes(i), 32)
      const value = randomBytes(32)
      leafMap.set(bytesToHex(key), value)
      rows.push({ key, value })
    }
    const readOnlyLeaves = {
      get: async (key: Uint8Array) => leafMap.get(bytesToHex(key)) ?? null,
    }
    const trie = await BinaryPathMPT.buildFromSortedStream(rows, { leaves: readOnlyLeaves })
    expect(await trie.get(rows[5]!.key)).toEqual(rows[5]!.value)
    const proof = await trie.createProof(rows[5]!.key)
    expect(
      await verifyMerkleProof(rows[5]!.key, proof, { root: trie.root(), useKeyHashing: false }),
    ).toEqual(rows[5]!.value)

    await expect(trie.put(rows[0]!.key, randomBytes(32))).rejects.toThrow(/read-only/)
    await expect(trie.del(rows[0]!.key)).rejects.toThrow(/read-only/)
  })

  it('proofs verify against classic — inclusion, exclusion, multi, range, anchor ring & eviction', async () => {
    const classic = classicTrie()
    const binary = new BinaryPathMPT({ maxAnchorSnapshots: 2 })
    const sorted: { key: Uint8Array; value: Uint8Array }[] = []

    for (let i = 0; i < 200; i++) {
      const key = setLengthLeft(intToBytes(i), 32)
      const val = randomBytes(18)
      sorted.push({ key, value: val })
      await classic.put(key, val)
      await binary.put(key, val)
    }
    sorted.sort((a, b) => compareBytes(a.key, b.key))

    const anchor1 = 'a1'
    const anchoredRoot1 = binary.captureAnchor(anchor1)

    // Mutate heavily: overwrite, insert, AND delete keys
    const overwrittenKey = sorted[42]!.key
    const deletedKey = sorted[15]!.key
    const extraKey = randomBytes(32)
    await binary.applyBatch([
      { key: overwrittenKey, value: randomBytes(24) },
      { key: deletedKey, value: null },
      { key: extraKey, value: randomBytes(8) },
    ])
    await classic.put(overwrittenKey, (await binary.get(overwrittenKey))!)
    await classic.del(deletedKey)
    await classic.put(extraKey, (await binary.get(extraKey))!)
    await assertRootsMatch(classic, binary)

    // Verify historical proofs at anchor1 after overwrite + delete + insert
    for (const [key, expected] of [
      [overwrittenKey, sorted[42]!.value],
      [deletedKey, sorted[15]!.value],
      [extraKey, null],
    ] as const) {
      const proofAnchor = await binary.createProof(key, anchor1)
      const vAnchor = await verifyMerkleProof(key, proofAnchor, {
        root: anchoredRoot1,
        useKeyHashing: false,
      })
      expect(vAnchor).toEqual(expected)
    }

    // Verify historical range proof at anchor1 (includes deletedKey & old overwrittenKey!)
    const origin = sorted[10]!.key
    const last = sorted[80]!.key
    const anchorRangeProof = await binary.createRangeBoundaryProof(origin, last, anchor1)
    assert(
      await verifyMerkleRangeProof(
        anchoredRoot1,
        origin,
        last,
        sorted.slice(10, 81).map((r) => r.key),
        sorted.slice(10, 81).map((r) => r.value),
        anchorRangeProof,
      ),
    )

    // Multi-proof on live trie
    const multi = await binary.createMultiProof([sorted[0]!.key, sorted[50]!.key, sorted[99]!.key])
    for (const key of [sorted[0]!.key, sorted[50]!.key, sorted[99]!.key]) {
      const v = await verifyMerkleProof(key, multi, { root: binary.root(), useKeyHashing: false })
      expect(v).toEqual(await classic.get(key))
    }

    // Anchor ring eviction (maxAnchorSnapshots = 2): capture a2 and a3 -> evicts a1
    binary.captureAnchor('a2')
    binary.captureAnchor('a3')
    await expect(binary.createProof(overwrittenKey, anchor1)).rejects.toThrow(/Unknown anchor/)
    binary.releaseAnchor('a2')
    await expect(binary.createProof(overwrittenKey, 'a2')).rejects.toThrow(/Unknown anchor/)
  })

  it('uses injected keccak256 and hashes ancestors once per applyBatch', async () => {
    let batchHashes = 0
    let seqHashes = 0
    const batchHasher = (msg: Uint8Array) => {
      batchHashes++
      return keccak_256(msg)
    }
    const seqHasher = (msg: Uint8Array) => {
      seqHashes++
      return keccak_256(msg)
    }

    const rows = Array.from({ length: 200 }, (_, i) => ({
      key: setLengthLeft(intToBytes(i), 32),
      value: randomBytes(32),
    }))

    const seqTrie = new BinaryPathMPT({ keccak256: seqHasher })
    for (const r of rows) {
      await seqTrie.put(r.key, r.value)
    }

    const batchTrie = new BinaryPathMPT({ keccak256: batchHasher })
    await batchTrie.applyBatch(rows)

    expect(equalsBytes(seqTrie.root(), batchTrie.root())).toBe(true)
    expect(batchHashes).toBeGreaterThan(0)
    // Deferred single-pass hashing must do far fewer hashes than sequential per-key puts
    expect(batchHashes * 2).toBeLessThan(seqHashes)
  })

  it('buildFromSortedStream — AsyncIterable, prefix validation, unsorted/duplicate rejection, 10k keys', async () => {
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
    // Streaming sorted build must beat sequential classic puts (hardware- and coverage-independent).
    expect(binaryMs).toBeLessThan(classicMs)

    // AsyncIterable stream
    async function* asyncGen() {
      for (const row of rows.slice(0, 128)) {
        yield row
      }
    }
    const classicSub = classicTrie()
    for (const row of rows.slice(0, 128)) {
      await classicSub.put(row.key, row.value)
    }
    const fromAsync = await BinaryPathMPT.buildFromSortedStream(asyncGen())
    await assertRootsMatch(classicSub, fromAsync)

    // Reject duplicate keys
    await expect(BinaryPathMPT.buildFromSortedStream([rows[0]!, rows[0]!])).rejects.toThrow(
      /Duplicate/,
    )

    // Reject unsorted keys
    await expect(BinaryPathMPT.buildFromSortedStream([rows[2]!, rows[1]!])).rejects.toThrow(
      /ascending/,
    )
  }, 30_000)
})

async function assert16WayAssembly(classic: MerklePatriciaTrie, subtrees: BinaryPathMPT[]) {
  const slots = subtrees.map((t) => t.branchSlotReference())
  for (let n = 0; n < 16; n++) {
    const fromClassic = await classicBranchSlot(classic, n)
    assert(equalsBytes(fromClassic, subtrees[n]!.root()), `subtree ${n} root vs classic slot`)
    assert(equalsBytes(slots[n]!, fromClassic), `branchSlotReference ${n}`)
  }
  assert(equalsBytes(classic.root(), keccak_256(encode16WayBranch(slots))))
}

function encode16WayBranch(slots: ReadonlyArray<Uint8Array>): Uint8Array {
  const branch: Uint8Array[] = []
  for (let i = 0; i < 16; i++) {
    branch.push(slots[i] ?? new Uint8Array(0))
  }
  branch.push(new Uint8Array(0))
  return RLP.encode(branch)
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
