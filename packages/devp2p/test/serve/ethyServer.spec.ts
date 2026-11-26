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

  it('GET_SUBTREE_ROOTS serves entries from EthySubtreeRootBook', () => {
    const book = new EthySubtreeRootBook()
    const root = new Uint8Array(32).fill(0x11)
    book.ingest(100n, [[intToUnpaddedBytes(3), root]])
    const opts = { ...defaultEthyServeOpts, subtreeBook: book }
    const decoded = RLP.decode(
      RLP.encode([bigIntToUnpaddedBytes(1n), bigIntToUnpaddedBytes(100n), intToUnpaddedBytes(8)]),
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
    const wire = served!.rlp[2] as unknown[]
    assert.equal(wire.length, 1)
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
})
