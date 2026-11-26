import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import {
  EthyChunkStore,
  EthyMessageCodes,
  EthyStorageStore,
  EthySubtreeRootBook,
  EthyWitnessStore,
  RollingBlockStore,
  SharedCodeDisk,
  tryServeEthyGet,
} from '@ethereumjs/devp2p'
import { MerklePatriciaTrie, createMerkleProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  equalsBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { ethyKeccak256 } from '../src/crypto/keccak.ts'
import { ethyWireKind, parseProvenCodePairs } from '../src/custody/custodyStorageCodec.ts'
import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { EthyCodeStorageSynchronizer } from '../src/sync/ethyCodeStorageSync.ts'
import {
  verifyProvenStorageKind1Job,
  verifyProvenStorageKind2Slab,
} from '../src/sync/snapVerifyJob.ts'

describe('custodyEthySync', () => {
  it('EthyCodeStorageSynchronizer persists verified code from PROVEN_STORAGE_OR_CODE', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-code-'))
    const spine = createSpine('sepolia', 11155111n)
    const root = new Uint8Array(32).fill(0x11)
    const tmp = SnapPivotStore.open({
      dataDir: dir,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: true,
    })
    tmp.activatePivot({ blockNumber: 1n, blockHash: new Uint8Array(32), stateRoot: root })
    const stateManager = createFlatStateManager()
    const code = new Uint8Array([0x60, 0x00, 0x60, 0x00, 0xfd])
    const codeHash = keccak_256(code)
    const bucket = codeHash[0]! >> 4
    spine.custodyBuckets = [bucket]

    const client = {
      setSharedCodeDir: () => {},
      setEthyStorageDir: () => {},
      sendEthyMessage: () => {},
    }

    let notedBucket: number | undefined
    const sync = new EthyCodeStorageSynchronizer({
      spine,
      client: client as never,
      stateManager,
      snapStore: tmp,
      buckets: [bucket],
      getPeers: () => [],
      onCodeBatchForBucket: (idx) => {
        notedBucket = idx
      },
    })
    sync.start()
    const peerId = `0x${'aa'.repeat(32)}`
    sync.requestCode(peerId, 42n, codeHash)

    const reply = RLP.encode([
      bigIntToUnpaddedBytes(42n),
      intToUnpaddedBytes(0),
      [[codeHash, code]],
    ] as never)
    sync.handleEthyResponse(peerId, EthyMessageCodes.PROVEN_STORAGE_OR_CODE, reply)
    await new Promise((r) => setTimeout(r, 20))

    assert.isTrue(tmp.hasPersistedCode(codeHash))
    assert.equal(notedBucket, bucket)
    sync.stop()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('kind=2 storage batch persists verified slab and completes storage plane', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-stor-'))
    const spine = createSpine('sepolia', 11155111n)
    const pivotRoot = new Uint8Array(32).fill(0x22)
    const store = SnapPivotStore.open({
      dataDir: dir,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: true,
    })
    store.activatePivot({ blockNumber: 2n, blockHash: new Uint8Array(32), stateRoot: pivotRoot })
    const accountHash = new Uint8Array(32)
    accountHash[0] = 0xa0
    const bucket = accountHash[0]! >> 4
    spine.custodyBuckets = [bucket]

    const trie = new MerklePatriciaTrie({ useKeyHashingFunction: ethyKeccak256 })
    const slotHash = keccak_256(new Uint8Array([0x01]))
    const slotValBe = new Uint8Array(32)
    slotValBe[31] = 0x02
    await trie.put(slotHash, RLP.encode(bytesToBigInt(slotValBe)))
    const storageRoot = trie.root()
    const slab = new Uint8Array(64)
    slab.set(slotHash, 0)
    slab.set(slotValBe, 32)

    const stateManager = createFlatStateManager()
    const peerId = `0x${'bb'.repeat(32)}`
    let capturedReqId = 0n
    let storagePlaneBucket: number | undefined
    const client = {
      setSharedCodeDir: () => {},
      setEthyStorageDir: () => {},
      sendEthyMessage: (_peer: Uint8Array, _code: number, payload: Uint8Array) => {
        const d = RLP.decode(payload) as unknown[]
        capturedReqId = bytesToBigInt(d[0] as Uint8Array)
      },
    }
    const sync = new EthyCodeStorageSynchronizer({
      spine,
      client: client as never,
      stateManager,
      snapStore: store,
      buckets: [bucket],
      getPeers: () => [
        {
          id: peerId,
          ethySession: true,
          ethyStatus: {
            bucketsBitmask: '0',
            codeBucketsBitmask: '0',
            storageBucketsBitmask: `0x${(1 << bucket).toString(16)}`,
            basePivotBlock: '100',
          },
        } as never,
      ],
      onStorageBatchForBucket: (idx) => {
        storagePlaneBucket = idx
      },
    })
    sync.start()
    sync.noteAccounts([
      { accountHash, codeHash: new Uint8Array(32), storageRoot: new Uint8Array(storageRoot) },
    ])
    assert.notEqual(capturedReqId, 0n)
    sync.handleEthyResponse(
      peerId,
      EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
      RLP.encode([
        bigIntToUnpaddedBytes(capturedReqId),
        intToUnpaddedBytes(2),
        [[accountHash, storageRoot, slab]],
      ] as never),
    )
    await new Promise((r) => setTimeout(r, 20))
    assert.isTrue(store.hasPersistedStorageAccount(accountHash))
    assert.equal(storagePlaneBucket, bucket)
    sync.stop()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('waitForAccountsFinish prevents premature code/storage plane completion before bucket accounts finish', () => {
    const spine = createSpine('sepolia', 11155111n)
    const bucket = 0x2
    spine.custodyBuckets = [bucket]
    const accountHash = new Uint8Array(32)
    accountHash[0] = bucket << 4

    const codeCompleted: number[] = []
    const storageCompleted: number[] = []
    const client = {
      setSharedCodeDir: () => {},
      setEthyStorageDir: () => {},
      sendEthyMessage: () => {},
    }
    const sync = new EthyCodeStorageSynchronizer({
      spine,
      client: client as never,
      stateManager: createFlatStateManager(),
      buckets: [bucket],
      getPeers: () => [],
      waitForAccountsFinish: true,
      onCodeBatchForBucket: (idx) => codeCompleted.push(idx),
      onStorageBatchForBucket: (idx) => storageCompleted.push(idx),
    })
    sync.start()
    // EOA-only early chunk must NOT mark code/storage planes complete yet.
    sync.noteAccounts([
      {
        accountHash,
        codeHash: keccak_256(new Uint8Array(0)),
        storageRoot: keccak_256(new Uint8Array([0x80])),
      },
    ])
    assert.deepEqual(codeCompleted, [])
    assert.deepEqual(storageCompleted, [])

    sync.markAccountsFinished(bucket)
    assert.deepEqual(codeCompleted, [bucket])
    assert.deepEqual(storageCompleted, [bucket])
    // Idempotent on duplicate markAccountsFinished.
    sync.markAccountsFinished(bucket)
    assert.deepEqual(codeCompleted, [bucket])
    assert.deepEqual(storageCompleted, [bucket])
    sync.stop()
  })

  it('2-hop disk-only re-serving: Node B persists synced code + kind-2 + kind-1 storage and serves Node C from disk', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-2hop-disk-'))
    try {
      const spine = createSpine('sepolia', 11155111n)
      spine.pivotBlockNumber = 42n
      const store = SnapPivotStore.open({
        dataDir: dir,
        network: 'sepolia',
        chainId: 11155111n,
        genesisHash: networkGenesisHash('sepolia'),
        enabled: true,
      })
      store.activatePivot({
        blockNumber: 42n,
        blockHash: new Uint8Array(32),
        stateRoot: new Uint8Array(32).fill(0x77),
      })

      // 1. Contract A (bytecode + kind-2 small storage) and Contract B (kind-1 chunked storage)
      const code = new Uint8Array([0x60, 0x80, 0x60, 0x40, 0x52, 0x00])
      const codeHash = keccak_256(code)
      const bucket = 0x5
      spine.custodyBuckets = [bucket]

      const acctSmall = new Uint8Array(32)
      acctSmall[0] = (bucket << 4) | 0x01
      const trieSmall = new MerklePatriciaTrie({
        useKeyHashing: false,
        useKeyHashingFunction: ethyKeccak256,
      })
      const slotSmall = keccak_256(new Uint8Array([0x11]))
      const valSmall = new Uint8Array(32)
      valSmall[31] = 0x05
      await trieSmall.put(slotSmall, RLP.encode(bytesToBigInt(valSmall)))
      const rootSmall = trieSmall.root()
      const slabSmall = new Uint8Array(64)
      slabSmall.set(slotSmall, 0)
      slabSmall.set(valSmall, 32)

      const acctChunked = new Uint8Array(32)
      acctChunked[0] = (bucket << 4) | 0x02
      const trieChunked = new MerklePatriciaTrie({
        useKeyHashing: false,
        useKeyHashingFunction: ethyKeccak256,
      })
      const slotChunk = keccak_256(new Uint8Array([0x22]))
      const valChunk = new Uint8Array(32)
      valChunk[31] = 0x09
      await trieChunked.put(slotChunk, RLP.encode(bytesToBigInt(valChunk)))
      const rootChunked = trieChunked.root()
      const slabChunk = new Uint8Array(64)
      slabChunk.set(slotChunk, 0)
      slabChunk.set(valChunk, 32)
      const proofChunk = await createMerkleProof(trieChunked, slotChunk)

      const peerA = `0x${'aa'.repeat(32)}`
      let codeDirSet: string | undefined
      let storageDirSet: string | undefined
      const sentReqs: Array<{ reqId: bigint; kind: number }> = []
      const client = {
        setSharedCodeDir: (d: string | undefined) => {
          codeDirSet = d
        },
        setEthyStorageDir: (d: string | undefined) => {
          storageDirSet = d
        },
        sendEthyMessage: (_peer: Uint8Array, _code: number, payload: Uint8Array) => {
          const d = RLP.decode(payload) as unknown[]
          sentReqs.push({ reqId: bytesToBigInt(d[0] as Uint8Array), kind: ethyWireKind(d[1]) })
        },
      }

      const sync = new EthyCodeStorageSynchronizer({
        spine,
        client: client as never,
        stateManager: createFlatStateManager(),
        snapStore: store,
        buckets: [bucket],
        getPeers: () => [
          {
            id: peerA,
            ethySession: true,
            ethyStatus: {
              bucketsBitmask: `0x${(1 << bucket).toString(16)}`,
              codeBucketsBitmask: `0x${(1 << bucket).toString(16)}`,
              storageBucketsBitmask: `0x${(1 << bucket).toString(16)}`,
              basePivotBlock: '42',
            },
          } as never,
        ],
      })
      sync.start()
      assert.equal(codeDirSet, store.sharedCodeDir())
      assert.equal(storageDirSet, store.activePivotStorageChunksDir())

      sync.noteAccounts([
        { accountHash: acctSmall, codeHash, storageRoot: new Uint8Array(rootSmall) },
        {
          accountHash: acctChunked,
          codeHash: keccak_256(new Uint8Array(0)),
          storageRoot: new Uint8Array(rootChunked),
        },
      ])
      const codeReq = sentReqs.find((r) => r.kind === 0)!
      const kind2Req = sentReqs.find((r) => r.kind === 2)!
      assert.isDefined(codeReq)
      assert.isDefined(kind2Req)

      // Node A delivers code (kind=0)
      sync.handleEthyResponse(
        peerA,
        EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
        RLP.encode([bigIntToUnpaddedBytes(codeReq.reqId), intToUnpaddedBytes(0), [code]] as never),
      )
      // Node A delivers acctSmall via kind=2 and omits acctChunked (triggers kind=1 fallback)
      sync.handleEthyResponse(
        peerA,
        EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
        RLP.encode([
          bigIntToUnpaddedBytes(kind2Req.reqId),
          intToUnpaddedBytes(2),
          [[acctSmall, rootSmall, slabSmall]],
        ] as never),
      )
      await new Promise((r) => setTimeout(r, 30))

      const kind1Req = sentReqs.find((r) => r.kind === 1)!
      assert.isDefined(kind1Req)
      sync.handleEthyResponse(
        peerA,
        EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
        RLP.encode([
          bigIntToUnpaddedBytes(kind1Req.reqId),
          intToUnpaddedBytes(1),
          acctChunked,
          rootChunked,
          bigIntToUnpaddedBytes(42n),
          slotChunk,
          slotChunk,
          intToUnpaddedBytes(0),
          slabChunk,
          proofChunk,
        ] as never),
      )
      await new Promise((r) => setTimeout(r, 30))
      sync.stop()

      // 2. Fresh devp2p server instances pointed ONLY at Node B's disk dirs (ZERO RAM priming!)
      const freshCodeDisk = new SharedCodeDisk()
      freshCodeDisk.setCodeDir(codeDirSet)
      const freshStorageStore = new EthyStorageStore()
      freshStorageStore.setStorageDir(storageDirSet)
      const serveOpts = {
        witnessStore: new EthyWitnessStore(),
        subtreeBook: new EthySubtreeRootBook(),
        remoteBucketsBitmask: 0xffff,
        witnessThrottle: { windowStartMs: 0, count: 0 },
      }

      // Node C requests code (kind=0) from Node B disk
      const servedCode = tryServeEthyGet(
        new EthyChunkStore(),
        new RollingBlockStore(),
        [],
        new Uint8Array(64),
        undefined,
        'GET_PROVEN_STORAGE_OR_CODE',
        RLP.decode(RLP.encode([bigIntToUnpaddedBytes(1n), intToUnpaddedBytes(0), [codeHash]])),
        freshCodeDisk,
        freshStorageStore,
        serveOpts,
      )
      assert.isDefined(servedCode)
      const codePairs = parseProvenCodePairs(servedCode!.rlp as unknown[])
      assert.equal(codePairs.length, 1)
      assert.isTrue(equalsBytes(codePairs[0]![1], code))

      // Node C requests acctSmall via kind=2 from Node B disk
      const servedKind2 = tryServeEthyGet(
        new EthyChunkStore(),
        new RollingBlockStore(),
        [],
        new Uint8Array(64),
        undefined,
        'GET_PROVEN_STORAGE_OR_CODE',
        RLP.decode(
          RLP.encode([bigIntToUnpaddedBytes(2n), intToUnpaddedBytes(2), [[acctSmall, rootSmall]]]),
        ),
        freshCodeDisk,
        freshStorageStore,
        serveOpts,
      )
      assert.isDefined(servedKind2)
      const kind2Entries = (servedKind2!.rlp as unknown[])[2] as unknown[][]
      assert.equal(kind2Entries.length, 1)
      const v2 = await verifyProvenStorageKind2Slab(rootSmall, kind2Entries[0]![2] as Uint8Array)
      assert.isTrue(v2.ok)

      // Node C requests acctChunked via kind=1 from Node B disk
      const servedKind1 = tryServeEthyGet(
        new EthyChunkStore(),
        new RollingBlockStore(),
        [],
        new Uint8Array(64),
        undefined,
        'GET_PROVEN_STORAGE_OR_CODE',
        RLP.decode(
          RLP.encode([
            bigIntToUnpaddedBytes(3n),
            intToUnpaddedBytes(1),
            acctChunked,
            rootChunked,
            slotChunk,
          ]),
        ),
        freshCodeDisk,
        freshStorageStore,
        serveOpts,
      )
      assert.isDefined(servedKind1)
      const r1 = servedKind1!.rlp as unknown[]
      const v1 = await verifyProvenStorageKind1Job({
        storageRoot: rootChunked,
        originSlotHash: r1[5] as Uint8Array,
        slotsSlab64B: r1[8] as Uint8Array,
        proofNodes: (r1[9] as Uint8Array[]) ?? [],
        hasRightHint: ethyWireKind(r1[7]) !== 0,
      })
      assert.isTrue(v1.ok)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
})
