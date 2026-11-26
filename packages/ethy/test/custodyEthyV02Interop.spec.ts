import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { EthyMessageCodes } from '@ethereumjs/devp2p'
import type { WorkerPeerSnapshot } from '@ethereumjs/devp2p'
import { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToUnprefixedHex,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { ethyKeccak256 } from '../src/crypto/keccak.ts'
import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { EthyCodeStorageSynchronizer } from '../src/sync/ethyCodeStorageSync.ts'

/** Legacy ETHY/0 STATUS (9-tuple): accounts bitmask only; code/storage default to 0. */
function legacyAccountsOnlyPeer(peerId: string, bucket: number): WorkerPeerSnapshot {
  return {
    id: peerId,
    clientId: 'ethy-v0.2-test',
    caps: [],
    ethySession: true,
    ethyStatus: {
      basePivotBlock: '50',
      basePivotStateRoot: `${'dd'.repeat(64)}`,
      bucketsBitmask: `0x${(1 << bucket).toString(16)}`,
      balEarliestBlock: '50',
      balLatestBlock: '50',
      latestBlockHash: `${'ee'.repeat(64)}`,
    },
  }
}

describe('custodyEthyV02Interop', () => {
  it('accounts-only v0.2 peer does not trigger code/storage ETHY fetches', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-v02-'))
    const spine = createSpine('sepolia', 11155111n)
    const accountHash = new Uint8Array(32)
    accountHash[0] = 0x40
    const bucket = accountHash[0]! >> 4
    spine.custodyBuckets = [bucket]
    const codeHash = keccak_256(new Uint8Array([0x60, 0x00, 0x60, 0x00, 0xfd]))

    const trie = new MerklePatriciaTrie({ useKeyHashingFunction: ethyKeccak256 })
    const slotHash = keccak_256(new Uint8Array([1]))
    const slotVal = new Uint8Array(32)
    slotVal[31] = 3
    await trie.put(slotHash, RLP.encode(bytesToBigInt(slotVal)))
    const storageRoot = trie.root()

    const store = SnapPivotStore.open({
      dataDir: dir,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: true,
    })
    store.activatePivot({
      blockNumber: 10n,
      blockHash: new Uint8Array(32),
      stateRoot: new Uint8Array(32).fill(0x55),
    })

    const peerId = `0x${'f2'.repeat(32)}`
    let ethyOut = 0
    const client = {
      setSharedCodeDir: () => {},
      setEthyStorageDir: () => {},
      sendEthyMessage: (_peer: Uint8Array, code: number) => {
        if (code === EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE) {
          ethyOut += 1
        }
      },
    }

    const sync = new EthyCodeStorageSynchronizer({
      spine,
      client: client as never,
      stateManager: createFlatStateManager(),
      snapStore: store,
      buckets: [bucket],
      getPeers: () => [legacyAccountsOnlyPeer(peerId, bucket)],
    })
    sync.start()
    sync.noteAccounts([{ accountHash, codeHash, storageRoot: new Uint8Array(storageRoot) }])
    await new Promise((r) => setTimeout(r, 40))
    assert.equal(ethyOut, 0)
    assert.isTrue(sync.isRunning())
    sync.stop()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('v0.4 storage peer still serves kind-2 after legacy peer is present', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-v02-v4-'))
    const spine = createSpine('sepolia', 11155111n)
    const accountHash = new Uint8Array(32)
    accountHash[0] = 0x50
    const bucket = accountHash[0]! >> 4
    const trie = new MerklePatriciaTrie({ useKeyHashingFunction: ethyKeccak256 })
    const slotHash = keccak_256(new Uint8Array([2]))
    const slotVal = new Uint8Array(32)
    slotVal[31] = 9
    await trie.put(slotHash, RLP.encode(bytesToBigInt(slotVal)))
    const storageRoot = trie.root()
    const slab = new Uint8Array(64)
    slab.set(slotHash, 0)
    slab.set(slotVal, 32)

    const store = SnapPivotStore.open({
      dataDir: dir,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: true,
    })
    store.activatePivot({
      blockNumber: 2n,
      blockHash: new Uint8Array(32),
      stateRoot: new Uint8Array(32).fill(0x66),
    })

    const legacyId = `0x${'a2'.repeat(32)}`
    const modernId = `0x${'b4'.repeat(32)}`
    let kind2Req = 0n
    const client = {
      setSharedCodeDir: () => {},
      setEthyStorageDir: () => {},
      sendEthyMessage: (peer: Uint8Array, code: number, payload: Uint8Array) => {
        if (code !== EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE) return
        const who = bytesToUnprefixedHex(peer)
        if (who !== modernId.slice(2).toLowerCase()) return
        const d = RLP.decode(payload) as unknown[]
        kind2Req = bytesToBigInt(d[0] as Uint8Array)
      },
    }

    const modernPeer: WorkerPeerSnapshot = {
      ...legacyAccountsOnlyPeer(modernId, bucket),
      ethyStatus: {
        basePivotBlock: '20',
        basePivotStateRoot: `${'ff'.repeat(64)}`,
        bucketsBitmask: `0x${(1 << bucket).toString(16)}`,
        storageBucketsBitmask: `0x${(1 << bucket).toString(16)}`,
        codeBucketsBitmask: '0',
        balEarliestBlock: '20',
        balLatestBlock: '20',
        latestBlockHash: `${'11'.repeat(64)}`,
      },
    }

    const sync = new EthyCodeStorageSynchronizer({
      spine,
      client: client as never,
      stateManager: createFlatStateManager(),
      snapStore: store,
      buckets: [bucket],
      getPeers: () => [legacyAccountsOnlyPeer(legacyId, bucket), modernPeer],
    })
    sync.start()
    sync.noteAccounts([
      { accountHash, codeHash: new Uint8Array(32), storageRoot: new Uint8Array(storageRoot) },
    ])
    await new Promise((r) => setTimeout(r, 30))
    assert.notEqual(kind2Req, 0n)
    sync.handleEthyResponse(
      modernId,
      EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
      RLP.encode([
        bigIntToUnpaddedBytes(kind2Req),
        intToUnpaddedBytes(2),
        [[accountHash, storageRoot, slab]],
      ] as never),
    )
    await new Promise((r) => setTimeout(r, 20))
    assert.isTrue(store.hasPersistedStorageAccount(accountHash))
    sync.stop()
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
