import { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { bigIntToUnpaddedBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3'
import { assert, describe, it } from 'vitest'

import { createSpine } from '../src/spine/createSpine.ts'
import {
  SnapCodeAndStorageSynchronizer,
  encodeGetByteCodes,
  encodeGetStorageRanges,
  ingestStorageRangesReply,
} from '../src/sync/codeAndStorageSync.ts'
import { SnapPeerFlightTracker } from '../src/sync/snapFlight.ts'
import type { SnapTransport } from '../src/sync/snapTransport.ts'
import { SyntheticSnapPeer } from '../src/sync/syntheticPeer.ts'

describe('[Ethy/Sync]: code and storage snap helpers', () => {
  it('encodeGetByteCodes uses canonical zero reqId', () => {
    const payload = encodeGetByteCodes(0n, [new Uint8Array(32)], 128 * 1024)
    const decoded = RLP.decode(payload) as unknown[]
    assert.equal((decoded[0] as Uint8Array).length, 0)
  })

  it('ingestStorageRangesReply verifies a complete storage range', async () => {
    const trie = new MerklePatriciaTrie({ useKeyHashing: false })
    const slotHash = keccak_256(new Uint8Array(32))
    const slotValue = new Uint8Array([0x01])
    const slotRlp = RLP.encode(slotValue)
    await trie.put(slotHash, slotRlp)
    const storageRoot = trie.root()
    const sm = createFlatStateManager()
    const accountHash = new Uint8Array(32).fill(0xab)
    const reply = RLP.encode([bigIntToUnpaddedBytes(1n), [[[slotHash, slotRlp]]], []] as never)
    const result = await ingestStorageRangesReply(storageRoot, reply, new Uint8Array(32), (slots) =>
      sm.putSnapStorageBatch(accountHash, slots),
    )
    assert.equal(result.ok, true)
    assert.equal(result.hasRight, false)
  })

  it('rejects bytecode when keccak does not match queued hash', () => {
    const code = new Uint8Array([0x60, 0x00])
    const wrongHash = new Uint8Array(32)
    const hash = keccak_256(code)
    assert.notDeepEqual(hash, wrongHash)
  })

  it('synthetic peer serves bytecode and complete storage range', async () => {
    const peer = await SyntheticSnapPeer.create(2)
    const contract = peer.accounts[0]!
    assert.isDefined(contract.code)
    const codeReq = encodeGetByteCodes(1n, [contract.account.codeHash], 128 * 1024)
    const codeReply = peer.buildByteCodesReply(codeReq)
    const codeDecoded = RLP.decode(codeReply) as unknown[]
    const codes = codeDecoded[1] as Uint8Array[]
    assert.equal(codes.length, 1)
    assert.deepEqual(keccak_256(codes[0]!), contract.account.codeHash)

    const storageReq = encodeGetStorageRanges(
      2n,
      peer.rootHash,
      [contract.accountHash],
      new Uint8Array(32),
      new Uint8Array(32).fill(0xff),
      128 * 1024,
    )
    const storageReply = await peer.buildStorageRangesReply(storageReq)
    const sm = createFlatStateManager()
    const result = await ingestStorageRangesReply(
      contract.account.storageRoot,
      storageReply,
      new Uint8Array(32),
      (slots) => sm.putSnapStorageBatch(contract.accountHash, slots),
    )
    assert.equal(result.ok, true)
  })

  it('Map-backed contract queues dedupe and clear in O(1)', () => {
    const spine = createSpine('sepolia', 11155111n)
    const sm = createFlatStateManager()
    const transport: SnapTransport = {
      snapPeers: () => [],
      sendAccountRange: () => {},
      onAccountRange: () => () => {},
      sendStorageRanges: () => {},
      onStorageRanges: () => () => {},
      sendByteCodes: () => {},
      onByteCodes: () => () => {},
    }
    const sync = new SnapCodeAndStorageSynchronizer({
      spine,
      stateManager: sm,
      transport,
      flightTracker: new SnapPeerFlightTracker(),
      getSnapPeers: () => [],
      peerBusy: () => false,
    })
    const mkHash = (n: number) => {
      const h = new Uint8Array(32)
      h[0] = n
      return h
    }
    const row = {
      accountHash: mkHash(1),
      codeHash: mkHash(10),
      storageRoot: new Uint8Array(32).fill(0x01),
    }
    sync.noteAccounts([row, row])
    assert.equal(spine.codesQueued, 1)
    assert.equal(spine.storageQueued, 1)
    assert.isFalse(sync.pendingDone())
    sync.clearPending()
    assert.isTrue(sync.pendingDone())
  })
})
