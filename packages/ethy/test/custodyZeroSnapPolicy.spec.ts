import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { EthyMessageCodes } from '@ethereumjs/devp2p'
import { MerklePatriciaTrie, createMerkleProof } from '@ethereumjs/mpt'
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
import { bootNetworkProfile } from '../src/sync/machineOrchestrator.ts'

describe('custodyZeroSnapPolicy', () => {
  it('bootNetworkProfile(ethy, snapBootstrap=false) omits snap/1', () => {
    const profile = bootNetworkProfile('ethy', false)
    assert.notInclude(profile.capabilities, 'snap1')
    assert.include(profile.capabilities, 'ethy0')
  })

  it('kind-2 miss enqueues kind-1 crawl and persists verified slab', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-kind1-'))
    const spine = createSpine('sepolia', 11155111n)
    const accountHash = new Uint8Array(32)
    accountHash[0] = 0x30
    const bucket = accountHash[0]! >> 4
    spine.custodyBuckets = [bucket]
    const store = SnapPivotStore.open({
      dataDir: dir,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: true,
    })
    store.activatePivot({
      blockNumber: 1n,
      blockHash: new Uint8Array(32),
      stateRoot: new Uint8Array(32).fill(0x44),
    })

    const trie = new MerklePatriciaTrie({ useKeyHashingFunction: ethyKeccak256 })
    const slotHash = keccak_256(new Uint8Array([4]))
    const slotValBe = new Uint8Array(32)
    slotValBe[31] = 7
    await trie.put(slotHash, RLP.encode(bytesToBigInt(slotValBe)))
    const storageRoot = trie.root()
    const slab = new Uint8Array(64)
    slab.set(slotHash, 0)
    slab.set(slotValBe, 32)

    const peerId = `0x${'cc'.repeat(32)}`
    let kind2ReqId = 0n
    let kind1ReqId = 0n
    const client = {
      setSharedCodeDir: () => {},
      setEthyStorageDir: () => {},
      sendEthyMessage: (_peer: Uint8Array, _code: number, payload: Uint8Array) => {
        const d = RLP.decode(payload) as unknown[]
        const id = bytesToBigInt(d[0] as Uint8Array)
        const kind = Number(d[1])
        if (kind === 2) kind2ReqId = id
        if (kind === 1) kind1ReqId = id
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
          id: peerId,
          ethySession: true,
          ethyStatus: {
            bucketsBitmask: '0',
            codeBucketsBitmask: '0',
            storageBucketsBitmask: `0x${(1 << bucket).toString(16)}`,
            basePivotBlock: '10',
          },
        } as never,
      ],
    })
    sync.start()
    sync.noteAccounts([
      { accountHash, codeHash: new Uint8Array(32), storageRoot: new Uint8Array(storageRoot) },
    ])
    await new Promise((r) => setTimeout(r, 20))
    assert.notEqual(kind2ReqId, 0n)

    sync.handleEthyResponse(
      peerId,
      EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
      RLP.encode([bigIntToUnpaddedBytes(kind2ReqId), intToUnpaddedBytes(2), []] as never),
    )
    await new Promise((r) => setTimeout(r, 30))
    assert.notEqual(kind1ReqId, 0n)

    const origin = new Uint8Array(32)
    const proofs = await createMerkleProof(trie, slotHash)
    sync.handleEthyResponse(
      peerId,
      EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
      RLP.encode([
        bigIntToUnpaddedBytes(kind1ReqId),
        intToUnpaddedBytes(1),
        accountHash,
        storageRoot,
        bigIntToUnpaddedBytes(1n),
        origin,
        slotHash,
        intToUnpaddedBytes(0),
        slab,
        proofs,
      ] as never),
    )
    await new Promise((r) => setTimeout(r, 30))
    assert.isTrue(store.hasPersistedStorageAccount(accountHash))
    sync.stop()
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
