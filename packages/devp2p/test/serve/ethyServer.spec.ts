import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { MerklePatriciaTrie, createMerkleProof, verifyMerkleRangeProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import {
  MapDB,
  accountToBinaryAccount,
  bigIntToUnpaddedBytes,
  binaryAccountToRLP,
  createAccount,
  equalsBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

const ETHY_PROOF_SIDECAR_MAGIC = new Uint8Array([0x45, 0x54, 0x48, 0x59, 0x50, 0x52, 0x46, 0x31])

function appendProofSidecarRecord(
  filePath: string,
  fields: {
    slabByteOffset: number
    slabByteLength: number
    originHash: Uint8Array
    lastHash: Uint8Array
    hasRight: number
    chunkStateRoot: Uint8Array
    chunkBlockNumber: bigint
    proofNodes: Uint8Array[]
  },
): void {
  const body = RLP.encode([
    intToUnpaddedBytes(fields.slabByteOffset),
    intToUnpaddedBytes(fields.slabByteLength),
    fields.originHash,
    fields.lastHash,
    intToUnpaddedBytes(fields.hasRight),
    fields.chunkStateRoot,
    bigIntToUnpaddedBytes(fields.chunkBlockNumber),
    fields.proofNodes,
  ] as never)
  const len = new Uint8Array(4)
  new DataView(len.buffer).setUint32(0, body.length, false)
  const needMagic = !fs.existsSync(filePath) || fs.statSync(filePath).size === 0
  const fd = fs.openSync(filePath, 'a')
  try {
    if (needMagic) fs.writeSync(fd, ETHY_PROOF_SIDECAR_MAGIC)
    fs.writeSync(fd, len)
    fs.writeSync(fd, body)
  } finally {
    fs.closeSync(fd)
  }
}

import { EthyMessageCodes } from '../../src/protocol/ethy/codes.ts'
import { EthyChunkStore } from '../../src/serve/ethyChunkStore.ts'
import { tryServeEthyGet } from '../../src/serve/ethyServer.ts'
import { EthyStorageStore } from '../../src/serve/ethyStorageStore.ts'
import { EthySubtreeRootBook } from '../../src/serve/ethySubtreeRootBook.ts'
import { EthyWitnessStore } from '../../src/serve/ethyWitnessStore.ts'
import { RollingBlockStore } from '../../src/serve/rollingBlockStore.ts'
import { SharedCodeDisk } from '../../src/serve/sharedCodeDisk.ts'

const emptyCode = new SharedCodeDisk()
const emptyStorage = new EthyStorageStore()
const defaultEthyServeOpts = {
  witnessStore: new EthyWitnessStore(),
  subtreeBook: new EthySubtreeRootBook(),
  remoteBucketsBitmask: 0xffff,
  witnessThrottle: { windowStartMs: 0, count: 0 },
}

describe('[Devp2p/ETHY]: worker serving', () => {
  it('tryServeEthyGet() serves PROVEN_ACCOUNT_CHUNK for verifyMerkleRangeProof', async () => {
    const accountKey = new Uint8Array(32)
    accountKey[31] = 0x42
    const acct = createAccount({ nonce: 1n, balance: 1000n })
    const slab = new Uint8Array(136)
    slab.set(accountKey, 0)
    accountToBinaryAccount(acct, slab, 32)
    const valueRlp = binaryAccountToRLP(slab, 32)
    const trie = new MerklePatriciaTrie({ db: new MapDB(), useKeyHashing: false })
    await trie.put(accountKey, valueRlp)
    const chunkStateRoot = trie.root()
    const proofNodes = await createMerkleProof(trie, accountKey)

    const chunks = new EthyChunkStore()
    chunks.put({
      bucketIndex: 0,
      originHash: accountKey,
      lastHash: accountKey,
      hasRight: 0,
      chunkStateRoot,
      chunkBlockNumber: 1n,
      binaryAccountsSlab: slab,
      proofNodes,
    })

    const req = RLP.encode([bigIntToUnpaddedBytes(1n), intToUnpaddedBytes(0), accountKey])
    const served = tryServeEthyGet(
      chunks,
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_PROVEN_ACCOUNT_CHUNK',
      RLP.decode(req),
      emptyCode,
      emptyStorage,
      defaultEthyServeOpts,
    )
    assert.notEqual(served, undefined)
    assert.equal(served!.code, EthyMessageCodes.PROVEN_ACCOUNT_CHUNK)
    assert.equal(served!.metric, 'chunk')

    const replySlab = served!.rlp[7] as Uint8Array
    const replyProof = served!.rlp[8] as Uint8Array[]
    const replyRoot = served!.rlp[5] as Uint8Array
    assert.isTrue(equalsBytes(replySlab, slab))
    assert.isTrue(equalsBytes(replyRoot, chunkStateRoot))
    await verifyMerkleRangeProof(
      replyRoot,
      accountKey,
      accountKey,
      [accountKey],
      [binaryAccountToRLP(replySlab, 32)],
      replyProof,
    )
  })

  it('tryServeEthyGet() serves chunk loaded from disk proof sidecar', async () => {
    const accountKey = new Uint8Array(32)
    accountKey[31] = 0x42
    const acct = createAccount({ nonce: 1n, balance: 1000n })
    const slab = new Uint8Array(136)
    slab.set(accountKey, 0)
    accountToBinaryAccount(acct, slab, 32)
    const valueRlp = binaryAccountToRLP(slab, 32)
    const trie = new MerklePatriciaTrie({ db: new MapDB(), useKeyHashing: false })
    await trie.put(accountKey, valueRlp)
    const chunkStateRoot = trie.root()
    const proofNodes = await createMerkleProof(trie, accountKey)

    const accountsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-disk-serve-'))
    const journalPath = path.join(accountsDir, '0.bin')
    fs.writeFileSync(journalPath, slab)
    appendProofSidecarRecord(path.join(accountsDir, '0.proof.idx'), {
      slabByteOffset: 0,
      slabByteLength: slab.length,
      originHash: accountKey,
      lastHash: accountKey,
      hasRight: 0,
      chunkStateRoot,
      chunkBlockNumber: 1n,
      proofNodes,
    })

    const chunks = new EthyChunkStore()
    chunks.setPivotAccountsDir(accountsDir)

    const req = RLP.encode([bigIntToUnpaddedBytes(1n), intToUnpaddedBytes(0), accountKey])
    const served = tryServeEthyGet(
      chunks,
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_PROVEN_ACCOUNT_CHUNK',
      RLP.decode(req),
      emptyCode,
      emptyStorage,
      defaultEthyServeOpts,
    )
    assert.notEqual(served, undefined)
    assert.equal(served!.code, EthyMessageCodes.PROVEN_ACCOUNT_CHUNK)
    const replySlab = served!.rlp[7] as Uint8Array
    assert.isTrue(equalsBytes(replySlab, slab))
  })

  it('kind 0 code is served from SharedCodeDisk', () => {
    const codeDisk = new SharedCodeDisk()
    const hash = new Uint8Array(32).fill(0xaa)
    const code = new Uint8Array([0x60, 0x00, 0x60, 0x00, 0xfd])
    codeDisk.put(hash, code)
    const decoded = RLP.decode(
      RLP.encode([bigIntToUnpaddedBytes(1n), intToUnpaddedBytes(0), [hash]]),
    )
    const served = tryServeEthyGet(
      new EthyChunkStore(),
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_PROVEN_STORAGE_OR_CODE',
      decoded,
      codeDisk,
      new EthyStorageStore(),
      defaultEthyServeOpts,
    )
    const rows = served!.rlp[2] as Uint8Array[]
    assert.isTrue(equalsBytes(rows[0]!, code))
  })

  it('kind 1 returns 64-byte-aligned slab and hasRight', () => {
    const storage = new EthyStorageStore()
    const accountHash = new Uint8Array(32).fill(0xbb)
    const storageRoot = new Uint8Array(32).fill(0xcc)
    const slot0 = new Uint8Array(32)
    slot0[31] = 1
    const slab = new Uint8Array(128)
    slab.set(slot0, 0)
    slab.set(new Uint8Array(32).fill(0x02), 64)
    storage.put({
      accountHash,
      storageRoot,
      chunkBlockNumber: 10n,
      slotsSlab64B: slab,
      complete: false,
      proofNodes: [new Uint8Array([0x01])],
    })
    const decoded = RLP.decode(
      RLP.encode([
        bigIntToUnpaddedBytes(1n),
        intToUnpaddedBytes(1),
        accountHash,
        storageRoot,
        new Uint8Array(32),
        intToUnpaddedBytes(524288),
      ]),
    )
    const served = tryServeEthyGet(
      new EthyChunkStore(),
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_PROVEN_STORAGE_OR_CODE',
      decoded,
      new SharedCodeDisk(),
      storage,
      defaultEthyServeOpts,
    )
    assert.equal(served!.metric, 'storage')
    const replySlab = served!.rlp[8] as Uint8Array
    assert.equal(replySlab.length % 64, 0)
    assert.isTrue(equalsBytes(served!.rlp[7] as Uint8Array, intToUnpaddedBytes(1)))

    // Final sub-range of a complete contract (startIdx > 0, hasRight = 0) MUST keep boundary proofNodes
    const completeHash = new Uint8Array(32).fill(0xbc)
    const completeSlab = new Uint8Array(128)
    const s1 = new Uint8Array(32)
    s1[31] = 1
    const s2 = new Uint8Array(32)
    s2[31] = 2
    completeSlab.set(s1, 0)
    completeSlab.set(s2, 64)
    storage.put({
      accountHash: completeHash,
      storageRoot,
      chunkBlockNumber: 11n,
      slotsSlab64B: completeSlab,
      complete: true,
      proofNodes: [new Uint8Array([0xab])],
    })
    const tailReq = RLP.decode(
      RLP.encode([
        bigIntToUnpaddedBytes(2n),
        intToUnpaddedBytes(1),
        completeHash,
        storageRoot,
        s2,
        intToUnpaddedBytes(524288),
      ]),
    )
    const tailServed = tryServeEthyGet(
      new EthyChunkStore(),
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_PROVEN_STORAGE_OR_CODE',
      tailReq,
      new SharedCodeDisk(),
      storage,
      defaultEthyServeOpts,
    )
    assert.equal((tailServed!.rlp[9] as Uint8Array[]).length, 1)
    assert.isTrue(equalsBytes(tailServed!.rlp[7] as Uint8Array, intToUnpaddedBytes(0)))
  })

  it('kind 2 omits incomplete contracts and unknown kind is not served', () => {
    const storage = new EthyStorageStore()
    const completeHash = new Uint8Array(32).fill(0xdd)
    const incompleteHash = new Uint8Array(32).fill(0xee)
    const root = new Uint8Array(32).fill(0xff)
    storage.put({
      accountHash: completeHash,
      storageRoot: root,
      chunkBlockNumber: 1n,
      slotsSlab64B: new Uint8Array(64),
      complete: true,
      proofNodes: [],
    })
    storage.put({
      accountHash: incompleteHash,
      storageRoot: root,
      chunkBlockNumber: 1n,
      slotsSlab64B: new Uint8Array(64),
      complete: false,
      proofNodes: [],
    })
    const decoded = RLP.decode(
      RLP.encode([
        bigIntToUnpaddedBytes(1n),
        intToUnpaddedBytes(2),
        [
          [completeHash, root],
          [incompleteHash, root],
        ],
      ]),
    )
    const served = tryServeEthyGet(
      new EthyChunkStore(),
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_PROVEN_STORAGE_OR_CODE',
      decoded,
      new SharedCodeDisk(),
      storage,
      defaultEthyServeOpts,
    )
    const entries = served!.rlp[2] as unknown[]
    assert.equal(entries.length, 1)

    const badKind = RLP.decode(RLP.encode([bigIntToUnpaddedBytes(2n), intToUnpaddedBytes(9)]))
    const none = tryServeEthyGet(
      new EthyChunkStore(),
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_PROVEN_STORAGE_OR_CODE',
      badKind,
      new SharedCodeDisk(),
      storage,
      defaultEthyServeOpts,
    )
    assert.equal(none, undefined)
  })

  it('GET_SUBTREE_ROOTS preserves 0-byte empty nibble hashes (0x80) and filters by mask', () => {
    const book = new EthySubtreeRootBook()
    const root = new Uint8Array(32).fill(0x11)
    assert.isTrue(
      book.ingest(100n, [
        [intToUnpaddedBytes(0), new Uint8Array(0)],
        [intToUnpaddedBytes(3), root],
      ]),
    )
    const opts = { ...defaultEthyServeOpts, subtreeBook: book }
    const decoded = RLP.decode(
      RLP.encode([bigIntToUnpaddedBytes(1n), bigIntToUnpaddedBytes(100n), intToUnpaddedBytes(0)]),
    )
    const served = tryServeEthyGet(
      new EthyChunkStore(),
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_SUBTREE_ROOTS',
      decoded,
      emptyCode,
      emptyStorage,
      opts,
    )
    assert.equal(served!.code, EthyMessageCodes.SUBTREE_ROOTS)
    const wire = served!.rlp[2] as [Uint8Array, Uint8Array][]
    assert.equal(wire.length, 2)
    assert.equal(wire[0]![0].length, 0) // bucket 0 canonical 0x80
    assert.equal(wire[0]![1].length, 0) // empty nibble preserved as 0-byte (0x80), never 32 zero bytes
    assert.isTrue(equalsBytes(wire[1]![1], root))
  })

  it('GET_STATE_WITNESS sorts accounts and slots strictly ascending, deduplicates proofNodes, and supports live generator hook', () => {
    const witnessStore = new EthyWitnessStore()
    const acctA = new Uint8Array(32).fill(0x10)
    const acctB = new Uint8Array(32).fill(0x20)
    const slot1 = new Uint8Array(32).fill(0x01)
    const slot2 = new Uint8Array(32).fill(0x02)
    const anchorRoot = new Uint8Array(32).fill(0xaa)
    const sharedNode = new Uint8Array([0xde, 0xad, 0xbe, 0xef])

    witnessStore.putWitness({
      accountHash: acctB,
      anchorBlock: 500n,
      anchorStateRoot: anchorRoot,
      accountRlpOrEmpty: new Uint8Array([0xc1, 0x02]),
      slots: [
        { slotHash: slot2, slotValOrEmpty: new Uint8Array([0x22]) },
        { slotHash: slot1, slotValOrEmpty: new Uint8Array([0x11]) },
      ],
      proofNodes: [sharedNode, new Uint8Array([0x02])],
    })
    // Account A comes via live witness generator hook (WP-16f seam)
    witnessStore.setWitnessGenerator((minAnchor, q) => {
      if (!equalsBytes(q.accountHash, acctA) || minAnchor > 500n) return undefined
      return {
        accountHash: acctA,
        anchorBlock: 500n,
        anchorStateRoot: anchorRoot,
        accountRlpOrEmpty: new Uint8Array([0xc1, 0x01]),
        slots: [],
        proofNodes: [sharedNode, new Uint8Array([0x01])],
      }
    })

    // Query in reverse order (acctB before acctA; slot2 before slot1 + duplicate slot2)
    const decoded = RLP.decode(
      RLP.encode([
        bigIntToUnpaddedBytes(7n),
        bigIntToUnpaddedBytes(400n),
        intToUnpaddedBytes(524_288),
        [
          [acctB, [slot2, slot1, slot2]],
          [acctA, []],
        ],
      ]),
    )
    const served = tryServeEthyGet(
      new EthyChunkStore(),
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_STATE_WITNESS',
      decoded,
      emptyCode,
      emptyStorage,
      { ...defaultEthyServeOpts, witnessStore, remoteBucketsBitmask: 0x0001 },
    )
    assert.equal(served!.code, EthyMessageCodes.STATE_WITNESS)
    assert.equal(served!.metric, 'witness')
    const groups = served!.rlp[1] as unknown[][]
    assert.equal(groups.length, 1)
    const accounts = groups[0]![2] as [Uint8Array, Uint8Array][]
    const slots = groups[0]![3] as [Uint8Array, Uint8Array, Uint8Array][]
    const proofNodes = groups[0]![4] as Uint8Array[]
    assert.equal(accounts.length, 2)
    assert.isTrue(equalsBytes(accounts[0]![0], acctA))
    assert.isTrue(equalsBytes(accounts[1]![0], acctB))
    assert.equal(slots.length, 2)
    assert.isTrue(equalsBytes(slots[0]![1], slot1))
    assert.isTrue(equalsBytes(slots[1]![1], slot2))
    assert.equal(proofNodes.length, 3) // sharedNode deduplicated
  })

  it('kind 1 covering range handles gap exclusion and complete vs incomplete right boundary', () => {
    const storage = new EthyStorageStore()
    const acct = new Uint8Array(32).fill(0x55)
    const root = new Uint8Array(32).fill(0x66)
    const s10 = new Uint8Array(32)
    s10[31] = 0x10
    const s30 = new Uint8Array(32)
    s30[31] = 0x30
    const slab = new Uint8Array(128)
    slab.set(s10, 0)
    slab.set(s30, 64)
    storage.put({
      accountHash: acct,
      storageRoot: root,
      chunkBlockNumber: 20n,
      slotsSlab64B: slab,
      complete: true,
      proofNodes: [new Uint8Array([0x99])],
    })
    // Target between s10 and s30 MUST include s10 as originSlotHash so range covers target
    const mid = new Uint8Array(32)
    mid[31] = 0x20
    const midSlice = storage.sliceKind1(acct, root, mid, 524_288)
    assert.notEqual(midSlice, undefined)
    assert.isTrue(equalsBytes(midSlice!.originSlotHash, s10))
    assert.isTrue(equalsBytes(midSlice!.lastSlotHash, s30))

    // Target after s30 on complete contract returns right boundary (hasRight = 0) proving exclusion
    const after = new Uint8Array(32)
    after[31] = 0x40
    const rightSlice = storage.sliceKind1(acct, root, after, 524_288)
    assert.notEqual(rightSlice, undefined)
    assert.equal(rightSlice!.hasRight, 0)
    assert.isTrue(equalsBytes(rightSlice!.lastSlotHash, s30))

    // Incomplete contract does NOT cover target after lastSlot
    storage.put({
      accountHash: acct,
      storageRoot: root,
      chunkBlockNumber: 20n,
      slotsSlab64B: slab,
      complete: false,
      proofNodes: [new Uint8Array([0x99])],
    })
    assert.equal(storage.sliceKind1(acct, root, after, 524_288), undefined)
  })

  it('GET_STATE_WITNESS throttles mask-0 remotes', () => {
    const witnessStore = new EthyWitnessStore()
    const throttle = { windowStartMs: Date.now(), count: 2 }
    const opts = {
      ...defaultEthyServeOpts,
      witnessStore,
      remoteBucketsBitmask: 0,
      witnessThrottle: throttle,
    }
    const decoded = RLP.decode(
      RLP.encode([
        bigIntToUnpaddedBytes(1n),
        bigIntToUnpaddedBytes(1n),
        intToUnpaddedBytes(524288),
        [[new Uint8Array(32).fill(0x01), []]],
      ]),
    )
    const served = tryServeEthyGet(
      new EthyChunkStore(),
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_STATE_WITNESS',
      decoded,
      emptyCode,
      emptyStorage,
      opts,
    )
    assert.equal(served!.metric, 'none')
    const groups = served!.rlp[1] as unknown[]
    assert.equal(groups.length, 0)
  })

  it('EthyStorageStore persists and serves kind-2 complete and multi-chunk kind-1 from disk', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-storage-disk-'))
    try {
      const acctComplete = new Uint8Array(32).fill(0xaa)
      const rootComplete = new Uint8Array(32).fill(0x11)
      const s01 = new Uint8Array(32)
      s01[31] = 0x01
      const slabComplete = new Uint8Array(64)
      slabComplete.set(s01, 0)
      slabComplete[63] = 0x42
      EthyStorageStore.writeDiskComplete(dir, {
        accountHash: acctComplete,
        storageRoot: rootComplete,
        chunkBlockNumber: 50n,
        slotsSlab64B: slabComplete,
      })

      const acctChunked = new Uint8Array(32).fill(0xbb)
      const rootChunked = new Uint8Array(32).fill(0x22)
      const s10 = new Uint8Array(32)
      s10[31] = 0x10
      const s30 = new Uint8Array(32)
      s30[31] = 0x30
      const slab1 = new Uint8Array(64)
      slab1.set(s10, 0)
      slab1[63] = 0x07
      const slab2 = new Uint8Array(64)
      slab2.set(s30, 0)
      slab2[63] = 0x09
      const proof1 = [new Uint8Array([0xaa, 0x01])]
      const proof2 = [new Uint8Array([0xbb, 0x02])]

      EthyStorageStore.writeDiskChunk(dir, {
        accountHash: acctChunked,
        storageRoot: rootChunked,
        chunkBlockNumber: 60n,
        originSlotHash: s10,
        lastSlotHash: s10,
        hasRight: 1,
        slotsSlab64B: slab1,
        proofNodes: proof1,
      })
      EthyStorageStore.writeDiskChunk(dir, {
        accountHash: acctChunked,
        storageRoot: rootChunked,
        chunkBlockNumber: 60n,
        originSlotHash: s30,
        lastSlotHash: s30,
        hasRight: 0,
        slotsSlab64B: slab2,
        proofNodes: proof2,
      })

      // Fresh store with zero RAM entries reads straight from disk
      const fresh = new EthyStorageStore()
      fresh.setStorageDir(dir)

      // kind-2 complete served from disk (chunked incomplete contract omitted)
      const kind2 = fresh.entriesKind2(
        [
          { accountHash: acctComplete, storageRoot: rootComplete },
          { accountHash: acctChunked, storageRoot: rootChunked },
        ],
        524_288,
      )
      assert.equal(kind2.length, 1)
      assert.isTrue(equalsBytes(kind2[0]!.accountHash, acctComplete))
      assert.isTrue(equalsBytes(kind2[0]!.slotsSlab64B, slabComplete))

      // kind-1 on complete disk record works with empty proofNodes (whole trie)
      const completeSlice = fresh.sliceKind1(
        acctComplete,
        rootComplete,
        new Uint8Array(32),
        524_288,
      )
      assert.isDefined(completeSlice)
      assert.equal(completeSlice!.hasRight, 0)
      assert.equal(completeSlice!.proofNodes.length, 0)

      // kind-1 on multi-chunk disk record serves exact covering chunk + proofs
      const c1 = fresh.sliceKind1(acctChunked, rootChunked, s10, 524_288)
      assert.isDefined(c1)
      assert.equal(c1!.hasRight, 1)
      assert.isTrue(equalsBytes(c1!.slotsSlab64B, slab1))
      assert.isTrue(equalsBytes(c1!.proofNodes[0]!, proof1[0]!))

      // Sequential crawl target between s10 and s30 advances to chunk 2
      const s20 = new Uint8Array(32)
      s20[31] = 0x20
      const c2 = fresh.sliceKind1(acctChunked, rootChunked, s20, 524_288)
      assert.isDefined(c2)
      assert.equal(c2!.hasRight, 0)
      assert.isTrue(equalsBytes(c2!.slotsSlab64B, slab2))
      assert.isTrue(equalsBytes(c2!.proofNodes[0]!, proof2[0]!))

      // Right-tail past s30 returns chunk 2 (hasRight = 0)
      const s40 = new Uint8Array(32)
      s40[31] = 0x40
      const tail = fresh.sliceKind1(acctChunked, rootChunked, s40, 524_288)
      assert.isDefined(tail)
      assert.equal(tail!.hasRight, 0)
      assert.isTrue(equalsBytes(tail!.lastSlotHash, s30))

      // Wrong storageRoot is rejected
      assert.equal(fresh.sliceKind1(acctChunked, rootComplete, s10, 524_288), undefined)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
})
