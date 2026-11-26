import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { EthyMessageCodes } from '@ethereumjs/devp2p'
import { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { bigIntToUnpaddedBytes, bytesToBigInt, intToUnpaddedBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { ethyKeccak256 } from '../src/crypto/keccak.ts'
import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { EthyCodeStorageSynchronizer } from '../src/sync/ethyCodeStorageSync.ts'

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
})
