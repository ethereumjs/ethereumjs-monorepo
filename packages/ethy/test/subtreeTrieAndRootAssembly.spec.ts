import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'

import { BinaryPathMPT, MerklePatriciaTrie, verifyMerkleRangeProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import {
  type BALJSONBlockAccessList,
  BINARY_ACCOUNT_SIZE,
  KECCAK256_RLP,
  MapDB,
  bigIntToUnpaddedBytes,
  binaryAccountToRLP,
  bytesToHex,
  compareBytes,
  createAccount,
  equalsBytes,
  intToUnpaddedBytes,
  randomBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { ethyKeccak256 } from '../src/crypto/keccak.ts'
import { applyBalToBucketSubtree } from '../src/custody/balSubtreeApply.ts'
import { BucketSubtreeTrie } from '../src/custody/bucketSubtreeTrie.ts'
import {
  type BucketRootCandidates,
  assembleRootBranch,
  noteSubtreeRootCandidate,
  verifyRootBranch,
} from '../src/custody/rootBranchAssembler.ts'
import { SubtreeCustodyRegistry } from '../src/custody/subtreeCustodyRegistry.ts'
import {
  answerLiveGetStateWitness,
  noteInboundSubtreeRootsGossip,
  parseWitnessQueries,
} from '../src/custody/subtreeLiveServe.ts'
import {
  buildLiveWitnessGroup,
  exportPivotAccountChunks,
} from '../src/custody/subtreeProofServer.ts'
import { readAllProofRecords } from '../src/persist/proofSidecar.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { verifyStatyMultiProof } from '../src/staty/multiProofVerify.ts'

function classicTrie() {
  return new MerklePatriciaTrie({ useKeyHashing: false, db: new MapDB() })
}

function keyWithLeadingNibble(n: number): Uint8Array {
  const k = randomBytes(32)
  k[0] = (n << 4) | (k[0]! & 0x0f)
  return k
}

function encode16WayBranch(slots: Uint8Array[]): Uint8Array {
  return RLP.encode([...slots, new Uint8Array(0)] as never)
}

async function assert16WayFromBuckets(
  classic: MerklePatriciaTrie,
  subtrees: BucketSubtreeTrie[],
): Promise<void> {
  const slots = SubtreeCustodyRegistry.slotsFromClassicSubtrees(subtrees)
  const got = ethyKeccak256(encode16WayBranch(slots))
  assert(equalsBytes(got, classic.root()), '16-way assembly root mismatch')
}

describe('WP-16f subtree trie and root assembly', () => {
  it('16 bucket tries match classic root across 50 mutation rounds', async () => {
    const classic = classicTrie()
    const subtrees = Array.from({ length: 16 }, (_, n) => BucketSubtreeTrie.forTestBucket(n))
    const keys: Uint8Array[] = []

    for (let i = 0; i < 512; i++) {
      const n = i % 16
      const key = keyWithLeadingNibble(n)
      const val = randomBytes(20)
      keys.push(key)
      await classic.put(key, val)
      await subtrees[n]!.accountTrie().put(key, val)
    }
    await assert16WayFromBuckets(classic, subtrees)

    for (let round = 0; round < 50; round++) {
      const key = keys[randomBytes(2)[0]! % keys.length]!
      const n = key[0]! >> 4
      const op = randomBytes(1)[0]! % 2
      if (op === 0) {
        const nv = randomBytes(24)
        await classic.put(key, nv)
        await subtrees[n]!.accountTrie().put(key, nv)
      } else {
        await classic.del(key)
        await subtrees[n]!.accountTrie().del(key)
      }
      await assert16WayFromBuckets(classic, subtrees)
    }
  })

  it('applyBalToBucketSubtree preserves untouched contract storageRoot and handles storage/code/deletion', async () => {
    const classic = classicTrie()
    const subtrees = Array.from({ length: 16 }, (_, n) => BucketSubtreeTrie.forTestBucket(n))

    // Seed all 16 buckets so root is a 16-way branch
    for (let n = 0; n < 16; n++) {
      for (let i = 0; i < 4; i++) {
        const k = keyWithLeadingNibble(n)
        const v = createAccount({ balance: BigInt(i + 1), storageRoot: KECCAK256_RLP }).serialize()
        await classic.put(k, v)
        await subtrees[n]!.accountTrie().put(k, v)
      }
    }

    // Create a contract with pre-existing non-empty storageRoot NOT loaded in subtrees[b]._storage
    const contractAddr = randomBytes(20)
    const contractHash = ethyKeccak256(contractAddr)
    const contractBucket = contractHash[0]! >> 4
    const existingStorageTrie = classicTrie()
    const slotKey0 = setLengthLeft(intToUnpaddedBytes(7), 32)
    const slotHash0 = ethyKeccak256(slotKey0)
    await existingStorageTrie.put(slotHash0, RLP.encode(intToUnpaddedBytes(42)))
    const preStorageRoot = existingStorageTrie.root()
    const contractCode = new Uint8Array([0x60, 0x00, 0xf3])
    const preContractRlp = createAccount({
      nonce: 1n,
      balance: 100n,
      storageRoot: preStorageRoot,
      codeHash: ethyKeccak256(contractCode),
    }).serialize()
    await classic.put(contractHash, preContractRlp)
    await subtrees[contractBucket]!.accountTrie().put(contractHash, preContractRlp)

    // EOA that will be deleted via EIP-161 (balance -> 0, nonce -> 0, empty code & storage)
    const doomedAddr = randomBytes(20)
    const doomedHash = ethyKeccak256(doomedAddr)
    const doomedBucket = doomedHash[0]! >> 4
    const doomedRlp = createAccount({ balance: 50n, storageRoot: KECCAK256_RLP }).serialize()
    await classic.put(doomedHash, doomedRlp)
    await subtrees[doomedBucket]!.accountTrie().put(doomedHash, doomedRlp)

    // Brand-new contract created with storage writes in this BAL
    const freshAddr = randomBytes(20)
    const freshHash = ethyKeccak256(freshAddr)
    const freshBucket = freshHash[0]! >> 4
    const freshSlotKey = setLengthLeft(intToUnpaddedBytes(99), 32)
    const freshSlotHash = ethyKeccak256(freshSlotKey)
    const freshCode = new Uint8Array([0x60, 0x2a, 0x00])

    const bal: BALJSONBlockAccessList = [
      {
        address: bytesToHex(contractAddr),
        storageChanges: [],
        storageReads: [],
        balanceChanges: [{ blockAccessIndex: '0x1', postBalance: '0x1f4' }], // 500 wei, NO storageChanges!
        nonceChanges: [],
        codeChanges: [],
      },
      {
        address: bytesToHex(doomedAddr),
        storageChanges: [],
        storageReads: [],
        balanceChanges: [{ blockAccessIndex: '0x1', postBalance: '0x0' }],
        nonceChanges: [],
        codeChanges: [],
      },
      {
        address: bytesToHex(freshAddr),
        storageChanges: [
          {
            slot: bytesToHex(freshSlotKey),
            slotChanges: [{ blockAccessIndex: '0x1', postValue: '0x05' }],
          },
        ],
        storageReads: [],
        balanceChanges: [{ blockAccessIndex: '0x1', postBalance: '0xa' }],
        nonceChanges: [{ blockAccessIndex: '0x1', postNonce: '0x1' }],
        codeChanges: [{ blockAccessIndex: '0x1', newCode: bytesToHex(freshCode) }],
      },
    ]

    for (const st of subtrees) {
      await applyBalToBucketSubtree(st, bal, undefined)
    }

    // Mirror exact expected state in classic oracle
    const postContractRlp = createAccount({
      nonce: 1n,
      balance: 500n,
      storageRoot: preStorageRoot, // MUST stay intact!
      codeHash: ethyKeccak256(contractCode),
    }).serialize()
    await classic.put(contractHash, postContractRlp)
    await classic.del(doomedHash)

    const freshStorageTrie = classicTrie()
    await freshStorageTrie.put(freshSlotHash, RLP.encode(intToUnpaddedBytes(5)))
    const freshRlp = createAccount({
      nonce: 1n,
      balance: 10n,
      storageRoot: freshStorageTrie.root(),
      codeHash: ethyKeccak256(freshCode),
    }).serialize()
    await classic.put(freshHash, freshRlp)

    await assert16WayFromBuckets(classic, subtrees)
    assert.isNull(await subtrees[doomedBucket]!.accountTrie().get(doomedHash))
    assert.isTrue(
      equalsBytes(await subtrees[freshBucket]!.storageRootFor(freshHash), freshStorageTrie.root()),
    )
  })

  it('RootBranchAssembler detects Byzantine bucket gossip and supports empty 0x80 slots', () => {
    const slots: Uint8Array[] = []
    for (let i = 0; i < 16; i++) {
      slots.push(i === 0 ? new Uint8Array(0) : randomBytes(32))
    }
    const stateRoot = ethyKeccak256(encode16WayBranch(slots))
    const book: BucketRootCandidates = new Map()
    for (let b = 0; b < 16; b++) {
      noteSubtreeRootCandidate(book, b, `honest-${b}`, slots[b]!)
    }
    noteSubtreeRootCandidate(book, 3, 'byzantine-a', randomBytes(32))
    noteSubtreeRootCandidate(book, 7, 'byzantine-b', randomBytes(32))
    const asm = assembleRootBranch(book, stateRoot, ethyKeccak256)
    assert.strictEqual(asm.ok, true)
    if (!asm.ok) return
    assert.isTrue(asm.byzantinePeerIds.includes('byzantine-a'))
    assert.isTrue(asm.byzantinePeerIds.includes('byzantine-b'))
    assert.strictEqual(asm.slots[0]!.length, 0)
    assert.isTrue(verifyRootBranch(asm.slots, stateRoot, ethyKeccak256))
  })

  it('buildLiveWitnessGroup & answerLiveGetStateWitness verify historical account + storage after live overwrites', async () => {
    const classic = classicTrie()
    const subtrees = Array.from({ length: 16 }, (_, n) => BucketSubtreeTrie.forTestBucket(n))
    const bucket = 4
    const acct = keyWithLeadingNibble(bucket)
    const slotA = randomBytes(32)
    const slotB = randomBytes(32)
    const slotValA1 = RLP.encode(intToUnpaddedBytes(777))

    // Seed contract storage in bucket 4
    const storageRoot1 = await subtrees[bucket]!.applyStorageBatch(acct, [
      { key: slotA, value: slotValA1 },
    ])
    const accountRlp1 = createAccount({
      nonce: 3n,
      balance: 99n,
      storageRoot: storageRoot1,
    }).serialize()

    for (let n = 0; n < 16; n++) {
      for (let i = 0; i < 64; i++) {
        const k =
          n === bucket && i === 0
            ? acct
            : (() => {
                const key = keyWithLeadingNibble(n)
                key[1] = i & 0xff
                return key
              })()
        const v =
          n === bucket && i === 0
            ? accountRlp1
            : createAccount({
                nonce: BigInt(i),
                balance: 1n,
                storageRoot: KECCAK256_RLP,
              }).serialize()
        await classic.put(k, v)
        await subtrees[n]!.accountTrie().put(k, v)
      }
    }

    const slots1 = SubtreeCustodyRegistry.slotsFromClassicSubtrees(subtrees)
    const stateRoot1 = classic.root()
    const rootRlp1 = encode16WayBranch(slots1)
    assert.isTrue(equalsBytes(ethyKeccak256(rootRlp1), stateRoot1))

    // Capture anchor #128 BEFORE mutating account & storage slot!
    const trie = subtrees[bucket]!
    trie.captureAnchor(128n)

    // Mutate BOTH storage slot AND account balance at live head (#129)
    const storageRoot2 = await trie.applyStorageBatch(acct, [
      { key: slotA, value: RLP.encode(intToUnpaddedBytes(9999)) },
    ])
    const accountRlp2 = createAccount({
      nonce: 4n,
      balance: 5000n,
      storageRoot: storageRoot2,
    }).serialize()
    await trie.accountTrie().put(acct, accountRlp2)

    // Prove historical #128 state (present account, missing account, present slotA, absent slotB)
    const missingAcct = keyWithLeadingNibble(bucket)
    const group = await buildLiveWitnessGroup({
      anchorBlock: 128n,
      anchorStateRoot: stateRoot1,
      rootNodeRlp: rootRlp1,
      trie,
      armed: true,
      anchorId: 128n,
      queries: [
        { accountHash: acct, slotHashes: [slotA, slotB] },
        { accountHash: missingAcct, slotHashes: [] },
      ],
    })
    assert.isDefined(group)
    const vrf = await verifyStatyMultiProof(group!, ethyKeccak256)
    if (!vrf.ok) assert.fail(`verifyStatyMultiProof: ${vrf.code} ${vrf.detail ?? ''}`)
    // Verify returned values are the HISTORICAL #128 values, NOT the live #129 overwrites
    const acctRow = group!.accounts.find((a) => equalsBytes(a.accountHash, acct))!
    assert.isTrue(equalsBytes(acctRow.accountRlpOrEmpty, accountRlp1))
    const slotARow = group!.slots.find((s) => equalsBytes(s.slotHash, slotA))!
    assert.isTrue(equalsBytes(slotARow.slotValOrEmpty, intToUnpaddedBytes(777)))
    const slotBRow = group!.slots.find((s) => equalsBytes(s.slotHash, slotB))!
    assert.strictEqual(slotBRow.slotValOrEmpty.length, 0)

    // Also test full wire 0x0b -> 0x0c encoding/decoding (multi-byte maxBytes + non-double-encoded RLP)
    const reg = SubtreeCustodyRegistry.forTests('local', [bucket])
    // Replace bucket trie in registry via verified anchor setup
    const regFull = SubtreeCustodyRegistry.forTests(
      'local',
      Array.from({ length: 16 }, (_, n) => n),
    )
    for (let n = 0; n < 16; n++) {
      for await (const row of subtrees[n]!.accountTrie().walkLeaves(
        n === bucket ? 128n : undefined,
      )) {
        await regFull.trie(n)!.accountTrie().put(row.key, row.value)
      }
    }
    await regFull.trie(bucket)!.applyStorageBatch(acct, [{ key: slotA, value: slotValA1 }])
    const verified = await regFull.verifyAnchor(128n, stateRoot1)
    assert.isDefined(verified)

    const wireReq = RLP.decode(
      RLP.encode([
        bigIntToUnpaddedBytes(7n),
        bigIntToUnpaddedBytes(64n),
        bigIntToUnpaddedBytes(524_288n), // 3-byte big-endian 0x080000
        [[acct, [slotA]]],
      ] as never),
    )
    const parsedReq = parseWitnessQueries(wireReq)
    assert.strictEqual(parsedReq?.maxBytes, 524_288)

    const wireReply = await answerLiveGetStateWitness(
      regFull,
      createSpine('sepolia', 11155111n),
      wireReq,
    )
    assert.isDefined(wireReply)
    const decodedReply = RLP.decode(wireReply!) as unknown[]
    assert.strictEqual(decodedReply.length, 2)
    const wireGroups = decodedReply[1] as unknown[][]
    assert.strictEqual(wireGroups.length, 1)
    const g0 = wireGroups[0]!
    assert.isTrue(Array.isArray(g0), '0x0c group must be nested RLP list, not double-encoded bytes')
    const wireVrf = await verifyStatyMultiProof(
      {
        anchorStateRoot: g0[1] as Uint8Array,
        accounts: (g0[2] as Uint8Array[][]).map((r) => ({
          accountHash: r[0]!,
          accountRlpOrEmpty: r[1]!,
        })),
        slots: (g0[3] as Uint8Array[][]).map((r) => ({
          accountHash: r[0]!,
          slotHash: r[1]!,
          slotValOrEmpty: r[2]!,
        })),
        proofNodes: g0[4] as Uint8Array[],
      },
      ethyKeccak256,
    )
    assert.isTrue(wireVrf.ok)
    void reg
  })

  it('exportPivotAccountChunks writes 136-byte BinaryAccount slabs and full-root-verified proofs', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ethy-export-'))
    try {
      const classic = classicTrie()
      const subtrees = Array.from({ length: 16 }, (_, n) => BucketSubtreeTrie.forTestBucket(n))
      const targetBucket = 0x5
      for (let n = 0; n < 16; n++) {
        const count = n === targetBucket ? 60 : 8
        for (let i = 0; i < count; i++) {
          const k = keyWithLeadingNibble(n)
          k[1] = i & 0xff
          const v = createAccount({
            nonce: BigInt(i),
            balance: BigInt(i + 1) * 1000n,
            storageRoot: KECCAK256_RLP,
          }).serialize()
          await classic.put(k, v)
          await subtrees[n]!.accountTrie().put(k, v)
        }
      }
      const slots = SubtreeCustodyRegistry.slotsFromClassicSubtrees(subtrees)
      const rootRlp = encode16WayBranch(slots)
      const stateRoot = classic.root()
      subtrees[targetBucket]!.captureAnchor(1024n)

      // Force multiple chunks (20 accounts per chunk -> 3 chunks)
      const chunks = await exportPivotAccountChunks({
        trie: subtrees[targetBucket]!,
        anchorBlock: 1024n,
        anchorStateRoot: stateRoot,
        rootNodeRlp: rootRlp,
        outDir: tmp,
        bucket: targetBucket,
        macroGridBlocks: 1024n,
        maxChunkBytes: 20 * (32 + BINARY_ACCOUNT_SIZE),
        anchorId: 1024n,
      })

      assert.strictEqual(chunks.length, 3)
      for (let i = 0; i < chunks.length; i++) {
        const c = chunks[i]!
        assert.strictEqual(c.hasRight, i < chunks.length - 1 ? 1 : 0)
        const slab = new Uint8Array(await fs.readFile(c.binPath))
        assert.strictEqual(slab.length, c.accountCount * 136)

        const sidecars = readAllProofRecords(c.proofPath)
        assert.strictEqual(sidecars.length, 1)
        const rec = sidecars[0]!
        assert.strictEqual(rec.hasRight, c.hasRight)
        assert.isTrue(equalsBytes(rec.chunkStateRoot, stateRoot))

        // Reconstruct (key, accountRlp) from 136-byte slab and verify against FULL world stateRoot
        const keys: Uint8Array[] = []
        const vals: Uint8Array[] = []
        for (let off = 0; off < slab.length; off += 136) {
          keys.push(slab.subarray(off, off + 32))
          vals.push(binaryAccountToRLP(slab.subarray(off + 32, off + 136)))
        }
        assert.isTrue(
          await verifyMerkleRangeProof(
            stateRoot,
            rec.originHash,
            rec.lastHash,
            keys,
            vals,
            rec.proofNodes,
            ethyKeccak256,
          ),
        )
      }
    } finally {
      await fs.rm(tmp, { recursive: true, force: true })
    }
  })

  it('reopens disk-backed bucket trie and >64 evicted storage tries cleanly', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ethy-trie-'))
    try {
      const bucket = 0xa
      const trie = BucketSubtreeTrie.create({ bucket, dataDir: tmp })
      const key = keyWithLeadingNibble(bucket)
      const val = randomBytes(32)
      await trie.accountTrie().put(key, val)
      const before = trie.branchSlotReference()

      // Write storage for 70 contracts (> MAX_HOT_STORAGE_TRIES = 64) to exercise disk eviction & reopen
      const firstAcct = keyWithLeadingNibble(bucket)
      const firstSlot = randomBytes(32)
      const firstRoot = await trie.applyStorageBatch(firstAcct, [
        { key: firstSlot, value: RLP.encode(intToUnpaddedBytes(123)) },
      ])
      for (let i = 0; i < 69; i++) {
        await trie.applyStorageBatch(keyWithLeadingNibble(bucket), [
          { key: randomBytes(32), value: RLP.encode(intToUnpaddedBytes(i + 1)) },
        ])
      }
      // First contract was evicted from RAM cache and must reopen transparently from disk
      assert.isTrue(equalsBytes(await trie.storageRootFor(firstAcct), firstRoot))

      const reopened = await BucketSubtreeTrie.reopen({ bucket, dataDir: tmp })
      assert.isTrue(equalsBytes(before, reopened.branchSlotReference()))
      assert.isDefined(await reopened.accountTrie().get(key))
      assert.isTrue(equalsBytes(await reopened.storageRootFor(firstAcct), firstRoot))
    } finally {
      await fs.rm(tmp, { recursive: true, force: true })
    }
  })

  it('noteInboundSubtreeRootsGossip decodes bucket 0 (0x80), isolates anchors, and flags Byzantine peers', async () => {
    const slots32 = Array.from({ length: 16 }, () => randomBytes(32))
    const slots64 = Array.from({ length: 16 }, () => randomBytes(32))
    const root32 = ethyKeccak256(encode16WayBranch(slots32))
    const root64 = ethyKeccak256(encode16WayBranch(slots64))

    const caughtByzantine: string[] = []
    const reg = SubtreeCustodyRegistry.forTests('local', [], {
      onByzantinePeers: (_anchor, peers) => caughtByzantine.push(...peers),
    })

    // Deliver bucket 0 using canonical RLP empty byte string (0x80) for integer 0!
    const gossip32 = RLP.encode([
      new Uint8Array(0),
      bigIntToUnpaddedBytes(32n),
      slots32.map((h, b) => [bigIntToUnpaddedBytes(BigInt(b)), h]),
    ] as never)
    noteInboundSubtreeRootsGossip(reg, 'honest-32', gossip32)

    // Interleave anchor #64 gossip + a Byzantine peer for bucket 0 at #32
    const gossip64 = RLP.encode([
      new Uint8Array(0),
      bigIntToUnpaddedBytes(64n),
      slots64.map((h, b) => [bigIntToUnpaddedBytes(BigInt(b)), h]),
    ] as never)
    noteInboundSubtreeRootsGossip(reg, 'honest-64', gossip64)

    const badBucket0 = RLP.encode([
      new Uint8Array(0),
      bigIntToUnpaddedBytes(32n),
      [[new Uint8Array(0), randomBytes(32)]],
    ] as never)
    noteInboundSubtreeRootsGossip(reg, 'evil-bucket-0', badBucket0)

    const v32 = await reg.verifyAnchor(32n, root32)
    const v64 = await reg.verifyAnchor(64n, root64)
    assert.isDefined(v32)
    assert.isDefined(v64)
    assert.isTrue(v32!.byzantinePeerIds.includes('evil-bucket-0'))
    assert.isTrue(caughtByzantine.includes('evil-bucket-0'))
    assert.strictEqual(v64!.byzantinePeerIds.length, 0)
    assert.strictEqual(reg.latestVerifiedAnchorAtOrAbove(32n)?.anchorBlock, 64n)
  })

  it('walkLeaves drives range boundary export', async () => {
    const trie = new BinaryPathMPT({ keccak256: ethyKeccak256 })
    const rows: { key: Uint8Array; value: Uint8Array }[] = []
    for (let i = 0; i < 200; i++) {
      const key = setLengthLeft(intToUnpaddedBytes(i * 17 + 3), 32)
      const val = randomBytes(10)
      rows.push({ key, value: val })
      await trie.put(key, val)
    }
    rows.sort((a, b) => compareBytes(a.key, b.key))
    const origin = rows[10]!.key
    const last = rows[80]!.key
    const walk: Uint8Array[] = []
    for await (const row of trie.walkLeaves()) {
      walk.push(row.key)
    }
    assert.strictEqual(walk.length, rows.length)
    const proof = await trie.createRangeBoundaryProof(origin, last)
    const slice = rows.slice(10, 81)
    assert.isTrue(
      await verifyMerkleRangeProof(
        trie.root(),
        origin,
        last,
        slice.map((r) => r.key),
        slice.map((r) => r.value),
        proof,
        ethyKeccak256,
      ),
    )
  })

  it('SubtreeCustodyRegistry self-audit flips trie bitmask on full assembly', async () => {
    const classic = classicTrie()
    const reg = SubtreeCustodyRegistry.forTests(
      'local',
      Array.from({ length: 16 }, (_, n) => n),
    )
    for (let n = 0; n < 16; n++) {
      const bucketTrie = reg.trie(n)!
      for (let i = 0; i < 128; i++) {
        const key = keyWithLeadingNibble(n)
        key[1] = i & 0xff
        const val = randomBytes(18)
        await classic.put(key, val)
        await bucketTrie.accountTrie().put(key, val)
      }
      const slot = bucketTrie.branchSlotReference()
      assert.strictEqual(slot.length, 32)
      reg.notePeerSubtreeRoot(32n, n, 'local', slot)
    }
    const anchor = await reg.verifyAnchor(32n, classic.root())
    assert.isDefined(anchor)
    assert.strictEqual(reg.trieBucketsBitmask(), 0xffff)
  })
})
